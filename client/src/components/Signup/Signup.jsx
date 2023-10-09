import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Signup.module.scss';
import apiUrl from '../../config';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = `${apiUrl}/register`;

const Signup = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [subscribeToEmail, setSubscribeToEmail] = useState(false);
    const [subscribeToSMS, setSubscribeToSMS] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validateUser = USER_REGEX.test(user);
        const validatePwd = PWD_REGEX.test(pwd);

        if (!validateUser || !validatePwd) {
            setErrMsg("Invalid Entry");
            return;
        }

        try {
            const response = await fetch(REGISTER_URL, {
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

            setSuccess(true);
            setUser('');
            setPwd('');
            setMatchPwd('');

        } catch (err) {
            if (err instanceof Error && err.message.startsWith('HTTP error! Status: 409')) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed');
            }

            if (errRef.current) {
                errRef.current.focus();
            }
        }
    };

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/sign-in">Sign In</a>
                    </p>
                </section>
            ) : (
                <section className={styles.section}>
                    <p ref={errRef} className={errMsg ? styles.errmsg : styles.offscreen} aria-live="assertive">{errMsg}</p>
                    <h3 className={styles.h3}>actively recruiting</h3>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.label} htmlFor='username'>username:</label>
                        <input
                            type="text"
                            placeholder='create a username'
                            className={styles.inputText}
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            required
                            aria-invalid={validName ? 'false' : true}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? styles.instructions : styles.offscreen}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters. <br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                        <label className={styles.label} htmlFor="password">
                            password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? styles.valid : styles.hide} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? styles.hide : styles.invalid} />
                        </label>
                        <input
                            type="password"
                            placeholder='enter a secure password'
                            id="password"
                            className={styles.inputPassword}
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? styles.instructions : styles.offscreen}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                        <label className={styles.label} htmlFor="confirm_pwd">
                            password reentry:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? styles.valid : styles.hide} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? styles.hide : styles.invalid} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            placeholder='type your password again'
                            className={styles.inputPassword}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? styles.instructions : styles.offscreen}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>
                        <button className={styles.formButton} disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p className={styles.bodyCopy}>
                        Already indoctrinated?<br />
                        <span className={styles.line}>
                            <a className={styles.link} href="/sign-in">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Signup;