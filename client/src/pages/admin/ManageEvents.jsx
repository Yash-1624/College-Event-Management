import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import api from "../../services/api";

import EventCard from "../../components/EventCard";

import Loading from "../../components/Loading";


export default function ManageEvents() {

    const [events, setEvents] = useState(null);

    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState(false);


    // ========================================
    // LOAD ALL EVENTS
    // ========================================

    const load = async () => {

        try {

            setError("");

            const { data } = await api.get(
                "/events/admin/all"
            );

            setEvents(
                data.events || []
            );

        } catch (err) {

            console.error(
                "Failed to load events:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load events."
            );

            setEvents([]);

        }
    };


    // ========================================
    // LOAD EVENTS ON PAGE OPEN
    // ========================================

    useEffect(() => {

        load();

    }, []);


    // ========================================
    // DELETE EVENT
    // ========================================

    const remove = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this event?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(true);

            setError("");

            await api.delete(
                `/events/${id}`
            );

            await load();

        } catch (err) {

            console.error(
                "Delete event error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete event."
            );

        } finally {

            setActionLoading(false);

        }
    };


    // ========================================
    // CHANGE EVENT STATUS
    // ========================================

    const changeStatus = async (
        id,
        status
    ) => {

        try {

            setActionLoading(true);

            setError("");

            await api.patch(
                `/events/${id}/status`,
                {
                    status
                }
            );

            await load();

        } catch (err) {

            console.error(
                "Change status error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update event status."
            );

        } finally {

            setActionLoading(false);

        }
    };


    // ========================================
    // INITIAL LOADING
    // ========================================

    if (!events) {

        return <Loading />;

    }


    // ========================================
    // PAGE
    // ========================================

    return (

        <main className="container">


            {/* ================================ */}
            {/* PAGE HEADING */}
            {/* ================================ */}

            <div className="page-heading">

                <div>

                    <h1>
                        Manage Events
                    </h1>

                    <p className="hint">
                        Create, manage and control
                        your college events.
                    </p>

                </div>


                <Link
                    className="button primary"
                    to="/admin/events/add"
                >
                    + Add Event
                </Link>

            </div>


            {/* ================================ */}
            {/* ERROR MESSAGE */}
            {/* ================================ */}

            {error && (

                <div className="alert error">

                    {error}

                </div>

            )}


            {/* ================================ */}
            {/* EMPTY EVENTS */}
            {/* ================================ */}

            {events.length === 0 ? (

                <div className="form-card empty-state">

                    <h2>
                        No Events Found
                    </h2>

                    <p>
                        You have not created any events yet.
                    </p>

                    <Link
                        className="button primary"
                        to="/admin/events/add"
                    >
                        Create Your First Event
                    </Link>

                </div>

            ) : (

                /* ============================ */
                /* EVENTS GRID */
                /* ============================ */

                <div className="card-grid">

                    {events.map(
                        (event) => (

                            <div
                                key={
                                    event._id
                                }
                            >

                                {/* ====================== */}
                                {/* EVENT CARD */}
                                {/* ====================== */}

                                <EventCard
                                    event={event}
                                    admin
                                />


                                {/* ====================== */}
                                {/* ADMIN ACTIONS */}
                                {/* ====================== */}

                                <div className="admin-actions">


                                    {/* STATUS */}


                                    <select
                                        value={
                                            event.status ||
                                            "Draft"
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                        onChange={
                                            (e) =>
                                                changeStatus(
                                                    event._id,
                                                    e.target.value
                                                )
                                        }
                                    >

                                        {[
                                            "Draft",
                                            "Published",
                                            "Registration Open",
                                            "Registration Closed",
                                            "Completed",
                                            "Cancelled"
                                        ].map(
                                            (status) => (

                                                <option
                                                    key={
                                                        status
                                                    }
                                                    value={
                                                        status
                                                    }
                                                >
                                                    {status}
                                                </option>

                                            )
                                        )}

                                    </select>


                                    {/* DELETE */}


                                    <button
                                        type="button"
                                        className="button danger"
                                        disabled={
                                            actionLoading
                                        }
                                        onClick={() =>
                                            remove(
                                                event._id
                                            )
                                        }
                                    >

                                        {actionLoading
                                            ? "Please wait..."
                                            : "Delete"}

                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </main>

    );

}