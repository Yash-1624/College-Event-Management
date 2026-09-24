import {
    Link
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";

import {
    useEffect,
    useState
} from "react";

import api
    from "../../services/api";

export default function StudentDashboard() {

    const {
        user
    } = useAuth();

    const [
        stats,
        setStats
    ] = useState({
        events: 0,
        registrations: 0,
        upcoming: 0
    });

    useEffect(() => {

        Promise.all([
            api.get("/events"),
            api.get("/registrations/my")
        ])
            .then(
                ([
                    events,
                    registrations
                ]) => {

                    const now =
                        new Date();

                    setStats({
                        events:
                            events.data.events
                                .length,

                        registrations:
                            registrations
                                .data
                                .registrations
                                .length,

                        upcoming:
                            registrations
                                .data
                                .registrations
                                .filter(
                                    (r) =>
                                        r.event &&
                                        new Date(
                                            r.event.date
                                        ) >= now
                                )
                                .length
                    });
                }
            );

    }, []);

    return (
        <main className="container">

            <section className="hero">

                <h1>
                    Welcome,{" "}
                    {user?.fullName}
                </h1>

                <p>
                    Browse college events
                    and register using
                    your profile information.
                </p>

            </section>

            <div className="stats">

                <div className="stat">
                    <b>
                        {stats.events}
                    </b>

                    <span>
                        Available Events
                    </span>
                </div>

                <div className="stat">
                    <b>
                        {stats.registrations}
                    </b>

                    <span>
                        Registered Events
                    </span>
                </div>

                <div className="stat">
                    <b>
                        {stats.upcoming}
                    </b>

                    <span>
                        Upcoming Events
                    </span>
                </div>

            </div>

            <div className="quick-links">

                <Link
                    className="card"
                    to="/student/events"
                >
                    <h3>
                        Available Events
                    </h3>

                    <p>
                        Browse events.
                    </p>
                </Link>

                <Link
                    className="card"
                    to="/student/registrations"
                >
                    <h3>
                        My Registrations
                    </h3>

                    <p>
                        View registrations.
                    </p>
                </Link>

                <Link
                    className="card"
                    to="/student/profile"
                >
                    <h3>
                        My Profile
                    </h3>

                    <p>
                        Update profile.
                    </p>
                </Link>

            </div>

        </main>
    );
}