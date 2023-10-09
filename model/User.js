const userSchema = {
    id: "/user",
    type: "object",
    properties: {
        id: {
            type: "string",
            description: "The unique identifier for a user",
        },
        username: {
            type: "string",
            description: "The username of the user",
        },
        roles: {
            type: "object",
            properties: {
                User: {
                    type: "number",
                    default: 2001,
                    description: "Role level for User",
                },
                Editor: {
                    type: "number",
                    description: "Role level for Editor",
                },
                Admin: {
                    type: "number",
                    description: "Role level for Admin",
                },
            },
            description: "User roles",
        },
        password: {
            type: "string",
            description: "The user's password",
        },
        refreshToken: {
            type: "string",
            description: "The user's refresh token",
        },
    },
};

const createUserModel = async () => {
    const database = client.database(databaseId);
    const container = database.container(containerId);
    const { resource: containerDefinition } = await container.read();

    // Check if the container exists; create it if it doesn't
    if (!containerDefinition) {
        await database.containers.createIfNotExists({ id: containerId });
    }

    return container;
};

module.exports = {
    userSchema,
    createUserModel,
};