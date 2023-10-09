import React, { useState } from 'react';
import apiUrl from '../../config';
import styles from './Blog.module.scss';

const CreateBlogPost = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newBlogPost = {
      title,
      author,
      content,
    };

    setIsLoading(true); // Set loading state to true

    fetch(`${apiUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBlogPost),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsSuccess(true); // Set success state to true
        setTitle('');
        setAuthor('');
        setContent('');
      })
      .catch((error) => console.error('Error creating blog post:', error))
      .finally(() => {
        setIsLoading(false); // Set loading state to false
      });
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isSuccess && <p>Blog post created successfully!</p>}
      <form className={styles.blogform} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreateBlogPost;
