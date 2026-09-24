import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Html5Qrcode
} from "html5-qrcode";

import api from "../../services/api";


export default function TicketScanner() {

    const scannerRef =
        useRef(null);

    const [
        result,
        setResult
    ] = useState(null);

    const [
        error,
        setError
    ] = useState("");

    const [
        scanning,
        setScanning
    ] = useState(true);


    useEffect(() => {

        const scanner =
            new Html5Qrcode(
                "ticket-scanner"
            );

        scannerRef.current =
            scanner;


        const startScanner =
            async () => {

                try {

                    await scanner.start(

                        {
                            facingMode:
                                "environment"
                        },

                        {
                            fps: 10,

                            qrbox: {
                                width: 280,
                                height: 280
                            }

                        },

                        async (
                            decodedText
                        ) => {

                            if (
                                !scanning
                            ) {
                                return;
                            }

                            setScanning(
                                false
                            );

                            try {

                                await scanner.stop();

                            } catch { }


                            await scanTicket(
                                decodedText
                            );

                        },

                        () => { }

                    );

                } catch (err) {

                    console.error(
                        err
                    );

                    setError(
                        "Unable to access the camera. Please allow camera permission."
                    );

                }

            };


        startScanner();


        return () => {

            if (
                scannerRef.current
            ) {

                scannerRef.current
                    .stop()
                    .catch(
                        () => { }
                    );

            }

        };

    }, []);


    const scanTicket =
        async (
            qrText
        ) => {

            try {

                setError("");

                const response =
                    await api.post(
                        "/tickets/scan",
                        {
                            qrPayload:
                                qrText
                        }
                    );

                setResult(
                    response.data
                );

            } catch (error) {

                setResult(
                    error.response?.data ||
                    null
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to scan ticket."
                );

            }

        };


    const restartScanner =
        async () => {

            setResult(null);
            setError("");
            setScanning(true);

            window.location.reload();

        };


    return (

        <main className="container">

            <div className="page-heading">

                <div>

                    <h1>
                        Event Entry Scanner
                    </h1>

                    <p className="hint">
                        Scan a student's event QR
                        ticket at the entrance.
                    </p>

                </div>

            </div>


            <div className="scanner-box">

                {!result && (
                    <div
                        id="ticket-scanner"
                        style={{
                            width:
                                "100%"
                        }}
                    />
                )}


                {result && (

                    <div
                        className={
                            result.status ===
                                "Entered"
                                ? "scan-result success"
                                : "scan-result error"
                        }
                    >

                        <h2>

                            {result.status ===
                                "Entered"
                                ? "✓ ENTRY SUCCESSFUL"
                                : "⚠ ALREADY ENTERED"}

                        </h2>


                        {result.ticket && (

                            <div>

                                <p>
                                    <strong>
                                        Ticket ID:
                                    </strong>{" "}
                                    {
                                        result.ticket
                                            .ticketId
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Student:
                                    </strong>{" "}
                                    {
                                        result.ticket
                                            .studentName
                                    }
                                </p>

                                <p>
                                    <strong>
                                        College PID:
                                    </strong>{" "}
                                    {
                                        result.ticket
                                            .collegePid
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Event:
                                    </strong>{" "}
                                    {
                                        result.ticket
                                            .eventName
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Entry Status:
                                    </strong>{" "}
                                    {
                                        result.ticket
                                            .entryStatus
                                    }
                                </p>

                                {result.ticket.enteredAt && (
                                    <p>
                                        <strong>
                                            Entered At:
                                        </strong>{" "}
                                        {new Date(
                                            result.ticket.enteredAt
                                        ).toLocaleString()}
                                    </p>
                                )}

                            </div>

                        )}

                    </div>

                )}


                {error &&
                    !result && (
                        <div className="alert error">
                            {error}
                        </div>
                    )}


                {result && (

                    <button
                        className="button primary"
                        onClick={
                            restartScanner
                        }
                    >
                        Scan Next Ticket
                    </button>

                )}

            </div>

        </main>

    );
} 