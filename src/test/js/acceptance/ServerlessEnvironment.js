const NodeEnvironment = require('jest-environment-node')
const uuidv1 = require('uuid/v1')
const { spawn } = require('child_process')
const AWS = require('aws-sdk')
const pt = require('prepend-transform').pt
AWS.config.update({region:'eu-west-2'})

class ServerlessEnvironment extends NodeEnvironment {
    constructor(config, context) {
        super(config, context)
        this.stageName = `acceptance-${uuidv1().slice(0, 7)}`
        this.serviceName = config.testEnvironmentOptions.serviceName
    }

    async setup() {
        await super.setup()
        await this.createServerlessStack()

        const endpoint = await this.getAPIGatewayEndpoint()
        console.log(`API Gateway endpoint: ${endpoint}`)
        this.global.apiGatewayEndpoint = endpoint
    }

    async teardown() {
        await this.destroyServerlessStack()
        await super.teardown()
    }

    runScript(script) {
        return super.runScript(script)
    }

    createServerlessStack() {
        console.log(`Creating Serverless stack: ${this.stageName}`)
        return this.runSererlessCommand(this.stageName,'serverless', 'deploy', '--stage', this.stageName)
    }

     destroyServerlessStack() {
        console.log(`Destroying Serverless stack: ${this.stageName}`)
        return this.runSererlessCommand(this.stageName, 'serverless', 'remove', '--stage', this.stageName)
    }

    async getAPIGatewayEndpoint() {
        const cloudformation = new AWS.CloudFormation({ apiVersion: '2010-05-15' })
        
        try {
            const StackName = `${this.serviceName}-${this.stageName}`
            const stack = await cloudformation.describeStacks({ StackName }).promise()
            const endpoint = stack.Stacks[0].Outputs.find(output => output.OutputKey === 'ServiceEndpoint').OutputValue
            return endpoint
        } catch (e) {
            console.log('Failed to get API Gateway endpoint', e)
        }
    }

    runSererlessCommand(prefix, command, ...args) {
        prefix = `[${prefix}] `
        console.log(`${prefix} Running command '${command} ${args.join(' ')}'`)
        const child = spawn(command, args);
            
        child.stdout.pipe(pt(prefix)).pipe(process.stdout);
        child.stderr.pipe(pt(prefix)).pipe(process.stderr);

        return new Promise((resolve, reject) => {
            child.on('close', code => {
                console.log(`[${prefix}] Finished running '${command} ${args.join(' ')}' ${(code === 0) ? 'suceeded' : 'failed'}`)
                if (code === 0) {
                    resolve()
                } else {
                    reject()
                }
            })
        })
    }
}

module.exports = ServerlessEnvironment