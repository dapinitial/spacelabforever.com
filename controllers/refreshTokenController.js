const { databaseId, usersContainerId, cosmosClient } = require('../utils/utils');
const client = cosmosClient;
const container = client.database(databaseId).container(usersContainerId);
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
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

    if (results.length === 0) return res.sendStatus(403); // Forbidden

    const foundUser = results[0];

    // Evaluate the JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET, // Use your own secret
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const roles = Object.values(foundUser.roles);

            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: decoded.username,
                        roles: roles,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET, // Use your own secret
                { expiresIn: '1m' }
            );

            res.json({ roles, accessToken });
        }
    );
};

module.exports = { handleRefreshToken };