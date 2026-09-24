import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import api
    from "../services/api";

export default function ForgotPassword() {

    const [
        email,
        setEmail
    ] = useState("");

    const [
        error,
        setError
    ] = useState("");

    const navigate =
        useNavigate();

    const submit =
        async (e) => {

            e.preventDefault();

            try {

                await api.post(
                    "/auth/forgot-password",
                    {
                        email
                    }
                );

                navigate(
                    `/reset-password?email=${encodeURIComponent(
                        email
                    )}`
                );

            } catch (err) {

                setError(
                    err.response
                        ?.data
                        ?.message ||
                    "Could not send OTP."
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
                    Forgot Password
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
                        value={email}
                        onChange={
                            (e) =>
                                setEmail(
                                    e.target.value
                                )
                        }
                    />
                </label>

                <button className="button primary">
                    Send OTP
                </button>

                <Link to="/login">
                    Back to Login
                </Link>

            </form>

        </div>
    );
}