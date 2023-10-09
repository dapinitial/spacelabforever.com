from azure.cosmos import CosmosClient
from azure.cosmos.exceptions import CosmosResourceExistsError
from config import COSMOSDB_ENDPOINT, COSMOSDB_KEY, COSMOSDB_DATABASE_NAME, COSMOSDB_CONTAINER_NAME


def get_cosmos_client():
    client = CosmosClient(COSMOSDB_ENDPOINT, credential=COSMOSDB_KEY)
    return client


def get_container_client():
    client = get_cosmos_client()
    database = client.get_database_client(COSMOSDB_DATABASE_NAME)
    container = database.get_container_client(COSMOSDB_CONTAINER_NAME)
    return container


def upsert_item(item):
    container = get_container_client()
    container.upsert_item(item)


print("Endpoint:", COSMOSDB_ENDPOINT)
print("Database Name:", COSMOSDB_DATABASE_NAME)
print("Container Name:", COSMOSDB_CONTAINER_NAME)
