import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import apiUrl from '../../config';

const Breadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter((path) => path);
  const [postTitle, setPostTitle] = useState('');

  useEffect(() => {
    const lastPath = paths[paths.length - 1];
    const id = lastPath && lastPath.match(/^\d+$/) ? lastPath : null;

    if (id) {
      fetch(`${apiUrl}/posts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('data', data);
          setPostTitle(data.title);
        })
        .catch((error) => console.error('Error fetching blog post:', error));
    }
  }, [paths]);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {paths.map((path, index) => {
          const isLastPath = index === paths.length - 1;
          const breadcrumbPath = isLastPath ? `/${paths.slice(0, index).join('/')}` : `/${paths.slice(0, index + 1).join('/')}`;
          const breadcrumbTitle = isLastPath && postTitle ? postTitle : capitalize(path);

          return (
            <li key={path}>
              <Link to={breadcrumbPath}>
                {breadcrumbTitle}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default Breadcrumb;