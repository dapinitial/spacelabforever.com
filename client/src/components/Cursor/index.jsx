import React, { useEffect, useState } from 'react';

const Cursor = () => {
    const [activeClass, setActiveClass] = useState('');

    useEffect(() => {
        const handleMouseMove = (e) => {
            document.querySelectorAll('.cursor').forEach((cursor) => {
                cursor.style.left = e.pageX + 'px';
                cursor.style.top = e.pageY + 'px';
            });
        };

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

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            <div className={`cursor cursor-shadow ${activeClass}`} />
            <div className='cursor cursor-dot' />
        </>
    );
};

export default Cursor;
