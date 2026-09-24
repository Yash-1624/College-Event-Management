import {
    useEffect,
    useState
} from "react";

import api
    from "../../services/api";

import Loading
    from "../../components/Loading";


export default function Profile() {

    const [
        profile,
        setProfile
    ] = useState(null);


    const [
        form,
        setForm
    ] = useState({});


    const [
        message,
        setMessage
    ] = useState("");


    const [
        error,
        setError
    ] = useState("");


    const load =
        () =>

            api
                .get("/profile")
                .then(
                    ({
                        data
                    }) => {

                        setProfile(
                            data.profile
                        );


                        setForm({

                            fullName:
                                data.profile
                                    .fullName,

                            collegePid:
                                data.profile
                                    .collegePid,

                            collegeName:
                                data.profile
                                    .collegeName,

                            yearSemester:
                                data.profile
                                    .yearSemester,

                            mobileNumber:
                                data.profile
                                    .mobileNumber

                        });

                    }
                );


    useEffect(
        () => {

            load();

        },
        []
    );


    const submit =
        async (
            e
        ) => {

            e.preventDefault();


            try {

                const {
                    data
                } =
                    await api.put(
                        "/profile",
                        form
                    );


                setMessage(
                    data.message
                );

                setError("");


                load();

            } catch (
            err
            ) {

                setError(
                    err.response
                        ?.data
                        ?.message ||
                    "Could not update profile."
                );

            }

        };


    if (
        !profile
    ) {

        return <Loading />;

    }


    return (

        <main className="container narrow">

            <form
                className="form-card"
                onSubmit={submit}
            >

                <h1>
                    Profile
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


                <label>

                    Full Name

                    <input
                        required
                        value={
                            form.fullName ||
                            ""
                        }
                        onChange={
                            e =>
                                setForm({

                                    ...form,

                                    fullName:
                                        e.target.value

                                })
                        }
                    />

                </label>


                {/* COLLEGE PID */}

                <label>

                    College PID

                    <input
                        required
                        value={
                            form.collegePid ||
                            ""
                        }
                        onChange={
                            e =>
                                setForm({

                                    ...form,

                                    collegePid:
                                        e.target.value
                                            .toUpperCase()

                                })
                        }
                    />

                    <span className="hint">

                        Your College PID is used for
                        your event entry QR code.

                    </span>

                </label>


                <label>

                    College/University Name

                    <input
                        required
                        value={
                            form.collegeName ||
                            ""
                        }
                        onChange={
                            e =>
                                setForm({

                                    ...form,

                                    collegeName:
                                        e.target.value

                                })
                        }
                    />

                </label>


                <label>

                    Year/Semester

                    <input
                        required
                        value={
                            form.yearSemester ||
                            ""
                        }
                        onChange={
                            e =>
                                setForm({

                                    ...form,

                                    yearSemester:
                                        e.target.value

                                })
                        }
                    />

                </label>


                <label>

                    Mobile Number

                    <input
                        required
                        value={
                            form.mobileNumber ||
                            ""
                        }
                        onChange={
                            e =>
                                setForm({

                                    ...form,

                                    mobileNumber:
                                        e.target.value

                                })
                        }
                    />

                </label>


                <label>

                    Email Address

                    <input
                        value={
                            profile.email
                        }
                        disabled
                    />

                </label>


                <p>

                    <strong>
                        Email Verification:
                    </strong>{" "}

                    {
                        profile.isEmailVerified
                            ? "Verified"
                            : "Not Verified"
                    }

                </p>


                <button
                    className="button primary"
                    type="submit"
                >

                    Edit Profile / Save

                </button>

            </form>

        </main>

    );

}