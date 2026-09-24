import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import api
    from "../../services/api";

import Loading
    from "../../components/Loading";

export default function StudentDetails() {

    const {
        id
    } = useParams();

    const [
        data,
        setData
    ] = useState(null);

    useEffect(() => {

        api.get(
            `/admin/students/${id}`
        )
            .then(
                ({ data }) =>
                    setData(data)
            );

    }, [id]);

    if (!data) {
        return <Loading />;
    }

    return (
        <main className="container narrow">

            <div className="card">

                <h1>
                    Student Details
                </h1>

                <p>
                    <strong>
                        Name:
                    </strong>{" "}
                    {data.student.fullName}
                </p>

                <p>
                    <strong>
                        Email:
                    </strong>{" "}
                    {data.student.email}
                </p>

                <p>
                    <strong>
                        Mobile:
                    </strong>{" "}
                    {data.student.mobileNumber}
                </p>

                <p>
                    <strong>
                        College:
                    </strong>{" "}
                    {data.student.collegeName}
                </p>

                <p>
                    <strong>
                        Year/Semester:
                    </strong>{" "}
                    {data.student.yearSemester}
                </p>

                <p>
                    <strong>
                        Email Verified:
                    </strong>{" "}
                    {
                        data.student
                            .isEmailVerified
                            ? "Yes"
                            : "No"
                    }
                </p>

                <h2>
                    Registrations
                </h2>

                {data.registrations.map(
                    (registration) => (

                        <p
                            key={
                                registration._id
                            }
                        >
                            {
                                registration
                                    .event
                                    ?.name
                            }{" "}
                            —
                            {
                                registration
                                    .registrationStatus
                            }
                        </p>

                    )
                )}

            </div>

        </main>
    );
}