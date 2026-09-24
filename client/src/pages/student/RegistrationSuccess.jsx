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


export default function RegistrationSuccess() {

    const { id } =
        useParams();


    const [
        registration,
        setRegistration
    ] = useState(null);


    const [
        ticket,
        setTicket
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    // =====================================================
    // LOAD REGISTRATION + TICKET
    // =====================================================
    useEffect(() => {

        const loadData =
            async () => {

                try {

                    const registrationResponse =
                        await api.get(
                            `/registrations/${id}`
                        );


                    setRegistration(
                        registrationResponse.data.registration
                    );


                    try {

                        const ticketResponse =
                            await api.get(
                                `/tickets/registration/${id}`
                            );


                        setTicket(
                            ticketResponse.data.ticket
                        );

                    } catch (ticketError) {

                        console.error(
                            "Ticket loading error:",
                            ticketError
                        );

                    }

                } catch (err) {

                    setError(
                        err.response?.data?.message ||
                        "Could not load registration."
                    );

                } finally {

                    setLoading(false);

                }
            };


        if (id) {
            loadData();
        }

    }, [id]);


    if (loading) {
        return <Loading />;
    }


    if (!registration) {

        return (

            <main className="container narrow">

                <div className="alert error">

                    {error ||
                        "Registration not found."}

                </div>

            </main>
        );
    }


    const payment =
        registration.payment || {};


    return (

        <main className="container narrow">

            <div className="card success-card">

                {/* =================================================
            SUCCESS
        ================================================= */}
                <div className="success-icon">
                    ✓
                </div>


                <h1>
                    Registration Successful!
                </h1>


                <p>
                    Congratulations! You are
                    successfully registered.
                </p>


                {/* =================================================
            EVENT
        ================================================= */}
                <h2>
                    Event
                </h2>


                <p>
                    <strong>
                        Event:
                    </strong>{" "}
                    {registration.event.name}
                </p>


                <p>
                    <strong>
                        Category:
                    </strong>{" "}
                    {registration.event.category}
                </p>


                <p>
                    <strong>
                        Date:
                    </strong>{" "}
                    {new Date(
                        registration.event.date
                    ).toLocaleString()}
                </p>


                <p>
                    <strong>
                        Location:
                    </strong>{" "}
                    {registration.event.location}
                </p>


                {/* =================================================
            PARTICIPATION
        ================================================= */}
                <h2>
                    Participation
                </h2>


                <p>
                    <strong>
                        Type:
                    </strong>{" "}
                    {registration.participation.type}
                </p>


                {registration.participation.type ===
                    "Team" && (
                        <>
                            <p>
                                <strong>
                                    Team Name:
                                </strong>{" "}
                                {
                                    registration.participation
                                        .teamName
                                }
                            </p>

                            <p>
                                <strong>
                                    Team Members:
                                </strong>{" "}
                                {
                                    registration.participation
                                        .numberOfMembers
                                }
                            </p>
                        </>
                    )}


                {/* =================================================
            REGISTRATION
        ================================================= */}
                <h2>
                    Registration
                </h2>


                <p>
                    <strong>
                        Registration ID:
                    </strong>{" "}
                    {registration.registrationId}
                </p>


                <p>
                    <strong>
                        Status:
                    </strong>{" "}
                    {registration.registrationStatus}
                </p>


                {/* =================================================
            PAYMENT
        ================================================= */}
                <h2>
                    Payment
                </h2>


                <p>
                    <strong>
                        Payment Status:
                    </strong>{" "}
                    {payment.status}
                </p>


                {payment.transactionId && (
                    <p>
                        <strong>
                            Transaction ID:
                        </strong>{" "}
                        {payment.transactionId}
                    </p>
                )}


                {payment.amount !== undefined && (
                    <p>
                        <strong>
                            Amount:
                        </strong>{" "}
                        ₹{payment.amount}
                    </p>
                )}


                {/* =================================================
            QR TICKET
        ================================================= */}
                {ticket ? (

                    <div className="ticket-section">

                        <h2>
                            Event Entry QR Ticket
                        </h2>


                        <p>
                            Show this QR code at the
                            event entrance.
                        </p>


                        <div className="ticket-card">

                            <img
                                src={ticket.qrCode}
                                alt="Event Entry QR Code"
                                className="ticket-qr"
                            />


                            <p>
                                <strong>
                                    Ticket ID:
                                </strong>{" "}
                                {ticket.ticketId}
                            </p>


                            <p>
                                <strong>
                                    College PID:
                                </strong>{" "}
                                {ticket.collegePid}
                            </p>


                            <p>
                                <strong>
                                    Student:
                                </strong>{" "}
                                {ticket.studentName}
                            </p>


                            <p>
                                <strong>
                                    Event:
                                </strong>{" "}
                                {ticket.eventName}
                            </p>


                            <p>
                                <strong>
                                    Entry Status:
                                </strong>{" "}
                                {ticket.entryStatus}
                            </p>

                        </div>

                    </div>

                ) : (

                    <div className="alert error">

                        Payment was successful,
                        but the QR ticket could not
                        be loaded.

                    </div>

                )}


                {/* =================================================
            BUTTONS
        ================================================= */}
                <div className="button-row">

                    <Link
                        className="button primary"
                        to="/student/registrations"
                    >
                        My Registrations
                    </Link>


                    <Link
                        className="button"
                        to={`/student/registrations/${id}`}
                    >
                        View Registration Details
                    </Link>

                </div>

            </div>

        </main>
    );
}