import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';
import useLocalStorage from "../../hooks/useLocalStorage";
import Loader from '../Loader/Loader';

const PersistSignIn = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const auth = useAuth();
    const [persist] = useLocalStorage('persist', false);

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    useEffect(() => {
        if (!persist) {
            localStorage.removeItem('auth');
        }
    }, [persist]);

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <Loader />
                    : <Outlet />
            }
        </>
    )
}

export default PersistSignIn;