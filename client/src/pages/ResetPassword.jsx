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

export default function ResetPassword() {

    const [
        params
    ] = useSearchParams();

    const navigate =
        useNavigate();

    const [
        form,
        setForm
    ] = useState({
        email:
            params.get(
                "email"
            ) || "",

        otp: "",

        newPassword: ""
    });

    const [
        error,
        setError
    ] = useState("");

    const submit =
        async (e) => {

            e.preventDefault();

            try {

                await api.post(
                    "/auth/reset-password",
                    form
                );

                navigate(
                    "/login"
                );

            } catch (err) {

                setError(
                    err.response
                        ?.data
                        ?.message ||
                    "Password reset failed."
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
                    Reset Password
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
                    OTP

                    <input
                        required
                        maxLength="6"
                        value={
                            form.otp
                        }
                        onChange={
                            (e) =>
                                setForm({
                                    ...form,
                                    otp:
                                        e.target.value
                                })
                        }
                    />
                </label>

                <label>
                    New Password

                    <input
                        type="password"
                        minLength="6"
                        required
                        value={
                            form.newPassword
                        }
                        onChange={
                            (e) =>
                                setForm({
                                    ...form,
                                    newPassword:
                                        e.target.value
                                })
                        }
                    />
                </label>

                <button className="button primary">
                    Reset Password
                </button>

                <Link to="/login">
                    Back to Login
                </Link>

            </form>

        </div>
    );
}