import React, { useEffect, useState } from "react";
import api from "../../services/api";

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    // ========================================
    // LOAD CATEGORIES
    // ========================================

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/categories");

            console.log("CATEGORIES API RESPONSE:", response.data);

            /*
             * Support both:
             *
             * { categories: [...] }
             *
             * and
             *
             * { data: [...] }
             */

            const receivedCategories =
                response.data?.categories ||
                response.data?.data ||
                [];

            if (Array.isArray(receivedCategories)) {
                setCategories(receivedCategories);
            } else {
                setCategories([]);
                setError("Invalid categories data received from server.");
            }

        } catch (err) {
            console.error(
                "FETCH CATEGORIES ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load categories."
            );

            setCategories([]);

        } finally {
            setLoading(false);
        }
    };


    // ========================================
    // ACTIVATE / DEACTIVATE
    // ========================================

    const handleToggleCategory = async (category) => {
        try {

            setUpdatingId(category._id);
            setError("");

            const endpoint =
                category.isActive
                    ? `/categories/${category._id}/deactivate`
                    : `/categories/${category._id}/activate`;

            await api.patch(endpoint);

            /*
             * Update only this category locally.
             * No need to reload the complete page.
             */

            setCategories((previousCategories) =>
                previousCategories.map((item) =>
                    item._id === category._id
                        ? {
                            ...item,
                            isActive: !item.isActive
                        }
                        : item
                )
            );

        } catch (err) {

            console.error(
                "UPDATE CATEGORY ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update category."
            );

        } finally {

            setUpdatingId(null);

        }
    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-content">

                    <h1>Categories</h1>

                    <div className="loading-message">
                        Loading categories...
                    </div>

                </div>
            </div>
        );
    }


    // ========================================
    // PAGE
    // ========================================

    return (
        <div className="admin-page">

            <div className="admin-content">

                <div className="page-header">

                    <div>
                        <h1>Categories</h1>

                        <p>
                            Manage the categories created
                            through your events.
                        </p>
                    </div>

                </div>


                {/* ========================================
                    ERROR
                ======================================== */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                {/* ========================================
                    EMPTY STATE
                ======================================== */}

                {categories.length === 0 && !error && (

                    <div className="empty-state">

                        <h3>
                            No Categories Found
                        </h3>

                        <p>
                            Categories will appear here
                            automatically when you create
                            an event with a category.
                        </p>

                    </div>

                )}


                {/* ========================================
                    CATEGORY LIST
                ======================================== */}

                {categories.length > 0 && (

                    <div className="categories-grid">

                        {categories.map((category) => (

                            <div
                                className="category-card"
                                key={category._id}
                            >

                                <div className="category-card-header">

                                    <h3>
                                        {category.name}
                                    </h3>

                                    <span
                                        className={
                                            category.isActive
                                                ? "category-status active"
                                                : "category-status inactive"
                                        }
                                    >
                                        {category.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>

                                </div>


                                <div className="category-card-body">

                                    <p>
                                        Category created from
                                        an event.
                                    </p>

                                </div>


                                <div className="category-card-footer">

                                    <button
                                        type="button"
                                        className={
                                            category.isActive
                                                ? "button danger-button"
                                                : "button success-button"
                                        }
                                        onClick={() =>
                                            handleToggleCategory(
                                                category
                                            )
                                        }
                                        disabled={
                                            updatingId ===
                                            category._id
                                        }
                                    >

                                        {updatingId ===
                                            category._id
                                            ? "Updating..."
                                            : category.isActive
                                                ? "Deactivate"
                                                : "Activate"}

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default ManageCategories;