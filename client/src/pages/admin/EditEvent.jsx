import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        date: "",
        location: "",
        registrationStartDate: "",
        registrationEndDate: "",

        participationType: {
            individual: true,
            team: false
        },

        teamSettings: {
            minMembers: 2,
            maxMembers: 5
        },

        fee: 0,
        status: "Draft"
    });


    // ========================================
    // LOAD EVENT
    // ========================================

    useEffect(() => {
        fetchEvent();
    }, [id]);


    const fetchEvent = async () => {
        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(`/events/${id}`);

            const event =
                response.data.event;

            if (!event) {
                setError("Event not found.");
                return;
            }


            setFormData({

                name:
                    event.name || "",

                description:
                    event.description || "",

                category:
                    event.category || "",

                date:
                    formatDateTimeLocal(event.date),

                location:
                    event.location || "",

                registrationStartDate:
                    formatDateTimeLocal(
                        event.registrationStartDate
                    ),

                registrationEndDate:
                    formatDateTimeLocal(
                        event.registrationEndDate
                    ),

                participationType: {

                    individual:
                        event.participationType
                            ?.individual ?? true,

                    team:
                        event.participationType
                            ?.team ?? false

                },

                teamSettings: {

                    minMembers:
                        event.teamSettings
                            ?.minMembers ?? 2,

                    maxMembers:
                        event.teamSettings
                            ?.maxMembers ?? 5

                },

                fee:
                    event.fee ?? 0,

                status:
                    event.status || "Draft"

            });

        } catch (err) {

            console.error(
                "FETCH EVENT ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load event."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================
    // FORMAT DATE FOR DATETIME-LOCAL
    // ========================================

    const formatDateTimeLocal = (value) => {

        if (!value) {
            return "";
        }

        const date =
            new Date(value);

        if (isNaN(date.getTime())) {
            return "";
        }

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        const hours =
            String(
                date.getHours()
            ).padStart(2, "0");

        const minutes =
            String(
                date.getMinutes()
            ).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    // ========================================
    // HANDLE NORMAL INPUT
    // ========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((previous) => ({

            ...previous,

            [name]:
                value

        }));

    };


    // ========================================
    // HANDLE PARTICIPATION TYPE
    // ========================================

    const handleParticipationChange = (
        type
    ) => {

        setFormData((previous) => ({

            ...previous,

            participationType: {

                ...previous.participationType,

                [type]:
                    !previous
                        .participationType[type]

            }

        }));

    };


    // ========================================
    // HANDLE TEAM SETTINGS
    // ========================================

    const handleTeamSettingChange = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;

        setFormData((previous) => ({

            ...previous,

            teamSettings: {

                ...previous.teamSettings,

                [name]:
                    value

            }

        }));

    };


    // ========================================
    // SUBMIT FORM
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (
            !formData.name.trim() ||
            !formData.description.trim() ||
            !formData.category.trim() ||
            !formData.location.trim()
        ) {

            setError(
                "Please fill all required fields."
            );

            return;
        }


        if (
            !formData.participationType
                .individual &&
            !formData.participationType
                .team
        ) {

            setError(
                "Please select Individual, Team, or both."
            );

            return;
        }


        if (
            formData.participationType.team
        ) {

            const min =
                Number(
                    formData.teamSettings
                        .minMembers
                );

            const max =
                Number(
                    formData.teamSettings
                        .maxMembers
                );


            if (
                min < 2 ||
                max < min
            ) {

                setError(
                    "Please enter valid team member limits."
                );

                return;
            }

        }


        try {

            setSaving(true);


            // ========================================
            // UPDATE EVENT
            // ========================================

            const payload = {

                name:
                    formData.name.trim(),

                description:
                    formData.description.trim(),

                /*
                 * IMPORTANT:
                 *
                 * Category is now a TEXT value.
                 * No hard-coded dropdown values.
                 */

                category:
                    formData.category.trim(),

                date:
                    formData.date,

                location:
                    formData.location.trim(),

                registrationStartDate:
                    formData.registrationStartDate,

                registrationEndDate:
                    formData.registrationEndDate,

                participationType: {

                    individual:
                        Boolean(
                            formData
                                .participationType
                                .individual
                        ),

                    team:
                        Boolean(
                            formData
                                .participationType
                                .team
                        )

                },

                teamSettings: {

                    minMembers:
                        Number(
                            formData
                                .teamSettings
                                .minMembers
                        ) || 2,

                    maxMembers:
                        Number(
                            formData
                                .teamSettings
                                .maxMembers
                        ) || 5

                },

                fee:
                    Number(
                        formData.fee
                    ) || 0,

                status:
                    formData.status

            };


            const response =
                await api.put(
                    `/events/${id}`,
                    payload
                );


            console.log(
                "EVENT UPDATED:",
                response.data
            );


            setSuccess(
                "Event updated successfully."
            );


            /*
             * Wait a little so the admin can see
             * the success message.
             */

            setTimeout(() => {

                navigate(
                    "/admin/events"
                );

            }, 1000);


        } catch (err) {

            console.error(
                "UPDATE EVENT ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update event."
            );

        } finally {

            setSaving(false);

        }

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <div className="admin-page">

                <div className="form-card">

                    <h2>
                        Loading Event...
                    </h2>

                </div>

            </div>
        );

    }


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="admin-page">

            <div className="form-card">

                <h1>
                    Edit Event
                </h1>


                {/* ========================================
                    ERROR MESSAGE
                ======================================== */}

                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                {/* ========================================
                    SUCCESS MESSAGE
                ======================================== */}

                {success && (

                    <div className="success-message">
                        {success}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                >


                    {/* ========================================
                        EVENT NAME
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Event Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter event name"
                            required
                        />

                    </div>


                    {/* ========================================
                        DESCRIPTION
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter event description"
                            rows="5"
                            required
                        />

                    </div>


                    {/* ========================================
                        CATEGORY
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={
                                formData.category
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter event category"
                            required
                        />

                        <small>
                            You can enter any category.
                        </small>

                    </div>


                    {/* ========================================
                        LOCATION
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={
                                formData.location
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter event location"
                            required
                        />

                    </div>


                    {/* ========================================
                        EVENT DATE
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Event Date
                        </label>

                        <input
                            type="datetime-local"
                            name="date"
                            value={
                                formData.date
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    {/* ========================================
                        REGISTRATION START
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Registration Start
                        </label>

                        <input
                            type="datetime-local"
                            name="registrationStartDate"
                            value={
                                formData
                                    .registrationStartDate
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    {/* ========================================
                        REGISTRATION END
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Registration End
                        </label>

                        <input
                            type="datetime-local"
                            name="registrationEndDate"
                            value={
                                formData
                                    .registrationEndDate
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    {/* ========================================
                        PARTICIPATION TYPE
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Participation Type
                        </label>


                        <div className="checkbox-group">

                            <label>

                                <input
                                    type="checkbox"
                                    checked={
                                        formData
                                            .participationType
                                            .individual
                                    }
                                    onChange={() =>
                                        handleParticipationChange(
                                            "individual"
                                        )
                                    }
                                />

                                Individual

                            </label>


                            <label>

                                <input
                                    type="checkbox"
                                    checked={
                                        formData
                                            .participationType
                                            .team
                                    }
                                    onChange={() =>
                                        handleParticipationChange(
                                            "team"
                                        )
                                    }
                                />

                                Team

                            </label>

                        </div>

                    </div>


                    {/* ========================================
                        TEAM SETTINGS
                    ======================================== */}

                    {formData
                        .participationType
                        .team && (

                            <div className="team-settings">

                                <h3>
                                    Team Settings
                                </h3>


                                <div className="form-group">

                                    <label>
                                        Minimum Team Members
                                    </label>

                                    <input
                                        type="number"
                                        name="minMembers"
                                        min="2"
                                        value={
                                            formData
                                                .teamSettings
                                                .minMembers
                                        }
                                        onChange={
                                            handleTeamSettingChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Maximum Team Members
                                    </label>

                                    <input
                                        type="number"
                                        name="maxMembers"
                                        min="2"
                                        value={
                                            formData
                                                .teamSettings
                                                .maxMembers
                                        }
                                        onChange={
                                            handleTeamSettingChange
                                        }
                                    />

                                </div>

                            </div>

                        )}


                    {/* ========================================
                        EVENT FEE
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Event Fee (₹)
                        </label>

                        <input
                            type="number"
                            name="fee"
                            min="0"
                            value={
                                formData.fee
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="0"
                        />

                    </div>


                    {/* ========================================
                        EVENT STATUS
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Event Status
                        </label>

                        <select
                            name="status"
                            value={
                                formData.status
                            }
                            onChange={
                                handleChange
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

                    </div>


                    {/* ========================================
                        BUTTONS
                    ======================================== */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="button secondary-button"
                            onClick={() =>
                                navigate(
                                    "/admin/events"
                                )
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="button primary-button"
                            disabled={saving}
                        >

                            {saving
                                ? "Updating..."
                                : "Update Event"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default EditEvent;