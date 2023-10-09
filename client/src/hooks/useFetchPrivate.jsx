import fetchPrivate from "../api/fetchPrivate";
import { useEffect, useCallback } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const usePrivateFetch = () => {
    const refresh = useRefreshToken();
    const auth = useAuth();

    const privateFetch = useCallback(async (endpoint, options = {}) => {
        if (!options.headers) {
            options.headers = {};
        }

        if (!options.headers['Authorization'] && auth?.accessToken) {
            options.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        }

        try {
            const response = await fetchPrivate(endpoint, options);
            return response;
        } catch (error) {
            if (error.message.includes("403")) {
                const newAccessToken = await refresh();
                options.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return await fetchPrivate(endpoint, options);
            }
            throw error;
        }
    }, [auth, refresh]);

    useEffect(() => {
        // Any cleanup logic if necessary (e.g. resetting tokens or other settings)

        return () => {
            // Clean up listeners or other resources if needed
        };
    }, [auth, refresh]);

    return privateFetch;
}

export default usePrivateFetch;