import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useLocalStorage from '../../hooks/useLocalStorage';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import apiUrl from '../../config';
import styles from './SignIn.module.scss';
const SIGNIN_URL = `${apiUrl}/signin`;

function SignIn() {
    const { setAuth, persist, setPersist } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser, userAttributes] = useInput('user', '') //useState('')
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [check, toggleCheck] = useToggle('persist', false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(SIGNIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ user, pwd }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (!responseData.accessToken || !responseData.roles) {
                throw new Error('Invalid response format');
            }

            const { accessToken, roles } = responseData;

            setAuth({ roles, accessToken });
            localStorage.setItem('auth', JSON.stringify({ roles, accessToken }));
            resetUser()//setUser('');
            setPwd('');
            setSuccess(true);
            navigate(from, { replace: true });

            if (persist) {
                localStorage.setItem('auth', JSON.stringify({ roles, accessToken }));
            } else {
                localStorage.removeItem('auth');
            }

        } catch (err) {
            if (!err?.message) {
                setErrMsg('No Server Response');
            } else if (err.message.includes('Missing Username or Password')) {
                setErrMsg('Missing Username or Password');
            } else if (err.message.includes('Unauthorized')) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Sign in failed');
            }

            errRef.current.focus();
        }
    };

    // const togglePersist = () => {
    //     setPersist(prev => !prev);
    // };

    // useEffect(() => {
    //     localStorage.setItem('persist', persist);
    // }, [persist]);

    return (
        <>
            {success ? (
                <section className={styles.section}>
                    <h3 className={styles.h3}>You are signed in!</h3>
                    <br />
                    <p>
                        <a href="/">Go to Home</a>
                    </p>
                </section>
            ) : (
                <section className={styles.section}>
                    <p ref={errRef} className={errMsg ? styles.errmsg : styles.offscreen} aria-live="assertive">{errMsg}</p>
                    <h3 className={styles.h3}>Sign In</h3>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.label} htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            {...userAttributes}
                            className={styles.inputText}
                        />
                        <label className={styles.label} htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            className={styles.inputPassword}
                        />
                        <button className={styles.formButton}>Sign In</button>
                        <div className={styles.persistCheck}>
                            <input
                                type="checkbox"
                                id="persist"
                                onChange={toggleCheck}
                                checked={check}
                            />
                            <label htmlFor="persist">Trust this device</label>
                        </div>
                    </form>
                    <p className={styles.bodyCopy}>
                        Ready for your credentials?
                        <br />
                        <span className={styles.line}>
                            <Link className={styles.link} to="/sign-up">Sign Up</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    );
}

export default SignIn;