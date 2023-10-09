import React, { useEffect, useState } from 'react';
import TextScrambler from '../../components/TextScambler/TextScrambler';
import { useParams } from 'react-router-dom';
import apiUrl from '../../config';
import Loader from '../../components/Loader/Loader'
import styles from './BlogPost.module.scss';
import ScrollBanner from '../../components/ScrollBanner';

const BlogPost = () => {
    const { id } = useParams();
    const [blogPost, setBlogPost] = useState(null);

    useEffect(() => {
        fetch(`${apiUrl}/posts/${id}`)
            .then((response) => response.json())
            .then((data) => setBlogPost(data))
            .catch((error) => console.error('Error fetching blog post:', error));
    }, [id]);

    if (!blogPost) {
        return <Loader />;
    }

    return (
        <section className="container">
            <ScrollBanner phrases={[blogPost.title]} subheading={new Date(blogPost.createdAt).toLocaleString()} />
            <div className={styles.blogpost}>
                <p className={styles.blogpost__author}>By: {blogPost.author}</p>
                <p className={styles.blogpost__content}>{blogPost.content}</p>
                <p className={styles.blogpost__datetime}>Created At: {new Date(blogPost.createdAt).toLocaleString()}</p>
            </div>
        </section>
    );
};

export default BlogPost;