import useAuth from "./useAuth";
import apiUrl from "../config";

const useSignout = () => {
    const { setAuth } = useAuth();

    const signout = async () => {
        setAuth({});
        try {
            const response = await fetch(`${apiUrl}/signout`, {
                method: 'GET',
                credentials: 'include' // For sending and receiving cookies
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return signout;
}

export default useSignout;