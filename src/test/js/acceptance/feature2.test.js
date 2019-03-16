const axios = require('axios');

describe('Feature 2 acceptance tests', () => {

    beforeAll(async () => {
        const apiGatewayEndpoint = await global.apiGatewayEndpoint
        this.endpoint = `${apiGatewayEndpoint}/hello`
    })

    test('Hello test 2', async () => {
        const createResponse = await axios.get(this.endpoint)
        expect(createResponse.status).toBe(200)
    })

})