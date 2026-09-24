import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

export default function Login() {
    const {
        login
    } = useAuth();

    const navigate =
        useNavigate();

    const [
        form,
        setForm
    ] = useState({
        email: "",
        password: ""
    });

    const [
        error,
        setError
    ] = useState("");

    const submit =
        async (e) => {
            e.preventDefault();

            setError("");

            try {
                const data =
                    await login(
                        form.email,
                        form.password
                    );

                if (
                    data.user.role ===
                    "admin"
                ) {
                    navigate(
                        "/admin"
                    );
                } else {
                    navigate(
                        "/student"
                    );
                }

            } catch (err) {
                setError(
                    err.response
                        ?.data
                        ?.message ||
                    "Login failed."
                );
            }
        };

    return (
        <div className="auth-page">

            <form
                className="form-card"
                onSubmit={submit}
            >

                <h1>
                    Login
                </h1>

                {error && (
                    <div className="alert error">
                        {error}
                    </div>
                )}

                <label>
                    Email

                    <input
                        type="email"
                        required
                        value={
                            form.email
                        }
                        onChange={
                            (e) =>
                                setForm({
                                    ...form,
                                    email:
                                        e.target.value
                                })
                        }
                    />
                </label>

                <label>
                    Password

                    <input
                        type="password"
                        required
                        value={
                            form.password
                        }
                        onChange={
                            (e) =>
                                setForm({
                                    ...form,
                                    password:
                                        e.target.value
                                })
                        }
                    />
                </label>

                <button className="button primary">
                    Login
                </button>

                <p>
                    <Link to="/forgot-password">
                        Forgot Password?
                    </Link>
                </p>

                <p>
                    New student?{" "}
                    <Link to="/signup">
                        Create Account
                    </Link>
                </p>

            </form>

        </div>
    );
}