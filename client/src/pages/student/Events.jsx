import {
    useEffect,
    useState
} from "react";

import api
    from "../../services/api";

import EventCard
    from "../../components/EventCard";

import Loading
    from "../../components/Loading";

export default function Events() {

    const [
        events,
        setEvents
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    useEffect(() => {

        api.get("/events")
            .then(
                ({ data }) => {
                    setEvents(
                        data.events
                    );
                }
            )
            .catch(
                (err) => {
                    setError(
                        err.response
                            ?.data
                            ?.message ||
                        "Could not load events."
                    );
                }
            )
            .finally(
                () =>
                    setLoading(false)
            );

    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="container">

            <h1>
                Available Events
            </h1>

            {error && (
                <div className="alert error">
                    {error}
                </div>
            )}

            <div className="card-grid">

                {events.map(
                    (event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                        />
                    )
                )}

            </div>

            {!events.length && (
                <div className="empty">
                    No events available.
                </div>
            )}

        </main>
    );
}