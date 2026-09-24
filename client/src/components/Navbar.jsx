import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

export default function Navbar() {
    const {
        user,
        logout
    } = useAuth();

    const navigate =
        useNavigate();

    const signOut = () => {
        logout();

        navigate(
            "/login"
        );
    };

    return (
        <header className="navbar">

            <Link
                className="brand"
                to={
                    user?.role ===
                        "admin"
                        ? "/admin"
                        : "/student"
                }
            >
                CampusEvents
            </Link>

            {user && (
                <nav>

                    {user.role ===
                        "student" ? (
                        <>
                            <Link to="/student">
                                Dashboard
                            </Link>

                            <Link to="/student/events">
                                Events
                            </Link>

                            <Link to="/student/registrations">
                                My Registrations
                            </Link>

                            <Link to="/student/profile">
                                Profile
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/admin">
                                Dashboard
                            </Link>

                            <Link to="/admin/events">
                                Events
                            </Link>

                            <Link to="/admin/categories">
                                Categories
                            </Link>

                            <Link to="/admin/registrations">
                                Registrations
                            </Link>

                            <Link to="/admin/students">
                                Students
                            </Link>

                            <Link to="/admin/payments">
                                Payments
                            </Link>
                        </>
                    )}

                    <button
                        className="link-button"
                        onClick={signOut}
                    >
                        Logout
                    </button>

                </nav>
            )}

        </header>
    );
}