import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";

const useAuth = () => {
    const { auth, setAuth, updateAuth, persist, setPersist, } = useContext(AuthContext);

    return {
        roles: auth.roles || [],
        accessToken: auth.accessToken || null,
        ...auth,
        setAuth,
        updateAuth,
        persist,
        setPersist,
    }
}

export default useAuth;