import {
    useEffect,
    useState
} from "react";

import api
    from "../../services/api";

import Loading
    from "../../components/Loading";

export default function ManageStudents() {

    const [
        students,
        setStudents
    ] = useState(null);

    const [
        search,
        setSearch
    ] = useState("");

    useEffect(() => {

        api.get(
            "/admin/students"
        )
            .then(
                ({ data }) =>
                    setStudents(
                        data.students
                    )
            );

    }, []);

    if (!students) {
        return <Loading />;
    }

    const filtered =
        students.filter(
            (student) =>
                [
                    student.fullName,
                    student.email,
                    student.collegeName,
                    student.yearSemester,
                    student.mobileNumber
                ].some(
                    (value) =>
                        String(
                            value || ""
                        )
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            )
                )
        );

    return (
        <main className="container">

            <h1>
                Manage Students
            </h1>

            <input
                className="search"
                placeholder="Search students..."
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
                            <th>
                                Name
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Mobile
                            </th>

                            <th>
                                College
                            </th>

                            <th>
                                Year/Semester
                            </th>

                            <th>
                                Email Status
                            </th>

                            <th>
                                Created
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        {filtered.map(
                            (student) => (

                                <tr
                                    key={
                                        student._id
                                    }
                                >

                                    <td>
                                        {
                                            student.fullName
                                        }
                                    </td>

                                    <td>
                                        {
                                            student.email
                                        }
                                    </td>

                                    <td>
                                        {
                                            student.mobileNumber
                                        }
                                    </td>

                                    <td>
                                        {
                                            student.collegeName
                                        }
                                    </td>

                                    <td>
                                        {
                                            student.yearSemester
                                        }
                                    </td>

                                    <td>
                                        {
                                            student.isEmailVerified
                                                ? "Verified"
                                                : "Not Verified"
                                        }
                                    </td>

                                    <td>
                                        {new Date(
                                            student.createdAt
                                        ).toLocaleDateString()}
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