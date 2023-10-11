import React, { useState } from 'react';
import { Link } from "react-router-dom"
import Users from "../../components/Users/Users"
import styles from './Admin.module.scss';

import TextScrambler from '../../components/TextScambler/TextScrambler';
import Loader from '../../components/Loader/Loader';

const Admin = () => {
    const [isLoading, setIsLoading] = useState(false);
    let herophrases = ['admin'];

    return (
        isLoading ? <Loader /> :
            <section className="container">
                <div>
                    <h1 className="hero subpage"><TextScrambler phrases={herophrases} /></h1>
                </div>
                <Users />
            </section>
    )
}

export default Admin
