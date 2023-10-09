import useAuth from './useAuth';
import apiUrl from '../config';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await fetch(`${apiUrl}/refresh`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const responseData = await response.json();

            setAuth(prev => {
                return {
                    ...prev,
                    roles: responseData.roles,
                    accessToken: responseData.accessToken
                };
            });

            return responseData.accessToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    };

    return refresh;
};

export default useRefreshToken;