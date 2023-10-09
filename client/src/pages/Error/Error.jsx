import React, { useEffect, useState } from 'react';
import TextScrambler from '../../components/TextScambler/TextScrambler';
import styles from './Error.module.scss';

const Error = () => {

    let phrases = ['Errorneousness', 'Something isn\'t right', 'Please, try again'];

    return (
        <section className="container">
            <h1 className="hero"><TextScrambler phrases={phrases} /></h1>
        </section>
    );
}

export default Error;
