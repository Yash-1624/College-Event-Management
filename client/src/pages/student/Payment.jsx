import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../../services/api";

import Loading from "../../components/Loading";


export default function Payment() {

    const {
        registrationId
    } = useParams();

    const navigate =
        useNavigate();


    const [
        data,
        setData
    ] = useState(null);


    const [
        processing,
        setProcessing
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    // ========================================
    // LOAD RAZORPAY ORDER
    // ========================================

    useEffect(() => {

        const createOrder =
            async () => {

                try {

                    const {
                        data
                    } =
                        await api.post(
                            "/payments/create",
                            {
                                registrationId
                            }
                        );


                    setData(data);


                    // Free event
                    if (
                        data.freeEvent
                    ) {

                        navigate(
                            `/student/registration-success/${registrationId}`
                        );

                    }

                } catch (err) {

                    console.error(
                        "Payment order error:",
                        err
                    );


                    setError(
                        err.response?.data?.message ||
                        "Could not create payment."
                    );

                }

            };


        createOrder();

    }, [
        registrationId,
        navigate
    ]);


    // ========================================
    // LOAD RAZORPAY CHECKOUT SCRIPT
    // ========================================

    const loadRazorpay =
        () => {

            return new Promise(
                (resolve) => {

                    if (
                        window.Razorpay
                    ) {

                        resolve(true);

                        return;

                    }


                    const script =
                        document.createElement(
                            "script"
                        );


                    script.src =
                        "https://checkout.razorpay.com/v1/checkout.js";


                    script.onload =
                        () => {

                            resolve(true);

                        };


                    script.onerror =
                        () => {

                            resolve(false);

                        };


                    document.body.appendChild(
                        script
                    );

                }
            );

        };


    // ========================================
    // OPEN RAZORPAY CHECKOUT
    // ========================================

    const payNow =
        async () => {

            try {

                setProcessing(true);

                setError("");


                const loaded =
                    await loadRazorpay();


                if (!loaded) {

                    throw new Error(
                        "Razorpay Checkout could not be loaded."
                    );

                }


                if (
                    !data?.razorpay
                ) {

                    throw new Error(
                        "Razorpay order information is missing."
                    );

                }


                const options = {

                    key:
                        data.razorpay.keyId,

                    amount:
                        data.razorpay.amount,

                    currency:
                        data.razorpay.currency,

                    name:
                        "CampusEvents",

                    description:
                        `Event Registration - ${data.registration.event.name}`,

                    order_id:
                        data.razorpay.orderId,


                    prefill: {

                        name:
                            data.registration
                                .studentInformation
                                .fullName,

                        email:
                            data.registration
                                .contactInformation
                                .email

                    },


                    notes: {

                        registrationId:
                            registrationId

                    },


                    theme: {

                        color:
                            "#172033"

                    },


                    handler:
                        async (
                            response
                        ) => {

                            try {

                                setProcessing(
                                    true
                                );


                                const result =
                                    await api.post(
                                        "/payments/verify",
                                        {

                                            registrationId,

                                            razorpay_order_id:
                                                response
                                                    .razorpay_order_id,

                                            razorpay_payment_id:
                                                response
                                                    .razorpay_payment_id,

                                            razorpay_signature:
                                                response
                                                    .razorpay_signature

                                        }
                                    );


                                if (
                                    result.data.success
                                ) {

                                    navigate(
                                        `/student/registration-success/${registrationId}`
                                    );

                                }


                            } catch (
                            verificationError
                            ) {

                                console.error(
                                    "Payment verification error:",
                                    verificationError
                                );


                                setError(
                                    verificationError
                                        .response
                                        ?.data
                                        ?.message ||
                                    "Payment verification failed."
                                );

                                setProcessing(
                                    false
                                );

                            }

                        },


                    modal: {

                        ondismiss:
                            () => {

                                setProcessing(
                                    false
                                );

                            }

                    }

                };


                const razorpay =
                    new window.Razorpay(
                        options
                    );


                razorpay.on(
                    "payment.failed",
                    (response) => {

                        console.error(
                            "Razorpay payment failed:",
                            response
                        );


                        setError(
                            response.error?.description ||
                            "Payment failed."
                        );


                        setProcessing(
                            false
                        );

                    }
                );


                razorpay.open();


            } catch (err) {

                console.error(
                    "Razorpay error:",
                    err
                );


                setError(
                    err.message ||
                    "Unable to open Razorpay."
                );


                setProcessing(
                    false
                );

            }

        };


    // ========================================
    // ERROR
    // ========================================

    if (error && !data) {

        return (

            <main className="container narrow">

                <div className="alert error">

                    {error}

                </div>

            </main>

        );

    }


    // ========================================
    // LOADING
    // ========================================

    if (!data) {

        return <Loading />;

    }


    // ========================================
    // PAYMENT PAGE
    // ========================================

    return (

        <main className="container narrow">

            <div className="form-card">

                <div className="test-banner">

                    Razorpay Test Mode

                </div>


                <h1>
                    Event Payment
                </h1>


                <p>
                    <strong>
                        Event:
                    </strong>{" "}

                    {
                        data.registration
                            .event
                            .name
                    }
                </p>


                <p>
                    <strong>
                        Student:
                    </strong>{" "}

                    {
                        data.registration
                            .studentInformation
                            .fullName
                    }
                </p>


                <p>
                    <strong>
                        Registration ID:
                    </strong>{" "}

                    {
                        data.registration
                            .registrationId
                    }
                </p>


                <p className="amount">

                    ₹
                    {
                        data.payment.amount
                    }

                </p>


                {error && (

                    <div className="alert error">
                        {error}
                    </div>

                )}


                <button
                    type="button"
                    className="button primary"
                    disabled={processing}
                    onClick={payNow}
                >

                    {processing
                        ? "Processing..."
                        : "Pay with Razorpay"}

                </button>


                <p className="hint">

                    Razorpay Checkout supports
                    available payment methods such
                    as UPI. On supported desktop
                    checkout flows, the customer can
                    scan the displayed QR using a
                    UPI app.

                </p>

            </div>

        </main>

    );

}