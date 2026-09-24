import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const initialForm = {
    name: "",
    description: "",
    category: "",
    date: "",
    location: "",
    registrationStartDate: "",
    registrationEndDate: "",
    individual: true,
    team: false,
    minMembers: 2,
    maxMembers: 5,
    status: "Draft",
    fee: 0
};

export default function AddEvent() {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    // ==========================================
    // UPDATE FORM
    // ==========================================

    const update = (field, value) => {
        setForm((previous) => ({
            ...previous,
            [field]: value
        }));
    };

    // ==========================================
    // SUBMIT EVENT
    // ==========================================

    const submit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ------------------------------------------
        // Validation
        // ------------------------------------------

        if (!form.name.trim()) {
            setError("Event name is required.");
            return;
        }

        if (!form.description.trim()) {
            setError("Event description is required.");
            return;
        }

        if (!form.category.trim()) {
            setError("Event category is required.");
            return;
        }

        if (!form.date) {
            setError("Event date is required.");
            return;
        }

        if (!form.location.trim()) {
            setError("Event location is required.");
            return;
        }

        if (!form.registrationStartDate) {
            setError("Registration start date is required.");
            return;
        }

        if (!form.registrationEndDate) {
            setError("Registration end date is required.");
            return;
        }

        if (!form.individual && !form.team) {
            setError(
                "Enable Individual, Team, or both participation types."
            );
            return;
        }

        // ------------------------------------------
        // Team validation
        // ------------------------------------------

        if (form.team) {
            const minMembers = Number(form.minMembers);
            const maxMembers = Number(form.maxMembers);

            if (minMembers < 2) {
                setError(
                    "Minimum team members must be at least 2."
                );
                return;
            }

            if (maxMembers < minMembers) {
                setError(
                    "Maximum team members must be greater than or equal to minimum team members."
                );
                return;
            }
        }

        // ------------------------------------------
        // Date validation
        // ------------------------------------------

        const eventDate = new Date(form.date);
        const startDate = new Date(
            form.registrationStartDate
        );
        const endDate = new Date(
            form.registrationEndDate
        );

        if (startDate >= endDate) {
            setError(
                "Registration end date must be after registration start date."
            );
            return;
        }

        setSubmitting(true);

        try {
            // ========================================
            // CREATE EVENT
            // ========================================

            const response = await api.post("/events", {
                name: form.name.trim(),

                description: form.description.trim(),

                // IMPORTANT:
                // Category is now entered manually.
                category: form.category.trim(),

                date: form.date,

                location: form.location.trim(),

                registrationStartDate:
                    form.registrationStartDate,

                registrationEndDate:
                    form.registrationEndDate,

                participationType: {
                    individual: form.individual,
                    team: form.team
                },

                teamSettings: {
                    enabled: form.team,

                    minMembers: form.team
                        ? Number(form.minMembers)
                        : 2,

                    maxMembers: form.team
                        ? Number(form.maxMembers)
                        : 5
                },

                status: form.status,

                fee: Number(form.fee) || 0
            });

            console.log(
                "Event created:",
                response.data
            );

            setSuccess(
                "Event created successfully."
            );

            // ------------------------------------------
            // Redirect to Manage Events
            // ------------------------------------------

            setTimeout(() => {
                navigate("/admin/events");
            }, 700);

        } catch (err) {

            console.error(
                "Create event error:",
                err
            );

            console.error(
                "Server response:",
                err.response?.data
            );

            setError(
                err.response?.data?.message ||
                "Failed to create event."
            );

        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // UI
    // ==========================================

    return (
        <main className="container narrow">

            <form
                className="form-card"
                onSubmit={submit}
            >

                <h1>Add Event</h1>

                {/* ==================================
            ERROR MESSAGE
        ================================== */}

                {error && (
                    <div className="alert error">
                        {error}
                    </div>
                )}

                {/* ==================================
            SUCCESS MESSAGE
        ================================== */}

                {success && (
                    <div className="alert success">
                        {success}
                    </div>
                )}

                {/* ==================================
            EVENT NAME
        ================================== */}

                <label>
                    Event Name

                    <input
                        type="text"
                        required
                        placeholder="Enter event name"
                        value={form.name}
                        onChange={(e) =>
                            update(
                                "name",
                                e.target.value
                            )
                        }
                    />
                </label>

                {/* ==================================
            DESCRIPTION
        ================================== */}

                <label>
                    Event Description

                    <textarea
                        required
                        placeholder="Enter event description"
                        value={form.description}
                        onChange={(e) =>
                            update(
                                "description",
                                e.target.value
                            )
                        }
                    />
                </label>

                {/* ==================================
            CATEGORY
        ================================== */}

                <label>
                    Event Category

                    <input
                        type="text"
                        name="category"
                        placeholder="Example: Technical, Cultural, Sports, Hackathon, Robotics, Gaming"
                        value={form.category}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                category: e.target.value
                            })
                        }
                        required
                    />

                    <small className="category-input-help">
                        Enter your own category. If it does not already
                        exist, it will automatically be added to the
                        Categories section and MongoDB.
                    </small>
                </label>

                {/* ==================================
            EVENT DATE
        ================================== */}

                <label>
                    Event Date

                    <input
                        type="datetime-local"
                        required
                        value={form.date}
                        onChange={(e) =>
                            update(
                                "date",
                                e.target.value
                            )
                        }
                    />
                </label>

                {/* ==================================
            LOCATION
        ================================== */}

                <label>
                    Event Location

                    <input
                        type="text"
                        required
                        placeholder="Enter event location"
                        value={form.location}
                        onChange={(e) =>
                            update(
                                "location",
                                e.target.value
                            )
                        }
                    />
                </label>

                {/* ==================================
            REGISTRATION START
        ================================== */}

                <label>
                    Registration Start Date

                    <input
                        type="datetime-local"
                        required
                        value={
                            form.registrationStartDate
                        }
                        onChange={(e) =>
                            update(
                                "registrationStartDate",
                                e.target.value
                            )
                        }
                    />
                </label>

                {/* ==================================
            REGISTRATION END
        ================================== */}

                <label>
                    Registration End Date

                    <input
                        type="datetime-local"
                        required
                        value={
                            form.registrationEndDate
                        }
                        onChange={(e) =>
                            update(
                                "registrationEndDate",
                                e.target.value
                            )
                        }
                    />
                </label>

                {/* ==================================
            PARTICIPATION TYPE
        ================================== */}

                <div className="form-group">

                    <label>
                        Participation Type
                    </label>

                    <div className="radio-row">

                        <label>
                            <input
                                type="checkbox"
                                checked={form.individual}
                                onChange={(e) =>
                                    update(
                                        "individual",
                                        e.target.checked
                                    )
                                }
                            />

                            Individual
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={form.team}
                                onChange={(e) =>
                                    update(
                                        "team",
                                        e.target.checked
                                    )
                                }
                            />

                            Team
                        </label>

                    </div>

                </div>

                {/* ==================================
            TEAM SETTINGS
        ================================== */}

                {form.team && (
                    <div className="team-settings">

                        <h2>
                            Team Settings
                        </h2>

                        <label>
                            Minimum Team Members

                            <input
                                type="number"
                                min="2"
                                value={form.minMembers}
                                onChange={(e) =>
                                    update(
                                        "minMembers",
                                        e.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Maximum Team Members

                            <input
                                type="number"
                                min="2"
                                value={form.maxMembers}
                                onChange={(e) =>
                                    update(
                                        "maxMembers",
                                        e.target.value
                                    )
                                }
                            />
                        </label>

                    </div>
                )}

                {/* ==================================
            EVENT STATUS
        ================================== */}

                <label>
                    Event Status

                    <select
                        value={form.status}
                        onChange={(e) =>
                            update(
                                "status",
                                e.target.value
                            )
                        }
                    >

                        <option value="Draft">
                            Draft
                        </option>

                        <option value="Published">
                            Published
                        </option>

                        <option value="Registration Open">
                            Registration Open
                        </option>

                        <option value="Registration Closed">
                            Registration Closed
                        </option>

                        <option value="Completed">
                            Completed
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>

                    </select>
                </label>

                {/* ==================================
            EVENT FEE
        ================================== */}

                <label>
                    Event Fee (₹)

                    <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={form.fee}
                        onChange={(e) =>
                            update(
                                "fee",
                                e.target.value
                            )
                        }
                    />

                    <small className="hint">
                        Enter 0 for a free event.
                    </small>
                </label>

                {/* ==================================
            SUBMIT
        ================================== */}

                <button
                    type="submit"
                    className="button primary"
                    disabled={submitting}
                >

                    {submitting
                        ? "Creating Event..."
                        : "Create Event"}

                </button>

            </form>

        </main>
    );
}