const fetch = require('node-fetch');
const geoip = require('geoip-lite');
const { CosmosClient } = require('@azure/cosmos');
const { EmailClient } = require('@azure/communication-email');
const connectionString = process.env.REACT_APP_AZURE_CONNECTION_STRING_SPACELABFOREVERCOMMS;
const endpoint = process.env.REACT_APP_COSMOSDB_ENDPOINT_SPACELABFOREVER;
const key = process.env.REACT_APP_COSMOSDB_KEY_SPACELABFOREVER;
const cosmosClient = new CosmosClient({ endpoint, key });
const emailClient = new EmailClient(connectionString);
const databaseId = 'SpacelabforeverDB';
const sensorsContainerId = 'Sensors';
const usersContainerId = 'Users';
const messagesContainerId = 'Messages';
const blogPostsContainerId = 'BlogPosts';
const maxRetryAttempts = 3; // Maximum number of retry attempts
const retryDelayMs = 10000; // Delay in milliseconds between retries

const withRetry = (routeHandler) => {
    return async (req, res) => {
        let retryCount = 0;

        const retryOperation = async () => {
            try {
                await routeHandler(req, res);
            } catch (error) {
                console.error('Error in route:', error);

                if (retryCount < maxRetryAttempts) {
                    retryCount++;
                    console.log(`Retrying (${retryCount}/${maxRetryAttempts}) in ${retryDelayMs}ms...`);
                    setTimeout(retryOperation, retryDelayMs);
                } else {
                    res.status(500).json({ error: 'Route failed after maximum retry attempts' });
                }
            }
        };

        retryOperation();
    };
};

module.exports = {
    databaseId,
    messagesContainerId,
    usersContainerId,
    sensorsContainerId,
    blogPostsContainerId,
    cosmosClient,
    emailClient,
    withRetry
};