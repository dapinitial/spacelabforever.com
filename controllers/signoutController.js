const { databaseId, usersContainerId, cosmosClient } = require('../utils/utils');
const database = cosmosClient.database(databaseId);
const container = database.container(usersContainerId);

const handleSignout = async (req, res) => {
    // On the client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;

    // Check if refreshToken exists in the Cosmos DB container
    const querySpec = {
        query: 'SELECT * FROM c WHERE c.refreshToken = @refreshToken',
        parameters: [
            {
                name: '@refreshToken',
                value: refreshToken,
            },
        ],
    };

    const { resources: results } = await container.items.query(querySpec).fetchAll();

    if (results.length === 0) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    const foundUser = results[0];

    // Clear refreshToken in the Cosmos DB container
    foundUser.refreshToken = '';
    await container.items.upsert(foundUser);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
};

module.exports = { handleSignout };