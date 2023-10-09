import React, { useRef, useEffect } from 'react';
import { ScrambleText } from './ScrambleText'; // Update the import path based on your file structure

const TextScrambler = ({ phrases }) => {
    const elRef = useRef(null);
    const fxRef = useRef(null);

    useEffect(() => {
        const el = elRef.current;
        const fx = new ScrambleText(el);
        fxRef.current = fx;

        let counter = 0;

        const next = () => {
            fx.setText(phrases[counter]).then(() => {
                setTimeout(next, 800);
            });
            counter = (counter + 1) % phrases.length;
        };

        next();

        return () => {
            // Cleanup logic
            cancelAnimationFrame(fx.frameRequest);
        };
    }, [phrases]);

    return (
        <span style={{ fontFamily: 'Dosis' }} ref={elRef}></span>
    );
};

export default TextScrambler;