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

export default function MyRegistrations() {

    const [
        registrations,
        setRegistrations
    ] = useState(null);

    useEffect(() => {

        api.get(
            "/registrations/my"
        )
            .then(
                ({ data }) =>
                    setRegistrations(
                        data.registrations
                    )
            );

    }, []);

    if (!registrations) {
        return <Loading />;
    }

    return (
        <main className="container">

            <h1>
                My Registrations
            </h1>

            <div className="table-wrap">

                <table>

                    <thead>

                        <tr>
                            <th>
                                Registration ID
                            </th>

                            <th>
                                Event
                            </th>

                            <th>
                                Category
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Participation
                            </th>

                            <th>
                                Team
                            </th>

                            <th>
                                Payment
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Details
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        {registrations.map(
                            (registration) => (

                                <tr
                                    key={
                                        registration._id
                                    }
                                >

                                    <td>
                                        {
                                            registration
                                                .registrationId
                                        }
                                    </td>

                                    <td>
                                        {
                                            registration
                                                .event
                                                ?.name
                                        }
                                    </td>

                                    <td>
                                        {
                                            registration
                                                .event
                                                ?.category
                                        }
                                    </td>

                                    <td>
                                        {
                                            registration.event
                                                ? new Date(
                                                    registration
                                                        .event
                                                        .date
                                                ).toLocaleDateString()
                                                : "-"
                                        }
                                    </td>

                                    <td>
                                        {
                                            registration
                                                .participation
                                                .type
                                        }
                                    </td>

                                    <td>
                                        {
                                            registration
                                                .participation
                                                .teamName ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        {
                                            registration
                                                .payment
                                                ?.status ||
                                            "Pending"
                                        }
                                    </td>

                                    <td>
                                        {
                                            registration
                                                .registrationStatus
                                        }
                                    </td>

                                    <td>
                                        <Link
                                            to={`/student/registrations/${registration._id}`}
                                        >
                                            View
                                        </Link>
                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </main>
    );
}