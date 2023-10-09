import React, { useState, useEffect } from 'react';
import styles from './AudioPlayer.module.scss';

function AudioPlayer() {
  const [error, setError] = useState(null);
  const [currentPlay, setCurrentPlay] = useState(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentPlay() {
      try {
        const response = await fetch('https://api.kexp.org/v2/plays?ordering=-airdate&limit=1');
        const data = await response.json();
        const currentPlay = data.results[0];
        setCurrentPlay(currentPlay);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      }
    }

    function updateAudioSource() {
      const audioPlayer = document.getElementById('audioPlayer');
      if (audioPlayer !== null) {
        audioPlayer.src = 'https://kexp.streamguys1.com/kexp64.aac';
        audioPlayer.load();

        audioPlayer.addEventListener('play', () => {
          setIsPlaying(true);
        });

        audioPlayer.addEventListener('pause', () => {
          setIsPlaying(false);
        });
      }
    }

    function canStartAudio() {
      if (!audioStarted) {
        setAudioStarted(true);
        updateAudioSource();
      }
    }

    fetchCurrentPlay().then(() => setLoading(false));

    window.addEventListener('click', canStartAudio);

    return () => window.removeEventListener('click', canStartAudio);


  }, [audioStarted]);

  function handleKexpLogoClick() {
    setIsPlaying(!isPlaying);
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer) {
      if (isPlaying) {
        audioPlayer.pause();
      } else {
        if (audioPlayer.readyState < audioPlayer.HAVE_FUTURE_DATA) {
          audioPlayer.addEventListener('canplaythrough', () => {
            audioPlayer.play();
          }, { once: true });
        } else {
          audioPlayer.play();
        }
      }
    }
  }

  return (
    <div>
      {!loading && !error && (
        <div>
          <audio id="audioPlayer" controls hidden>
            Your browser does not support the audio element.
          </audio>
          {currentPlay && currentPlay.play_type === 'airbreak' ? (
            <div className={styles.AudioPlayer}>KEXP is currently taking a break.</div>
          ) : (
            <div className={`${styles.AudioPlayer} ${styles.notBreak}`}>
              {audioStarted && (
                <div className={styles.kexpLogo} onClick={handleKexpLogoClick}>
                  <div className={`${styles.iconBars} ${isPlaying ? styles.animating : ''}`}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                  </div>
                  <div className={styles.kexp__svg}>
                    <svg width="90" height="40px" viewBox="0 0 90 40" version="1.1">
                      <title>KEXP Logo</title>
                      <g id="KEXPLogo" stroke="none" strokeWidth="0" fill="#FFFFFF" fillRule="evenodd">
                        <path d="M9.56,38 L9.56,24.96 L10.32,23.68 L15,38 L22.28,38 L16,20.24 L22,5.6 L15,5.6 L9.56,18.84 L9.56,5.6 L2.4,5.6 L2.4,38 L9.56,38 Z M41.22,38 L41.22,33.16 L33.74,33.16 L33.74,23.48 L39.38,23.48 L39.38,18.52 L33.74,18.52 L33.74,10.48 L41.14,10.48 L41.14,5.6 L26.58,5.6 L26.58,38 L41.22,38 Z M50.88,5.6 L54.44,14.36 L57.32,5.6 L63.28,5.6 L57.6,22.44 L63.92,38 L57.2,38 L53.24,28.32 L49.76,38 L43.84,38 L50.12,20.56 L44.12,5.6 L50.88,5.6 Z M78.94,5.6 C80.8866667,5.6 82.4866667,5.96666667 83.74,6.7 C84.9933333,7.43333333 85.9266667,8.5 86.54,9.9 C87.1533333,11.3 87.46,13 87.46,15 C87.46,17.5066667 87.0466667,19.42 86.22,20.74 C85.3933333,22.06 84.2733333,22.9733333 82.86,23.48 C81.4466667,23.9866667 79.86,24.24 78.1,24.24 L75.22,24.24 L75.22,38 L68.06,38 L68.06,5.6 L78.94,5.6 Z M77.58,10.64 L75.22,10.64 L75.22,19.24 L77.62,19.24 C78.5,19.24 79.1666667,19.08 79.62,18.76 C80.0733333,18.44 80.3733333,17.96 80.52,17.32 C80.6666667,16.68 80.74,15.8666667 80.74,14.88 C80.74,14.0533333 80.68,13.3266667 80.56,12.7 C80.44,12.0733333 80.1533333,11.5733333 79.7,11.2 C79.2466667,10.8266667 78.54,10.64 77.58,10.64 Z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              )}
              {/*<img height="40px" src={currentPlay.thumbnail_uri} alt={`Current Play: ${currentPlay.artist} - ${currentPlay.song} - ${currentPlay.release_date}`} />*/}
              <div>
                {loading && <div>Loading...</div>}
                Current Play: {currentPlay.artist} - {currentPlay.song}
              </div>
            </div>
          )}
        </div>
      )}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

export default AudioPlayer;
