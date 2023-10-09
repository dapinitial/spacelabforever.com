const mongoose = require('mongoose');
const { CosmosClient } = require('@azure/cosmos');
mongoose.set('strictQuery', true);

// Define your Cosmos DB configuration using environment variables
const cosmosEndpoint = process.env.REACT_APP_COSMOSDB_ENDPOINT_SPACELABFOREVER;
const cosmosKey = process.env.REACT_APP_COSMOSDB_KEY_SPACELABFOREVER;
const cosmosDatabaseId = 'SpacelabforeverDB'; // Replace with your Cosmos DB database ID

// Initialize the Cosmos DB client
const cosmosClient = new CosmosClient({
    endpoint: cosmosEndpoint,
    key: cosmosKey,
});

const connectCosmosDB = async (containerId) => {
    try {
        // Use the Cosmos DB client to create a database if it doesn't exist
        const { database } = await cosmosClient.databases.createIfNotExists({ id: cosmosDatabaseId });

        // Use the database reference to create a container if it doesn't exist
        const { container } = await database.containers.createIfNotExists({ id: containerId });

        // Connect to the container using Mongoose
        const mongooseOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        };

        await mongoose.connect(container.url, mongooseOptions);

        console.log(`Connected to Cosmos DB container: ${containerId}`);
    } catch (error) {
        console.error(`Error connecting to Cosmos DB container ${containerId}:`, error);
        throw error;
    }
};

module.exports = connectCosmosDB;