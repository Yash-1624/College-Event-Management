import {
    useEffect,
    useState
} from "react";

import api
    from "../../services/api";

import Loading
    from "../../components/Loading";

export default function ManagePayments() {

    const [
        payments,
        setPayments
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

        const loadPayments =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const {
                        data
                    } = await api.get(
                        "/admin/payments"
                    );

                    setPayments(
                        data.payments || []
                    );

                } catch (error) {

                    console.error(
                        "Failed to load payments:",
                        error
                    );

                    setError(
                        error.response?.data?.message ||
                        "Failed to load payments."
                    );

                } finally {

                    setLoading(false);

                }
            };

        loadPayments();

    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="container">

            <div className="page-heading">

                <div>

                    <h1>
                        Manage Payments
                    </h1>

                    <p className="hint">
                        View all student payment
                        transactions.
                    </p>

                </div>

            </div>

            {error && (
                <div className="alert error">
                    {error}
                </div>
            )}

            {!error &&
                payments.length === 0 && (
                    <div className="empty">

                        <h3>
                            No payments found
                        </h3>

                        <p className="hint">
                            There are no payment
                            transactions yet.
                        </p>

                    </div>
                )}

            {payments.length > 0 && (

                <div className="table-wrap">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Transaction ID
                                </th>

                                <th>
                                    Registration ID
                                </th>

                                <th>
                                    Student
                                </th>

                                <th>
                                    Event
                                </th>

                                <th>
                                    Amount
                                </th>

                                <th>
                                    Method
                                </th>

                                <th>
                                    Gateway
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Date
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {payments.map(
                                (payment) => (

                                    <tr
                                        key={
                                            payment._id
                                        }
                                    >

                                        <td>
                                            {
                                                payment.transactionId ||
                                                "—"
                                            }
                                        </td>

                                        <td>
                                            {
                                                payment
                                                    .registration
                                                    ?.registrationId ||
                                                "—"
                                            }
                                        </td>

                                        <td>
                                            {
                                                payment
                                                    .student
                                                    ?.fullName ||
                                                "—"
                                            }
                                        </td>

                                        <td>
                                            {
                                                payment
                                                    .event
                                                    ?.name ||
                                                "—"
                                            }
                                        </td>

                                        <td>
                                            ₹
                                            {
                                                payment.amount
                                            }
                                        </td>

                                        <td>
                                            {
                                                payment.paymentMethod ||
                                                "—"
                                            }
                                        </td>

                                        <td>
                                            {
                                                payment.gateway ||
                                                "—"
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={`badge ${payment.status ===
                                                        "Successful"
                                                        ? "success"
                                                        : payment.status ===
                                                            "Failed"
                                                            ? "danger"
                                                            : "warning"
                                                    }`}
                                            >
                                                {
                                                    payment.status
                                                }
                                            </span>

                                        </td>

                                        <td>
                                            {
                                                payment.createdAt
                                                    ? new Date(
                                                        payment.createdAt
                                                    ).toLocaleString()
                                                    : "—"
                                            }
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </main>
    );
}