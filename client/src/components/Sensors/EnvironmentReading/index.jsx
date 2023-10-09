import React, { useEffect, useState, useRef } from 'react';
import apiUrl from '../../../config';
import styles from './EnvironmentReading.module.scss';

const EnvironmentReading = () => {
    const [sensorData, setSensorData] = useState([]);
    const currentReadingIndexRef = useRef(0);
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState('');
    const [co2, setCO2] = useState('');
    const [datetime, setDatetime] = useState('');

    const [isCelsius, setIsCelsius] = useState(true);

    useEffect(() => {
        fetchSensorData();
    }, []);

    useEffect(() => {
        if (sensorData.length > 0) {
            const interval = setInterval(updateReading, 3000);

            return () => clearInterval(interval);
        }
    }, [sensorData]);

    useEffect(() => {
        if (sensorData.length > 0) {
            animateSensorData();
        }
    }, [sensorData]);

    useEffect(() => {
        const userPreference = localStorage.getItem('temperatureUnit');
        if (userPreference) {
            setIsCelsius(userPreference === 'celsius');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('temperatureUnit', isCelsius ? 'celsius' : 'fahrenheit');
    }, [isCelsius]);

    const fetchSensorData = async () => {
        try {
            const response = await fetch(`${apiUrl}/getLatestSensorData`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setSensorData(data);
                } else if (data !== null) {
                    setSensorData([data]);
                } else {
                    setSensorData([]);
                }
            } else {
                throw new Error('Error fetching sensor data');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const updateReading = () => {
        currentReadingIndexRef.current = (currentReadingIndexRef.current + 1) % sensorData.length;
        animateSensorData();
    };

    const animateSensorData = () => {
        const { temperature: newTemperature, humidity: newHumidity, co2: newCO2, datetime: newDatetime } =
            sensorData[currentReadingIndexRef.current];

        animateValue(temperature, newTemperature, setTemperature);
        animateValue(humidity, newHumidity, setHumidity);
        animateValue(co2, newCO2, setCO2);
        animateDatetime(newDatetime);
    };

    const animateValue = (oldValue, newValue, setValue) => {
        const roundedValue = parseFloat(newValue).toFixed(2);
        const oldValueStr = oldValue !== null ? oldValue.toString() : '';
        const newValueStr = roundedValue.toString();
        const maxLength = Math.max(oldValueStr.length, newValueStr.length);
        const delay = 100;

        let currentIndex = 0;
        let typedValue = '';
        let backspaceTimeout = null;

        const typingInterval = setInterval(() => {
            if (currentIndex === maxLength) {
                clearInterval(typingInterval);
                return;
            }

            if (currentIndex >= newValueStr.length) {
                clearTimeout(backspaceTimeout);
                typedValue = newValueStr;
            } else {
                typedValue = newValueStr.slice(0, currentIndex + 1);
            }

            setValue(typedValue !== 'null' ? typedValue : null);
            currentIndex++;

            if (currentIndex === maxLength) {
                if (newValue === null) {
                    backspaceTimeout = setTimeout(() => {
                        setValue(null);
                    }, 1500);
                } else {
                    backspaceTimeout = setTimeout(() => {
                        deleteValue(typedValue, setValue);
                    }, 1500);
                }
            }
        }, delay);
    };

    const deleteValue = (deletedValue, setValue) => {
        const delay = 100;
        let currentIndex = deletedValue.length;
        let deletedValueStr = deletedValue !== null ? deletedValue.toString() : '';

        const backspaceInterval = setInterval(() => {
            if (currentIndex === 0) {
                clearInterval(backspaceInterval);
                setValue(null);
                return;
            }

            deletedValueStr = deletedValueStr.slice(0, currentIndex - 1);
            setValue(deletedValueStr !== 'null' ? deletedValueStr : null);
            currentIndex--;
        }, delay);
    };


    const animateDatetime = (newDatetime) => {
        const dateObj = new Date(newDatetime);
        const formattedDatetime = dateObj.toLocaleString();
        setDatetime(formattedDatetime);
    };

    const toggleTemperatureUnit = () => {
        setIsCelsius(!isCelsius);
    };

    const convertTemperature = (temperature) => {
        if (temperature === null) {
            return ''; // Return empty string instead of null
        }

        if (isCelsius) {
            return temperature;
        } else {
            const convertedTemp = (temperature * 9) / 5 + 32;
            return convertedTemp;
        }
    };


    return (
        <section className={styles.EnvironmentReading}>
            <div className={styles.sensorDataLabel}>{`${isCelsius ? 'mycological chamber' : 'SCD41 Real-time Sensor'}`}</div>
            <table className={styles.sensorData} onClick={toggleTemperatureUnit}>
                <tbody>
                    <tr>
                        <td>Temperature:</td>
                        <td>
                            {temperature !== null && `${Number(convertTemperature(temperature)).toFixed(2)}`}°{`${isCelsius ? 'C' : 'F'}`}
                        </td>
                    </tr>
                    <tr>
                        <td>Humidity:</td>
                        <td>{humidity ? parseFloat(humidity).toFixed(2) : ''}%</td>
                    </tr>
                    <tr>
                        <td>CO2:</td>
                        <td>{co2 || ''} ppm</td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
};

export default EnvironmentReading;
