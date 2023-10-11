import React, { useEffect, useState } from 'react';
import apiUrl from '../../config';
import styles from './Guestbook.module.scss';
import TextScrambler from '../../components/TextScambler/TextScrambler';
import Loader from '../../components/Loader/Loader';

const Guestbook = () => {
    const [messages, setMessages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    let herophrases = ['guestbook', 'visitor log'];

    useEffect(() => {
        fetch(`${apiUrl}/approvals`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch approval messages');
                }
            })
            .then((data) => {
                setMessages(data);
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }, []);

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/approvals/${id}/approve`, {
                method: 'PATCH',
            });

            if (response.ok) {
                const updatedMessages = messages.map((message) => {
                    if (message.id === id) {
                        return { ...message, status: 'approved' };
                    }
                    return message;
                });
                setMessages(updatedMessages);
            } else {
                const data = await response.json();
                setErrorMessage(data.error || 'Failed to approve message');
            }
        } catch (error) {
            setErrorMessage('Failed to approve message');
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/approvals/${id}/reject`, {
                method: 'PATCH',
            });

            if (response.ok) {
                const updatedMessages = messages.map((message) => {
                    if (message.id === id) {
                        return { ...message, status: 'rejected' };
                    }
                    return message;
                });
                setMessages(updatedMessages);
            } else {
                const data = await response.json();
                setErrorMessage(data.error || 'Failed to reject message');
            }
        } catch (error) {
            setErrorMessage('Failed to reject message');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/approvals/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Item deleted successfully
                // Perform any necessary UI updates or fetch the updated list of items
            } else {
                // Item deletion failed
                // Handle the error or show an error message to the user
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleDeleteAll = async () => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete all messages? This action cannot be undone.'
        );

        if (confirmDelete) {
            try {
                const response = await fetch(`${apiUrl}/approvals`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    console.log('trying to delete');
                } else {
                    const data = await response.json();
                    setErrorMessage(data.error || 'Failed to delete messages');
                }
            } catch (error) {
                setErrorMessage('Failed to delete messages');
            }
        }
    };

    return (
        isLoading ? <Loader /> :
            <section className="container">
                <div>
                    <h1 className="hero subpage"><TextScrambler phrases={herophrases} /></h1>
                </div>
                {errorMessage && <p>Error: {errorMessage}</p>}
                <table className={styles.approvalstable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map((message) => (
                            <tr key={message.id}>
                                <td>{message.name}</td>
                                <td>{message.email}</td>
                                <td>{message.message}</td>
                                <td className={styles.status}><div>{message.status}</div></td>
                                <td>
                                    {message.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleApprove(message.id)}>Approve</button>
                                            <button onClick={() => handleReject(message.id)}>Reject</button>
                                        </>
                                    )}
                                    <button onClick={() => handleDelete(message.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button style={{ display: 'flex' }} onClick={() => handleDeleteAll()}>Delete All</button>
            </section>
    );
};

export default Guestbook;