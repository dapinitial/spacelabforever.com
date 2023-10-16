import React, { useEffect, useState } from 'react';
import apiUrl from '../../config';
import TextScrambler from '../../components/TextScambler/TextScrambler';
import styles from './AboutUs.module.scss';
import ScrollBanner from '../../components/ScrollBanner';

function AboutUs() {

  const phrases = [
    'origin stories',
    'storied origins',
    'our backstory'
  ];

  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    fetchSensorData();
  }, []);

  const fetchSensorData = async () => {
    try {
      const response = await fetch(`${apiUrl}/getLatestSensorData`);
      if (response.ok) {
        const data = await response.json();
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

  return (
    <article className="centered container section">
      <ScrollBanner disableScrollEffects subheading={'About Us'} phrases={phrases} />
      <p style={{ maxWidth: '50%', margin: '0 auto', lineHeight: '32px', marginBottom: 40 }}>
        Spacelab as a concept has been swirling around since forever. -Spacelabforever- was first uttered during a long overdue mixing sesh where the origins began reconnecting the dots, regaining lost time, and set out to find the others. One onion infusion, a few hold-harmless agreements, some simulvomiting over with, are we were off -- charting our courses for the upper left coast.

      </p>
      <p style={{ marginBottom: 40 }}>Cue the hand signals.</p>
      <p style={{ maxWidth: '50%', margin: '0 auto', lineHeight: '32px', marginBottom: 40 }}>
        Since inception, Spacelab has undergone many revisions. Domains have changed hands, team mates have served and gone on, hackathons were won, Geekwire publicized, all was good. The mission has evolved and the spirit prevailed. Authenticity never waivered.
      </p>
      <p style={{ maxWidth: '50%', margin: '0 auto', lineHeight: '32px', marginBottom: 40 }}>
        Today, Spacelabforever.com exists as a digital exposé montage. A collage of sorts for documenting, researching, pushing the boundaries of observation, and examining and reviewing our current understandings. Keeping everything front and center, transparent and relevant, connecting all the interwoven aspects of our modern lives' physical and digital footprint helps reduce tech-debt and cognitive overload while operating inside spaceship earth. This is the digital reflection of our collective consciousness, and inner-most selves -- complete with automation via the finite-state automaton.
      </p>
      <p style={{ maxWidth: '50%', margin: '0 auto', lineHeight: '32px' }}>
        Spacelab is a pre-catastrophe codeword used for a place of immunity. The question has been answered.
      </p>
    </article>

  );
}

export default AboutUs;