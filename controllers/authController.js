const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { databaseId, usersContainerId, cosmosClient } = require('../utils/utils');
const client = cosmosClient;

// Reference to your Cosmos DB container
const container = client.database(databaseId).container(usersContainerId);

// @desc Login
// @route POST /signin
// @access Public

const signin = async (req, res) => {
    try {
        const { user, pwd } = req.body;
        if (!user || !pwd) {
            // Return a 400 Bad Request response if user or pwd is missing
            return res.status(400).json({ message: "Username and password are required." });
        }

        // Check if the user exists in the Cosmos DB container
        const querySpec = {
            query: "SELECT * FROM c WHERE c.username = @username",
            parameters: [
                {
                    name: "@username",
                    value: user,
                },
            ],
        };

        const { resources: results } = await container.items
            .query(querySpec)
            .fetchAll();

        if (results.length === 0) {
            // Return a 401 Unauthorized response if the user doesn't exist
            return res.sendStatus(401);
        }

        const foundUser = results[0];

        // Evaluate the password
        const match = await bcrypt.compare(pwd, foundUser.password);

        if (match) {
            // Ensure foundUser.roles is an object before using Object.values()
            const roles = foundUser.roles && typeof foundUser.roles === "object"
                ? Object.values(foundUser.roles).filter(Boolean)
                : [];

            // Debugging statement to log user roles
            console.log('User Roles:', roles);

            // Create JWTs
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundUser.username,
                        roles: roles,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET, // Use your own secret
                { expiresIn: "1m" }
            );

            const refreshToken = jwt.sign(
                { username: foundUser.username },
                process.env.REFRESH_TOKEN_SECRET, // Use your own secret
                { expiresIn: "15m" }
            );

            // Saving refreshToken with the current user in Cosmos DB
            foundUser.refreshToken = refreshToken;
            await container.items.upsert(foundUser);

            // Creates a Secure Cookie with the refresh token
            res.cookie("jwt", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 24 * 60 * 60 * 1000,
            });

            // Send authorization roles and access token to the user
            res.json({ roles, accessToken });
        } else {
            // Return a 401 Unauthorized response if the password doesn't match
            res.sendStatus(401);
        }
    } catch (error) {
        console.error("Error:", error);
        // Return a 500 Internal Server Error response for other errors
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { signin }