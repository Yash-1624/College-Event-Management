import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/api";

export default function QRScanner({ eventId }) {
    const scannerRef = useRef(null);
    const [result, setResult] = useState(null);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        return () => {
            if (scanner.isScanning) {
                scanner.stop().catch(() => { });
            }
        };
    }, []);

    const startScanner = async () => {
        setResult(null);

        try {
            const scanner = scannerRef.current;

            if (!scanner) return;

            setScanning(true);

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: {
                        width: 220,
                        height: 220
                    }
                },
                async (decodedText) => {
                    await handleScan(decodedText);

                    try {
                        await scanner.stop();
                    } catch (error) {
                        console.error(error);
                    }

                    setScanning(false);
                },
                () => { }
            );
        } catch (error) {
            console.error(error);

            setScanning(false);

            setResult({
                type: "error",
                message:
                    "Unable to access the camera. Please allow camera permission."
            });
        }
    };

    const handleScan = async (decodedText) => {
        try {
            const qrData = JSON.parse(decodedText);

            if (!qrData.ticketId) {
                setResult({
                    type: "error",
                    message: "Invalid QR code."
                });

                return;
            }

            const response = await api.post("/tickets/scan", {
                ticketId: qrData.ticketId,
                eventId
            });

            const ticket = response.data.ticket;

            setResult({
                type: "success",
                message:
                    response.data.message ||
                    "Entry successful.",
                ticket
            });
        } catch (error) {
            const data = error.response?.data;

            setResult({
                type: "error",
                message:
                    data?.message ||
                    "Invalid or already scanned QR ticket.",
                ticket: data?.ticket || null
            });
        }
    };

    const stopScanner = async () => {
        try {
            if (scannerRef.current?.isScanning) {
                await scannerRef.current.stop();
            }
        } catch (error) {
            console.error(error);
        }

        setScanning(false);
    };

    return (
        <div className="scanner-card">
            <h2 className="scanner-title">
                Scan Entry QR
            </h2>

            <p className="scanner-subtitle">
                Scan the student's event entry QR code.
            </p>

            <div
                id="qr-reader"
                className="scanner-box"
            />

            <div className="scanner-buttons">
                {!scanning ? (
                    <button
                        type="button"
                        className="button primary"
                        onClick={startScanner}
                    >
                        Start Scanner
                    </button>
                ) : (
                    <button
                        type="button"
                        className="button danger"
                        onClick={stopScanner}
                    >
                        Stop Scanner
                    </button>
                )}
            </div>

            {result && (
                <div
                    className={`scan-result ${result.type === "success"
                            ? "success"
                            : "error"
                        }`}
                >
                    <div className="scan-result-title">
                        {result.type === "success"
                            ? "✓ Entry Successful"
                            : "✕ Scan Failed"}
                    </div>

                    <p>
                        {result.message}
                    </p>

                    {result.ticket && (
                        <div className="scan-result-information">
                            <div>
                                <span>Student</span>
                                <strong>
                                    {result.ticket.studentName ||
                                        result.ticket.student?.fullName}
                                </strong>
                            </div>

                            <div>
                                <span>College PID</span>
                                <strong>
                                    {result.ticket.collegePid ||
                                        result.ticket.student?.collegePid}
                                </strong>
                            </div>

                            <div>
                                <span>Event</span>
                                <strong>
                                    {result.ticket.eventName ||
                                        result.ticket.event?.name}
                                </strong>
                            </div>

                            <div>
                                <span>Entry Status</span>
                                <strong>
                                    {result.ticket.entryStatus}
                                </strong>
                            </div>

                            {result.ticket.enteredAt && (
                                <div>
                                    <span>Entered At</span>
                                    <strong>
                                        {new Date(
                                            result.ticket.enteredAt
                                        ).toLocaleString()}
                                    </strong>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}