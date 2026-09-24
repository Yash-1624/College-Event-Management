import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import api
    from "../../services/api";

import Loading
    from "../../components/Loading";

export default function AdminDashboard() {

    const [
        stats,
        setStats
    ] = useState(null);

    useEffect(() => {

        api.get(
            "/admin/stats"
        )
            .then(
                ({ data }) =>
                    setStats(
                        data.stats
                    )
            );

    }, []);

    if (!stats) {
        return <Loading />;
    }

    return (
        <main className="container">

            <h1>
                Admin Dashboard
            </h1>

            <div className="stats">

                <div className="stat">
                    <b>
                        {stats.totalStudents}
                    </b>
                    <span>
                        Total Students
                    </span>
                </div>

                <div className="stat">
                    <b>
                        {stats.totalEvents}
                    </b>
                    <span>
                        Total Events
                    </span>
                </div>

                <div className="stat">
                    <b>
                        {stats.activeEvents}
                    </b>
                    <span>
                        Active Events
                    </span>
                </div>

                <div className="stat">
                    <b>
                        {stats.totalRegistrations}
                    </b>
                    <span>
                        Total Registrations
                    </span>
                </div>

                <div className="stat">
                    <b>
                        {stats.successfulPayments}
                    </b>
                    <span>
                        Successful Payments
                    </span>
                </div>

                <div className="stat">
                    <b>
                        {stats.pendingPayments}
                    </b>
                    <span>
                        Pending Payments
                    </span>
                </div>

            </div>

            <div className="quick-links">

                <Link
                    className="card"
                    to="/admin/events"
                >
                    <h3>
                        Manage Events
                    </h3>

                    <p>
                        Add and manage events.
                    </p>
                </Link>

                <Link
                    className="card"
                    to="/admin/registrations"
                >
                    <h3>
                        Registrations
                    </h3>

                    <p>
                        View student registrations.
                    </p>
                </Link>

                <Link
                    className="card"
                    to="/admin/students"
                >
                    <h3>
                        Students
                    </h3>

                    <p>
                        Manage students.
                    </p>
                </Link>

                <Link
                    className="card"
                    to="/admin/payments"
                >
                    <h3>
                        Payments
                    </h3>

                    <p>
                        View payment transactions.
                    </p>
                </Link>

            </div>

        </main>
    );
}