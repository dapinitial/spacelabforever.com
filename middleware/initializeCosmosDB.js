const { CosmosClient } = require('@azure/cosmos');

// Initialize cosmosClient
let cosmosClient = null;

try {
    cosmosClient = new CosmosClient({
        endpoint: process.env.REACT_APP_COSMOSDB_ENDPOINT_SPACELABFOREVER,
        key: process.env.REACT_APP_COSMOSDB_KEY_SPACELABFOREVER,
    });
    console.log('CosmosClient initialized successfully');
} catch (error) {
    console.error('Error initializing cosmosClient:', error);
    throw new Error('Failed to initialize cosmosClient');
}

// Middleware function to ensure cosmosClient is initialized
const initializeCosmosDB = (req, res, next) => {
    if (!cosmosClient) {
        console.error('CosmosClient not initialized');
        return res.status(500).json({ error: 'CosmosClient not initialized' });
    }

    // Log the database information
    console.log('Cosmos DB Endpoint:', process.env.REACT_APP_COSMOSDB_ENDPOINT_SPACELABFOREVER);
    console.log('Cosmos DB Key:', process.env.REACT_APP_COSMOSDB_KEY_SPACELABFOREVER);

    next();
};

module.exports = initializeCosmosDB;