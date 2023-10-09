import React from 'react';
import { Link } from 'react-router-dom';
import TextScrambler from '../../components/TextScambler/TextScrambler';
import styles from './ComingSoon.module.scss';

const ComingSoon = () => {

    let phrases = ['coming soon', 'anticipation building'];

    return (
        <section className="container">
            <h1 className="hero"><TextScrambler phrases={phrases} /></h1>
            <p>Please check back often. Plenty of work slated for delivery.</p>
            <p>
                Go back to the <Link to="/">Homepage</Link>.
            </p>
        </section>
    );
};

export default ComingSoon;