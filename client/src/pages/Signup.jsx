import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import api
    from "../services/api";


export default function Signup() {

    const navigate =
        useNavigate();


    const [
        form,
        setForm
    ] = useState({

        fullName: "",

        collegePid: "",

        collegeName: "",

        yearSemester: "",

        mobileNumber: "",

        email: "",

        password: "",

        confirmPassword: ""

    });


    const [
        message,
        setMessage
    ] = useState("");


    const [
        error,
        setError
    ] = useState("");


    const change =
        (e) => {

            const {
                name,
                value
            } = e.target;


            setForm({

                ...form,

                [name]:
                    name ===
                        "collegePid"

                        ? value.toUpperCase()

                        : value

            });

        };


    const submit =
        async (e) => {

            e.preventDefault();


            setError("");
            setMessage("");


            if (
                form.password !==
                form.confirmPassword
            ) {

                setError(
                    "Passwords do not match."
                );

                return;

            }


            try {

                const {
                    data
                } =
                    await api.post(
                        "/auth/signup",
                        form
                    );


                setMessage(
                    data.message
                );


                navigate(
                    `/verify-email?email=${encodeURIComponent(
                        form.email
                    )}`
                );


            } catch (
            err
            ) {

                setError(
                    err.response
                        ?.data
                        ?.message ||
                    "Signup failed."
                );

            }

        };


    return (

        <div className="auth-page">

            <form
                className="form-card wide"
                onSubmit={submit}
            >

                <h1>
                    Create Student Account
                </h1>


                {
                    message && (

                        <div className="alert success">

                            {message}

                        </div>

                    )
                }


                {
                    error && (

                        <div className="alert error">

                            {error}

                        </div>

                    )
                }


                <div className="grid-2">


                    {/* FULL NAME */}

                    <label>

                        Full Name

                        <input
                            name="fullName"
                            required
                            value={
                                form.fullName
                            }
                            onChange={
                                change
                            }
                            placeholder="Enter your full name"
                        />

                    </label>


                    {/* COLLEGE PID */}

                    <label>

                        College PID

                        <input
                            name="collegePid"
                            required
                            value={
                                form.collegePid
                            }
                            onChange={
                                change
                            }
                            placeholder="Enter your college PID"
                            maxLength="30"
                        />

                        <span className="hint">

                            Enter your unique college/student PID.

                        </span>

                    </label>


                    {/* COLLEGE */}

                    <label>

                        College/University Name

                        <input
                            name="collegeName"
                            required
                            value={
                                form.collegeName
                            }
                            onChange={
                                change
                            }
                            placeholder="Enter college/university name"
                        />

                    </label>


                    {/* YEAR */}

                    <label>

                        Year/Semester

                        <input
                            name="yearSemester"
                            required
                            value={
                                form.yearSemester
                            }
                            onChange={
                                change
                            }
                            placeholder="Example: 3rd Year / 6th Semester"
                        />

                    </label>


                    {/* MOBILE */}

                    <label>

                        Mobile Number

                        <input
                            name="mobileNumber"
                            required
                            value={
                                form.mobileNumber
                            }
                            onChange={
                                change
                            }
                            placeholder="Enter mobile number"
                        />

                    </label>


                    {/* EMAIL */}

                    <label>

                        Email Address

                        <input
                            type="email"
                            name="email"
                            required
                            value={
                                form.email
                            }
                            onChange={
                                change
                            }
                            placeholder="Enter email address"
                        />

                    </label>


                    {/* PASSWORD */}

                    <label>

                        Password

                        <input
                            type="password"
                            name="password"
                            minLength="6"
                            required
                            value={
                                form.password
                            }
                            onChange={
                                change
                            }
                            placeholder="Minimum 6 characters"
                        />

                    </label>


                    {/* CONFIRM PASSWORD */}

                    <label>

                        Confirm Password

                        <input
                            type="password"
                            name="confirmPassword"
                            minLength="6"
                            required
                            value={
                                form.confirmPassword
                            }
                            onChange={
                                change
                            }
                            placeholder="Confirm your password"
                        />

                    </label>


                </div>


                <button
                    className="button primary"
                    type="submit"
                >

                    Sign Up

                </button>


                <p>

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </form>

        </div>

    );

}