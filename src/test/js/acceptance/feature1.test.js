const axios = require('axios');

describe('Feature 2 acceptance tests', () => {

    beforeAll(async () => {
        const apiGatewayEndpoint = await global.apiGatewayEndpoint
        this.addOfficeEndpoint = `${apiGatewayEndpoint}/hello`
    })

    test('Hello test 1', async () => {
        const createResponse = await axios.post(this.addOfficeEndpoint)
        expect(createResponse.status).toBe(200)
    })

})