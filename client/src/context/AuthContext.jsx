import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

const AuthContext =
    createContext(null);

export function AuthProvider({
    children
}) {
    const [
        user,
        setUser
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const logout = () => {
        localStorage.removeItem(
            "token"
        );

        setUser(null);
    };

    const login = async (
        email,
        password
    ) => {
        const { data } =
            await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

        localStorage.setItem(
            "token",
            data.token
        );

        setUser(
            data.user
        );

        return data;
    };

    useEffect(() => {
        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {
            setLoading(false);
            return;
        }

        api
            .get("/auth/me")
            .then(({ data }) => {
                setUser(
                    data.user
                );
            })
            .catch(() => {
                logout();
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth =
    () =>
        useContext(
            AuthContext
        );