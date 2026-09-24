import {
    useState
} from "react";

import {
    Link,
    useNavigate,
    useSearchParams
} from "react-router-dom";

import api
    from "../services/api";

export default function VerifyEmail() {

    const [
        params
    ] = useSearchParams();

    const navigate =
        useNavigate();

    const [
        email,
        setEmail
    ] = useState(
        params.get(
            "email"
        ) || ""
    );

    const [
        otp,
        setOtp
    ] = useState("");

    const [
        message,
        setMessage
    ] = useState("");

    const [
        error,
        setError
    ] = useState("");

    const verify =
        async (e) => {
            e.preventDefault();

            try {
                const {
                    data
                } =
                    await api.post(
                        "/auth/verify-email",
                        {
                            email,
                            otp
                        }
                    );

                setMessage(
                    data.message
                );

                setTimeout(
                    () =>
                        navigate(
                            "/login"
                        ),
                    1000
                );

            } catch (err) {
                setError(
                    err.response
                        ?.data
                        ?.message ||
                    "Verification failed."
                );
            }
        };

    const resend =
        async () => {
            try {
                const {
                    data
                } =
                    await api.post(
                        "/auth/resend-otp",
                        {
                            email
                        }
                    );

                setMessage(
                    data.message
                );

                setError("");

            } catch (err) {
                setError(
                    err.response
                        ?.data
                        ?.message ||
                    "Could not resend OTP."
                );
            }
        };

    return (
        <div className="auth-page">

            <form
                className="form-card"
                onSubmit={verify}
            >

                <h1>
                    Verify Email
                </h1>

                {message && (
                    <div className="alert success">
                        {message}
                    </div>
                )}

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

                <label>
                    OTP

                    <input
                        maxLength="6"
                        required
                        value={otp}
                        onChange={
                            (e) =>
                                setOtp(
                                    e.target.value
                                )
                        }
                    />
                </label>

                <button className="button primary">
                    Verify Email
                </button>

                <button
                    type="button"
                    className="button secondary"
                    onClick={resend}
                >
                    Resend OTP
                </button>

                <Link to="/login">
                    Back to Login
                </Link>

            </form>

        </div>
    );
}