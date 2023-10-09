import React, { useEffect, useState } from 'react';
import BlogPosts from './BlogPosts';
import TextScrambler from '../../components/TextScambler/TextScrambler';
import ScrollBanner from '../../components/ScrollBanner';
import styles from './Blog.module.scss';

const Blog = () => {

    let phrases = ['blog', 'jargon', 'thoughts'];

    return (
        <>
            <section className="container">
                <ScrollBanner phrases={phrases} />
                <BlogPosts />
            </section>

            <section className={styles.oldernews}>
                older news coming soonish
            </section>
        </>
    );
}

export default Blog;
