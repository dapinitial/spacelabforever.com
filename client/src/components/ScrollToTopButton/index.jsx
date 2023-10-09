import React, { useEffect } from 'react';

const ScrollToTopButton = () => {
  useEffect(() => {
    const progressPath = document.querySelector('.progress-wrap path');
    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

    const updateProgress = () => {
      const scroll = window.pageYOffset;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = progress;
    };

    const handleScroll = () => {
      const offset = 50;
      if (window.pageYOffset > offset) {
        document.querySelector('.progress-wrap').classList.add('active-progress');
      } else {
        document.querySelector('.progress-wrap').classList.remove('active-progress');
      }
    };

    const handleClick = (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    const addEventListeners = () => {
      window.addEventListener('scroll', updateProgress);
      window.addEventListener('scroll', handleScroll);
      document.querySelector('.progress-wrap').addEventListener('click', handleClick);
    };

    const removeEventListeners = () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('scroll', handleScroll);
      document.querySelector('.progress-wrap').removeEventListener('click', handleClick);
    };

    updateProgress();
    addEventListeners();

    return removeEventListeners;
  }, []);

  return (
    <div className="progress-wrap">
      <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
        <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" stroke="url(#progress-circle-gradient)" strokeWidth="4" fill="none" />
        <linearGradient id="progress-circle-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF512F" />
          <stop offset="100%" stopColor="#8E54E9" />
        </linearGradient>
      </svg>
      <p className="small-text">scroll to top</p>
    </div>
  );
};

export default ScrollToTopButton;
