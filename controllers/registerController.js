const { CosmosClient } = require('@azure/cosmos');
const bcrypt = require('bcryptjs');
const { databaseId, usersContainerId, cosmosClient } = require('../utils/utils');
const client = cosmosClient;

// Reference to your Cosmos DB container
const container = client.database(databaseId).container(usersContainerId);

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // Check for duplicate usernames in the container
    const querySpec = {
        query: 'SELECT * FROM c WHERE c.username = @username',
        parameters: [
            {
                name: '@username',
                value: user,
            },
        ],
    };

    const { resources: results } = await container.items.query(querySpec).fetchAll();

    if (results.length > 0) {
        return res.sendStatus(409); // Conflict
    }

    try {
        // Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // Create a new user document
        const newUser = {
            username: user,
            password: hashedPwd,
        };

        // Insert the new user document into the container
        await container.items.create(newUser);

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

module.exports = { handleNewUser };