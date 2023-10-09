import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader/Loader';
import apiUrl from '../../config';
import styles from './Homepage.module.scss';
import ScrollBanner from '../../components/ScrollBanner';

function Homepage() {
  const [isLoading, setIsLoading] = useState(true);
  const [sensorData, setSensorData] = useState([]);
  const phrases = [
    'spacelab\'s forever',
    'spacelab\'s for primates',
    '49.67002, -123.15658',
    'for microscopy use only',
    'for mountain projects',
    'for anastomosis',
    'for coquettish petrichor',
    'survival skills',
    'sedulousness',
    'evolving',
    '#globalwarmready',
    '#spacelabforever',
  ];

  const fetchSensorData = async () => {
    try {
      const response = await fetch(`${apiUrl}/getLatestSensorData`);
      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        if (Array.isArray(data)) {
          setSensorData(data);
        } else if (data !== null) {
          setSensorData([data]);
        } else {
          setSensorData([]);
        }
      } else {
        throw new Error('Error fetching sensor data');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    fetchSensorData();
  }, []);

  return (isLoading ? <Loader /> :
    <section className="container section">
      <ScrollBanner disableScrollEffects subheading={'Hello world'} phrases={phrases} />
    </section>

  );
}

export default Homepage;