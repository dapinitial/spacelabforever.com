const { databaseId, usersContainerId, cosmosClient } = require('../utils/utils');
const client = cosmosClient;
const containerId = usersContainerId;

const createUser = async () => {
    const database = client.database(databaseId);
    const container = database.container(containerId);
    const { resource: containerDefinition } = await container.read();

    // Check if the container exists; create it if it doesn't
    if (!containerDefinition) {
        await database.containers.createIfNotExists({ id: containerId });
    }

    return container;
};

const getAllUsers = async (req, res) => {
    try {
        const database = client.database(databaseId);
        const container = database.container(containerId);

        const { resources: users } = await container.items.readAll().fetchAll();

        if (!users || users.length === 0) {
            return res.status(204).json({ message: 'No users found' });
        }

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req?.body?.id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        const database = client.database(databaseId);
        const container = database.container(containerId);

        const { resource: user } = await container.item(userId).delete();

        if (!user) {
            return res.status(204).json({ message: `User ID ${userId} not found` });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req?.params?.id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        const database = client.database(databaseId);
        const container = database.container(containerId);

        const { resource: user } = await container.item(userId).read();

        if (!user) {
            return res.status(204).json({ message: `User ID ${userId} not found` });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    deleteUser,
    getUser,
};