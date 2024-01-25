import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios
      .get('http://localhost:7070/tags')
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => {
        console.error('api error', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (error) {
    return <div>Something went wrong...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='main-container'>
      <h1 className='feature-title'>BROWSE BY CATEGORY</h1>
      <div className='tags-container'>
        {tags.map((tag) => (
          <div key={tag.id} className='tag-container'>
            <img src={tag.image.src} alt='slide_image' />
            <div className='tag-texto'>{tag.name.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}