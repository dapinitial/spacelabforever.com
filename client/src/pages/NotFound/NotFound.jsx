import React from 'react';
import { Link } from 'react-router-dom';
import TextScrambler from '../../components/TextScambler/TextScrambler';
import styles from './NotFound.module.scss';

const NotFound = () => {

    let phrases = ['404 Not Found'];

    return (
        <section className="container">
            <h1 className="hero"><TextScrambler phrases={phrases} /></h1>
            <p>The page you requested does not exist.</p>
            <p>
                Go back to the <Link to="/">Homepage</Link>.
            </p>
        </section>
    );
};

export default NotFound;