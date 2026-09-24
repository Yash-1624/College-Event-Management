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


export default function RegistrationDetails() {

    const { id } =
        useParams();


    const [
        r,
        setR
    ] = useState(null);


    const [
        ticket,
        setTicket
    ] = useState(null);


    const [
        error,
        setError
    ] = useState("");


    // =====================================================
    // LOAD REGISTRATION
    // =====================================================
    useEffect(() => {

        const load =
            async () => {

                try {

                    const response =
                        await api.get(
                            `/registrations/${id}`
                        );


                    setR(
                        response.data.registration
                    );


                    // ---------------------------------------------
                    // LOAD QR TICKET
                    // ---------------------------------------------
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
                            "Ticket not found:",
                            ticketError
                        );

                    }

                } catch (err) {

                    setError(
                        err.response?.data?.message ||
                        "Could not load registration."
                    );
                }
            };


        if (id) {
            load();
        }

    }, [id]);


    if (!r) {

        if (error) {

            return (

                <main className="container narrow">

                    <div className="alert error">
                        {error}
                    </div>

                </main>
            );
        }

        return <Loading />;
    }


    const p =
        r.payment || {};


    return (

        <main className="container narrow">

            <div className="card">

                <h1>
                    Registration Details
                </h1>


                {/* =================================================
            STUDENT INFORMATION
        ================================================= */}
                <h2>
                    Student Information
                </h2>


                <p>
                    <strong>
                        Full Name:
                    </strong>{" "}
                    {r.studentInformation.fullName}
                </p>


                <p>
                    <strong>
                        College PID:
                    </strong>{" "}
                    {r.studentInformation.collegePid ||
                        "-"}
                </p>


                <p>
                    <strong>
                        College:
                    </strong>{" "}
                    {r.studentInformation.collegeName}
                </p>


                <p>
                    <strong>
                        Year/Semester:
                    </strong>{" "}
                    {r.studentInformation.yearSemester}
                </p>


                {/* =================================================
            CONTACT
        ================================================= */}
                <h2>
                    Contact
                </h2>


                <p>
                    <strong>
                        Mobile:
                    </strong>{" "}
                    {r.contactInformation.mobileNumber}
                </p>


                <p>
                    <strong>
                        Email:
                    </strong>{" "}
                    {r.contactInformation.email}
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
                    {r.event.name}
                </p>


                <p>
                    <strong>
                        Category:
                    </strong>{" "}
                    {r.event.category}
                </p>


                <p>
                    <strong>
                        Date:
                    </strong>{" "}
                    {new Date(
                        r.event.date
                    ).toLocaleString()}
                </p>


                <p>
                    <strong>
                        Location:
                    </strong>{" "}
                    {r.event.location}
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
                    {r.participation.type}
                </p>


                {r.participation.type ===
                    "Team" && (
                        <>
                            <p>
                                <strong>
                                    Team:
                                </strong>{" "}
                                {r.participation.teamName}
                            </p>

                            <p>
                                <strong>
                                    Members:
                                </strong>{" "}
                                {r.participation.numberOfMembers}
                            </p>
                        </>
                    )}


                {/* =================================================
            PAYMENT
        ================================================= */}
                <h2>
                    Payment
                </h2>


                <p>
                    <strong>
                        Status:
                    </strong>{" "}
                    {p.status ||
                        r.payment.status}
                </p>


                <p>
                    <strong>
                        Transaction ID:
                    </strong>{" "}
                    {p.transactionId ||
                        "-"}
                </p>


                <p>
                    <strong>
                        Amount:
                    </strong>{" "}
                    ₹{p.amount ??
                        r.event.fee}
                </p>


                {p.paymentMethod && (
                    <p>
                        <strong>
                            Payment Method:
                        </strong>{" "}
                        {p.paymentMethod}
                    </p>
                )}


                {p.gateway && (
                    <p>
                        <strong>
                            Gateway:
                        </strong>{" "}
                        {p.gateway}
                    </p>
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
                    {r.registrationId}
                </p>


                <p>
                    <strong>
                        Registration Date:
                    </strong>{" "}
                    {new Date(
                        r.createdAt
                    ).toLocaleString()}
                </p>


                <p>
                    <strong>
                        Status:
                    </strong>{" "}
                    {r.registrationStatus}
                </p>


                {/* =================================================
            QR TICKET
        ================================================= */}
                {ticket && (

                    <div className="ticket-section">

                        <h2>
                            Event Entry Ticket
                        </h2>


                        <div className="ticket-card">

                            <img
                                src={ticket.qrCode}
                                alt="Event Entry QR"
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


                            {ticket.enteredAt && (
                                <p>
                                    <strong>
                                        Entered At:
                                    </strong>{" "}
                                    {new Date(
                                        ticket.enteredAt
                                    ).toLocaleString()}
                                </p>
                            )}

                        </div>

                    </div>

                )}


                {!ticket &&
                    r.registrationStatus ===
                    "Confirmed" && (

                        <div className="alert error">

                            Payment is successful, but
                            the QR ticket has not been
                            generated.

                        </div>
                    )}


                <Link
                    to="/student/registrations"
                >
                    Back to My Registrations
                </Link>

            </div>

        </main>
    );
}