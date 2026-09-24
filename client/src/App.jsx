import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import Navbar
  from "./components/Navbar";

import ProtectedRoute
  from "./components/ProtectedRoute";

import AdminRoute
  from "./components/AdminRoute";


import Login
  from "./pages/Login";

import Signup
  from "./pages/Signup";

import VerifyEmail
  from "./pages/VerifyEmail";

import ForgotPassword
  from "./pages/ForgotPassword";

import ResetPassword
  from "./pages/ResetPassword";


import StudentDashboard
  from "./pages/student/StudentDashboard";

import Events
  from "./pages/student/Events";

import EventDetails
  from "./pages/student/EventDetails";

import EventRegistration
  from "./pages/student/EventRegistration";

import Payment
  from "./pages/student/Payment";

import RegistrationSuccess
  from "./pages/student/RegistrationSuccess";

import MyRegistrations
  from "./pages/student/MyRegistrations";

import RegistrationDetails
  from "./pages/student/RegistrationDetails";

import Profile
  from "./pages/student/Profile";


import AdminDashboard
  from "./pages/admin/AdminDashboard";

import ManageEvents
  from "./pages/admin/ManageEvents";

import AddEvent
  from "./pages/admin/AddEvent";

import EditEvent
  from "./pages/admin/EditEvent";

import ManageCategories
  from "./pages/admin/ManageCategories";

import ManageRegistrations
  from "./pages/admin/ManageRegistrations";

import AdminRegistrationDetails
  from "./pages/admin/RegistrationDetails";

import ManageStudents
  from "./pages/admin/ManageStudents";

import StudentDetails
  from "./pages/admin/StudentDetails";

import ManagePayments
  from "./pages/admin/ManagePayments";


export default function App() {

  return (

    <>

      <Navbar />

      <Routes>

        {/* ------------------------------------------------ */}
        {/* PUBLIC */}
        {/* ------------------------------------------------ */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        <Route
          path="/signup"
          element={
            <Signup />
          }
        />

        <Route
          path="/verify-email"
          element={
            <VerifyEmail />
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPassword />
          }
        />


        {/* ------------------------------------------------ */}
        {/* STUDENT */}
        {/* ------------------------------------------------ */}

        <Route
          element={
            <ProtectedRoute />
          }
        >

          <Route
            path="/student"
            element={
              <StudentDashboard />
            }
          />

          <Route
            path="/student/events"
            element={
              <Events />
            }
          />

          <Route
            path="/student/events/:id"
            element={
              <EventDetails />
            }
          />

          <Route
            path="/student/events/:id/register"
            element={
              <EventRegistration />
            }
          />

          <Route
            path="/student/payment/:registrationId"
            element={
              <Payment />
            }
          />

          <Route
            path="/student/registration-success/:id"
            element={
              <RegistrationSuccess />
            }
          />

          <Route
            path="/student/registrations"
            element={
              <MyRegistrations />
            }
          />

          <Route
            path="/student/registrations/:id"
            element={
              <RegistrationDetails />
            }
          />

          <Route
            path="/student/profile"
            element={
              <Profile />
            }
          />

        </Route>


        {/* ------------------------------------------------ */}
        {/* ADMIN */}
        {/* ------------------------------------------------ */}

        <Route
          element={
            <AdminRoute />
          }
        >

          <Route
            path="/admin"
            element={
              <AdminDashboard />
            }
          />

          <Route
            path="/admin/events"
            element={
              <ManageEvents />
            }
          />

          <Route
            path="/admin/events/add"
            element={
              <AddEvent />
            }
          />

          <Route
            path="/admin/events/edit/:id"
            element={
              <EditEvent />
            }
          />

          <Route
            path="/admin/registrations"
            element={
              <ManageRegistrations />
            }
          />

          <Route
            path="/admin/registrations/:id"
            element={
              <AdminRegistrationDetails />
            }
          />

          <Route
            path="/admin/students"
            element={
              <ManageStudents />
            }
          />

          <Route
            path="/admin/students/:id"
            element={
              <StudentDetails />
            }
          />

          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <ManageCategories />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ManagePayments />
            }
          />

        </Route>


        {/* ------------------------------------------------ */}
        {/* FALLBACK */}
        {/* ------------------------------------------------ */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </>

  );

}