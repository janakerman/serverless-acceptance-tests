const axios = require('axios');

describe('Feature 1 acceptance tests', () => {

    beforeAll(async () => {
        const apiGatewayEndpoint = await global.apiGatewayEndpoint
        this.endpoint = `${apiGatewayEndpoint}/hello`
    })

    test('Hello test 1', async () => {
        const createResponse = await axios.get(this.endpoint)
        expect(createResponse.status).toBe(200)
    })

})