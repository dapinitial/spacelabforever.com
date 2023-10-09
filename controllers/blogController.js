const { databaseId, blogPostsContainerId, cosmosClient } = require('../utils/utils');

const generateExcerpt = (content) => {
    const MAX_EXCERPT_LENGTH = 250;
    let excerpt = content.substring(0, MAX_EXCERPT_LENGTH);

    if (content.length > MAX_EXCERPT_LENGTH) {
        excerpt += '...';
    }

    return excerpt;
};

const getAllBlogPosts = async (req, res) => {
    try {
        // You might want to implement pagination here
        const { resources: blogPosts } = await cosmosClient
            .database(databaseId)
            .container(blogPostsContainerId)
            .items.query('SELECT * FROM c')
            .fetchAll();

        res.json(blogPosts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getSingleBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { resources: blogPosts } = await cosmosClient
            .database(databaseId)
            .container(blogPostsContainerId)
            .items.query('SELECT * FROM c')
            .fetchAll();

        const blogPost = blogPosts.find((post) => post.id === id);

        if (blogPost) {
            res.json(blogPost);
        } else {
            res.status(404).json({ error: 'Blog post not found' });
        }
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createBlogPost = async (req, res) => {
    try {
        const { title, author, content } = req.body;

        // Input validation here (e.g., check if required fields are provided)

        const newBlogPost = {
            id: Date.now().toString(),
            title,
            author,
            content,
            excerpt: generateExcerpt(content),
            createdAt: new Date().toISOString(),
        };

        await cosmosClient
            .database(databaseId)
            .container(blogPostsContainerId)
            .items.create(newBlogPost);

        res.status(201).json({ message: 'Blog post created successfully', blogPost: newBlogPost });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ error: 'Error creating blog post' });
    }
};

module.exports = {
    getAllBlogPosts,
    getSingleBlogPost,
    createBlogPost
};