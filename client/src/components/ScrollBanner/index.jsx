import React, { useEffect } from 'react';
import TextScrambler from '../../components/TextScambler/TextScrambler';

const ScrollBanner = ({ phrases, subheading }) => {
    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY || document.documentElement.scrollTop;
            const elements = document.querySelectorAll('.ScrollBanner');
            elements.forEach((element) => {
                element.style.top = `${scrollPos / 2}px`;
                element.style.opacity = 1 - scrollPos / 100;
            });
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <section className='ScrollBanner'>
            <h2 className='primary-color'>{subheading}</h2>
            <h1><TextScrambler phrases={phrases} /></h1>
        </section>
    );
};

export default ScrollBanner;