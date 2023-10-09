const { databaseId, messagesContainerId, cosmosClient } = require('../utils/utils');

const getAllApprovals = async (req, res) => {
    try {
        const container = cosmosClient.database(databaseId).container(messagesContainerId);
        const query = "SELECT * FROM c";
        const { resources: results } = await container.items.query(query).fetchAll();
        res.json(results);
    } catch (error) {
        console.error('Error retrieving approval messages:', error);
        res.status(500).json({ error: 'Failed to retrieve approval messages' });
    }
};

const getApprovalById = async (req, res) => {
    try {
        const { id } = req.params;
        const container = cosmosClient.database(databaseId).container(messagesContainerId);
        const { resources } = await container.items.readAll().fetchAll();
        const resource = resources.find(item => item.id === id);

        if (!resource) {
            return res.status(404).json({ error: 'Approval not found' });
        }

        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve approval message' });
    }
};

const approveApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const container = cosmosClient.database(databaseId).container(messagesContainerId);
        const { resources } = await container.items.readAll().fetchAll();
        const resource = resources.find(item => item.id === id);

        if (!resource) {
            throw new Error('Approval not found');
        }

        resource.status = 'approved';
        const { resource: updatedItem } = await container.item(id).replace(resource);
        res.status(200).json({ success: true, message: 'Message approved', item: updatedItem });
    } catch (error) {
        console.error('Error approving message:', error);
        res.status(500).json({ error: 'Failed to approve message' });
    }
};

const rejectApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const container = cosmosClient.database(databaseId).container(messagesContainerId);
        const { resources } = await container.items.readAll().fetchAll();
        const resource = resources.find(item => item.id === id);

        if (!resource) {
            throw new Error('Approval not found');
        }

        resource.status = 'rejected';

        const { resource: updatedItem } = await container.item(id).replace(resource);

        res.status(200).json({ success: true, message: 'Message rejected', item: updatedItem });
    } catch (error) {
        console.error('Error rejecting message:', error);
        res.status(500).json({ error: 'Failed to reject message' });
    }
};

const deleteApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const container = cosmosClient.database(databaseId).container(messagesContainerId);
        const { resources } = await container.items.query(`SELECT * FROM c WHERE c.id = "${id}"`).fetchAll();
        const resource = resources[0];

        if (!resource) {
            return res.status(404).json({ error: 'Approval not found' });
        }
        await container.item(id, id).delete(); // Provide the partition key value as the second argument
        res.status(204).end(); // Indicate successful deletion with no content
    } catch (error) {
        if (error.code === 404) {
            return res.status(404).json({ error: 'Approval not found' });
        }
        res.status(500).json({ error: 'Failed to delete approval' });
    }
};

const deleteAllApprovals = async (req, res) => {
    try {
        const container = cosmosClient.database(databaseId).container(messagesContainerId);
        const { resources } = await container.items.readAll().fetchAll();

        for (const resource of resources) {
            await container.item(resource.id, resource.id).delete();
        }

        res.status(204).end(); // Indicate successful deletion with no content
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete approval records' });
    }
};

module.exports = {
    getAllApprovals,
    getApprovalById,
    approveApproval,
    rejectApproval,
    deleteApproval,
    deleteAllApprovals
};