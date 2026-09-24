import {
    useEffect,
    useMemo,
    useState
} from "react";

import api
    from "../../services/api";

import Loading
    from "../../components/Loading";

export default function ManageRegistrations() {

    const [
        registrations,
        setRegistrations
    ] = useState(null);

    const [
        search,
        setSearch
    ] = useState("");

    useEffect(() => {

        api.get(
            "/registrations/admin/all"
        )
            .then(
                ({ data }) =>
                    setRegistrations(
                        data.registrations
                    )
            );

    }, []);

    const filtered =
        useMemo(() => {

            if (!registrations) {
                return [];
            }

            const query =
                search.toLowerCase();

            return registrations.filter(
                (registration) => {

                    return [
                        registration.registrationId,

                        registration.student
                            ?.fullName,

                        registration.student
                            ?.email,

                        registration.student
                            ?.collegeName,

                        registration.event
                            ?.name,

                        registration.participation
                            ?.teamName
                    ].some(
                        (value) =>
                            String(
                                value || ""
                            )
                                .toLowerCase()
                                .includes(query)
                    );
                }
            );

        }, [
            registrations,
            search
        ]);

    if (!registrations) {
        return <Loading />;
    }

    return (
        <main className="container">

            <h1>
                Manage Registrations
            </h1>

            <input
                className="search"
                placeholder="Search registrations..."
                value={search}
                onChange={
                    (e) =>
                        setSearch(
                            e.target.value
                        )
                }
            />

            <div className="table-wrap">

                <table>

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Student</th>
                            <th>College</th>
                            <th>Event</th>
                            <th>Participation</th>
                            <th>Team</th>
                            <th>Members</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filtered.map(
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
                                                .student
                                                ?.fullName
                                        }
                                    </td>

                                    <td>
                                        {
                                            registration
                                                .student
                                                ?.collegeName
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
                                                .participation
                                                .numberOfMembers
                                        }
                                    </td>

                                    <td>
                                        {
                                            registration
                                                .payment
                                                ?.status ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        {
                                            registration
                                                .registrationStatus
                                        }
                                    </td>

                                    <td>
                                        {new Date(
                                            registration.createdAt
                                        ).toLocaleString()}
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