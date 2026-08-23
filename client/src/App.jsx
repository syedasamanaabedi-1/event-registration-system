import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventListing from "./pages/EventListing";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import EventRegistrations from "./pages/EventRegistrations";
import PendingApprovals from "./pages/PendingApprovals";
import AdminDashboard from "./pages/AdminDashboard";
import UsersList from "./pages/UsersList";
import OrganizerDashboard from "./pages/OrganizerDashboard";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<EventListing />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={["attendee"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/create-event"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <MyEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:id/registrations"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <EventRegistrations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PendingApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
