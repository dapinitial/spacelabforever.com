import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiUrl from '../../config';
import styles from './Contact.module.scss';
import TextScrambler from '../../components/TextScambler/TextScrambler';
import Loader from '../../components/Loader/Loader';

const Contact = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !message) {
            setErrorMessage('Name, email, and message are required fields');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const response = await fetch(`${apiUrl}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, website, message }),
            });

            if (response.ok) {
                setName('');
                setEmail('');
                setWebsite('');
                setMessage('');
                setIsSubmitting(false);
                navigate('/contact/success'); // Redirect to success page
            } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Failed to send message');
                setIsSubmitting(false);
            }
        } catch (error) {
            setErrorMessage('Failed to send message');
            setIsSubmitting(false);
        }
    };

    // Initial phrases for loading state
    const [phrases, setPhrases] = useState(['Sending message', 'Please wait']);
    let herophrases = ['contact', 'reach out', 'connect'];



    return (
        isLoading ? <Loader /> :
            <section className="container">
                <h1 className="hero subpage"><TextScrambler phrases={herophrases} /></h1>
                {errorMessage && <p className={styles.errormessage}>Error: {errorMessage}</p>}
                <form className={`${styles.contactform} ${isSubmitting ? styles.dimmed : ''}`} onSubmit={handleSubmit}>
                    <div>
                        <label className={styles.formlabel} htmlFor="name">Name:</label>
                        <input required type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className={styles.formlabel} htmlFor="email">Email:</label>
                        <input required type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className={styles.formlabel} htmlFor="website">Website:</label>
                        <input type="text" id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </div>
                    <div>
                        <label className={styles.formlabel} htmlFor="message">Message:</label>
                        <textarea required id="message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                    </div>
                    <div className="buttonbar">
                        <button type="submit" disabled={isSubmitting}>{isSubmitting ? <TextScrambler phrases={phrases} /> : 'Submit'}</button>
                    </div>
                </form>
            </section>
    );
};

export default Contact;
