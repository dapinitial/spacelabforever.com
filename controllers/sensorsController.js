const { databaseId, sensorsContainerId, cosmosClient } = require('../utils/utils');

// Function to fetch sensor data based on a query
const fetchSensorData = async (query) => {
    const container = cosmosClient.database(databaseId).container(sensorsContainerId);
    const { resources: results } = await container.items.query(query).fetchAll();
    return results;
};

// Get the first sensor data record
const getFirstSensorData = async (req, res) => {
    try {
        const query = 'SELECT TOP 1 * FROM c ORDER BY c.timestamp ASC';
        const firstSensorData = await fetchSensorData(query);
        res.json(firstSensorData);
    } catch (error) {
        console.error('Error retrieving sensor data:', error);
        res.status(500).json({ error: 'Failed to retrieve sensor data' });
    }
};

// Get the latest sensor data
const getLatestSensorData = async (req, res) => {
    try {
        const query = 'SELECT TOP 1 * FROM c ORDER BY c.timestamp DESC';
        const latestSensorData = await fetchSensorData(query);
        res.json(latestSensorData);
    } catch (error) {
        console.error('Error retrieving sensor data:', error);
        res.status(500).json({ error: 'Failed to retrieve sensor data' });
    }
};

// Get all sensor data
const getAllSensorData = async (req, res) => {
    try {
        const query = 'SELECT * FROM c';
        const allSensorData = await fetchSensorData(query);
        res.json(allSensorData);
    } catch (error) {
        console.error('Error retrieving sensor data:', error);
        res.status(500).json({ error: 'Failed to retrieve sensor data' });
    }
};

module.exports = {
    getAllSensorData,
    getFirstSensorData,
    getLatestSensorData
};