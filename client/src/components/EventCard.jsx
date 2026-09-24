import {
    Link
} from "react-router-dom";

export default function EventCard({
    event,
    admin = false
}) {
    const participation =
        event.participationType
            ?.team &&
            event.participationType
                ?.individual
            ? "Individual / Team"
            : event.participationType
                ?.team
                ? "Team"
                : "Individual";

    return (
        <article className="card event-card">

            <span className="badge">
                {event.category}
            </span>

            <h3>
                {event.name}
            </h3>

            <p>
                {event.description}
            </p>

            <p>
                <strong>Date:</strong>{" "}
                {new Date(
                    event.date
                ).toLocaleString()}
            </p>

            <p>
                <strong>Location:</strong>{" "}
                {event.location}
            </p>

            <p>
                <strong>
                    Participation:
                </strong>{" "}
                {participation}
            </p>

            <p>
                <strong>Status:</strong>{" "}
                {event.status}
            </p>

            <Link
                className="button"
                to={
                    admin
                        ? `/admin/events/edit/${event._id}`
                        : `/student/events/${event._id}`
                }
            >
                {admin
                    ? "Edit Event"
                    : "View Details"}
            </Link>

        </article>
    );
}