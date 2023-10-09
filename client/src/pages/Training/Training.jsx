import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader/Loader';
import styles from './Training.module.scss';
import apiUrl from '../../config';

const Training = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const handlePreviousDay = () => {
        if (loading) return;
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() - 1);
        const previousDay = currentDate.toISOString().split('T')[0];
        setSelectedDate(previousDay);
        fetchData(previousDay); // Call fetchData with the updated date
    };

    const handleNextDay = () => {
        if (loading) return;
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + 1);
        const nextDay = currentDate.toISOString().split('T')[0];
        setSelectedDate(nextDay);
        fetchData(nextDay); // Call fetchData with the updated date
    };

    const handleToday = () => {
        if (loading) return;
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
        fetchData(today); // Call fetchData with the updated date
    };

    const fetchData = async (date) => {
        setLoading(true);
        setError(null);

        try {
            const proxyUrl = `${apiUrl}`;
            const targetUrlGroupFitness = `${proxyUrl}/groupFitness/${date}`;
            const targetUrlPoolSchedule = `${proxyUrl}/poolSchedule/${date}`;

            const responseGroupFitness = await fetch(targetUrlGroupFitness, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                },
            });

            if (!responseGroupFitness.ok) {
                throw new Error('Failed to fetch group fitness data');
            }

            const responseDataGroupFitness = await responseGroupFitness.json();

            const responsePoolSchedule = await fetch(targetUrlPoolSchedule, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                },
            });

            if (!responsePoolSchedule.ok) {
                throw new Error('Failed to fetch pool schedule data');
            }

            const responseDataPoolSchedule = await responsePoolSchedule.json();

            const downtownSeattleClasses = responseDataGroupFitness.filter(
                (classItem) => classItem.location === 'Downtown Seattle YMCA'
            );

            const meredithMathewsClasses = responseDataGroupFitness.filter(
                (classItem) => classItem.location === 'Meredith Mathews East Madison YMCA'
            );

            const poolClasses = responseDataPoolSchedule.filter(
                (classItem) => classItem.location === 'Downtown Seattle YMCA' || classItem.location === 'Meredith Mathews East Madison YMCA'
            );

            const updatedData = {
                downtownSeattle: downtownSeattleClasses,
                meredithMathews: meredithMathewsClasses,
                pool: poolClasses,
            };

            setData(updatedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('An error occurred while fetching the data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate]);

    return (loading ? <Loader /> :
        <section className="container">
            <h2 className={styles.header}>
                Downtown Seattle YMCA &nbsp;
                {loading ? (
                    <span className={styles.dateStyle}>Loading...</span>
                ) : error ? (
                    <span className={styles.dateStyle}>Error: {error}</span>
                ) : (
                    <span className={styles.dateStyle}>{selectedDate}</span>
                )}
            </h2>

            {data && data.downtownSeattle && data.downtownSeattle.length > 0 ? (
                <ClassTable location="Downtown Seattle YMCA" classes={data.downtownSeattle} />
            ) : (
                <div className={styles.tableText}>No classes available for Downtown Seattle YMCA</div>
            )}

            <h2 className={styles.header}>
                Meredith Mathews East Madison YMCA &nbsp;
                {loading ? (
                    <span className={styles.dateStyle}>Loading...</span>
                ) : error ? (
                    <span className={styles.dateStyle}>Error: {error}</span>
                ) : (
                    <span className={styles.dateStyle}>{selectedDate}</span>
                )}
            </h2>

            {data && data.meredithMathews && data.meredithMathews.length > 0 ? (
                <ClassTable location="Meredith Mathews East Madison YMCA" classes={data.meredithMathews} />
            ) : (
                <div className={styles.tableText}>No classes available for Meredith Mathews East Madison YMCA</div>
            )}

            <h2 className={styles.header}>
                Swimming Pool Schedule &nbsp;
                {loading ? (
                    <span className={styles.dateStyle}>Loading...</span>
                ) : error ? (
                    <span className={styles.dateStyle}>Error: {error}</span>
                ) : (
                    <span className={styles.dateStyle}>{selectedDate}</span>
                )}
            </h2>

            {data && data.pool && data.pool.length > 0 ? (
                <PoolTable poolClasses={data.pool} />
            ) : (
                <div className={styles.tableText}>No pool classes available</div>
            )}

            <div className="buttonbar">
                <button onClick={handlePreviousDay}>Previous Day</button>
                <button onClick={handleToday}>Today</button>
                <button onClick={handleNextDay}>Next Day</button>
            </div>
        </section>
    );
};

const ClassTable = ({ location, classes }) => {
    return (
        <table className={styles.classSchedule}>
            <thead>
                <tr>
                    <th>Class</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Room</th>
                </tr>
            </thead>
            <tbody>
                {classes.map((classItem) => (
                    <tr key={classItem.nid}>
                        <td>{classItem.name}</td>
                        <td>{classItem.time_start}</td>
                        <td>{classItem.time_end}</td>
                        <td>{classItem.room}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const PoolTable = ({ poolClasses }) => {
    return (
        <table className={styles.classSchedule}>
            <thead>
                <tr>
                    <th>Pool</th>
                    <th>Class</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Room</th>
                </tr>
            </thead>
            <tbody>
                {poolClasses.map((classItem) => (
                    <tr key={classItem.nid}>
                        <td>{classItem.location}</td>
                        <td>{classItem.name}</td>
                        <td>{classItem.time_start}</td>
                        <td>{classItem.time_end}</td>
                        <td>{classItem.room}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Training;
