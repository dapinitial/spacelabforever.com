import React, { useEffect, useState } from 'react';
import TextScrambler from '../../components/TextScambler/TextScrambler';
import styles from './Contact.module.scss';

const ContactSuccess = () => {

    let phrases = ['Successful transmission', 'You\'re well-received', '❥ Spacelabforever'];

    return (
        <section className="container">
            <h1 className="hero"><TextScrambler phrases={phrases} /></h1>
            <h2><a href="/contact">Send Another?</a></h2>
            <div className="buttonbar">
        </div>
        </section>
    );
}

export default ContactSuccess;
