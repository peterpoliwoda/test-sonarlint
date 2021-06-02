const axios = require('axios');

const DB_KEYCLOAK_CLIENT_ID = 'secret-sauce';
const DB_KEYCLOAK_CLIENT_SECRET = 'secret-sauce';
const MY_GRANT_TYPE = 'secret-sauce';

async function getAuthenticationToken() {
    try {
        const tokenUri = `${keycloakAuthServerUrl}realms/${keycloakRealm}/protocol/openid-connect/token`;

        const params = new URLSearchParams();
        params.append('client_id', DB_KEYCLOAK_CLIENT_ID);
        params.append('client_secret', DB_KEYCLOAK_CLIENT_SECRET);
        params.append('grant_type', MY_GRANT_TYPE);

        const { data } = await axios.post(
            tokenUri,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return data.access_token;
    } catch (err) {
        logger.error('[getAuthenticationToken] Error getting authentication token', err);
        throw err;
    }
}

async function insertToMd4DatabaseApi(dbTable, data) {
    logger.info('[insertToMd4DatabaseApi] Insert data to Database API', { dbTable });
    logger.debug('[insertToMd4DatabaseApi] Data being saved', { dbTable, data });
    try {
        const authToken = await getAuthenticationToken(); // This part gets underlined by Sonar lint
        return axios.post(`/${dbTable}`, data, {
            baseURL: apiBaseUri,
            headers: {
                'some-auth-stuff': `Bearer ${authToken}`
            }
        });
    } catch (err) {
        logger.error('[insertToMd4DatabaseApi] Error saving data to Database API', err);
        throw err;
    }
}

module.exports = { insertToMd4DatabaseApi };
