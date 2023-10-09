import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import apiUrl from '../../config';
import Cursor from '../../components/Cursor';
import styles from './Blog.module.scss';

const Blog = ({ cursorclass }) => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/posts`)
      .then((response) => response.json())
      .then((data) => setBlogPosts(data))
      .catch((error) => console.error('Error fetching blog posts:', error));
  }, []);

  const postRefs = useRef([]);

  const handleMouseEnter = (className) => {
    document.querySelectorAll('.cursor').forEach((cursor) => {
      cursor.classList.add('active-' + className);
    });
  };

  const handleMouseLeave = (className) => {
    document.querySelectorAll('.cursor').forEach((cursor) => {
      cursor.classList.remove('active-' + className);
    });
  };


  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      postRefs.current.forEach((postRef) => {
        const { top, bottom } = postRef.getBoundingClientRect();
        const isVisible = top > 0 && top < windowHeight && bottom > 0 && bottom < windowHeight;

        if (isVisible) {
          postRef.style.opacity = 1;
        } else {
          postRef.style.opacity = 0.25;
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {blogPosts.map((post, index) => (
        <div className={styles.blogpost} key={post.id}>
          <Link to={`/blog/${post.id}`} className={`cursor-link ${cursorclass || `blog-post-${index + 1}`}`}>
            <div
              className={styles.blogpost__box}
              ref={(el) => (postRefs.current[index] = el)}
              cursorclass={`blog-post-${index + 1}`}
              onMouseEnter={() => handleMouseEnter(`blog-post-${index + 1}`)}
              onMouseLeave={() => handleMouseLeave(`blog-post-${index + 1}`)}
            >
              <h3 className={styles.blogpost__title}>
                {post.title}
              </h3>
              {/* <p className={styles.blogpost__author}>By: {post.author}</p>
              <p className={styles.blogpost__excerpt}>{post.excerpt}</p> */}
              <p className={styles.blogpost__datetime}>Published on {new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </Link>
        </div>
      ))}
      <Cursor />
    </>
  );
};

export default Blog;