import React, { useState } from 'react';
import EnvironmentReading from '../../Sensors/EnvironmentReading';
import styles from './Footer.module.scss';

function Footer() {
    return (
        <footer className={styles.Footer}>
            <EnvironmentReading />
        </footer>
    );
}

export default Footer;
