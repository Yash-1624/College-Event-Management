import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import api
    from "../../services/api";

import Loading
    from "../../components/Loading";

export default function EventDetails() {

    const {
        id
    } = useParams();

    const [
        event,
        setEvent
    ] = useState(null);

    const [
        error,
        setError
    ] = useState("");

    useEffect(() => {

        api.get(
            `/events/${id}`
        )
            .then(
                ({ data }) =>
                    setEvent(
                        data.event
                    )
            )
            .catch(
                (err) =>
                    setError(
                        err.response
                            ?.data
                            ?.message ||
                        "Could not load event."
                    )
            );

    }, [id]);

    if (error) {
        return (
            <main className="container">
                <div className="alert error">
                    {error}
                </div>
            </main>
        );
    }

    if (!event) {
        return <Loading />;
    }

    return (
        <main className="container narrow">

            <div className="card">

                <span className="badge">
                    {event.category}
                </span>

                <h1>
                    {event.name}
                </h1>

                <p>
                    {event.description}
                </p>

                <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                        event.date
                    ).toLocaleString()}
                </p>

                <p>
                    <strong>Location:</strong>{" "}
                    {event.location}
                </p>

                <p>
                    <strong>Registration:</strong>{" "}
                    {new Date(
                        event.registrationStartDate
                    ).toLocaleString()}
                    {" — "}
                    {new Date(
                        event.registrationEndDate
                    ).toLocaleString()}
                </p>

                <p>
                    <strong>Fee:</strong>{" "}
                    ₹{event.fee}
                </p>

                <Link
                    className="button primary"
                    to={`/student/events/${id}/register`}
                >
                    Register Now
                </Link>

            </div>

        </main>
    );
}