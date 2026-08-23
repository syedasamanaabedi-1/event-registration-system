import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        padding: "15px",
      }}
    >
      <div>
        <Link to="/" style={{ marginRight: "15px" }}>
          Home
        </Link>

        {user?.role === "attendee" && (
          <Link to="/my-bookings" style={{ marginRight: "15px" }}>
            My Bookings
          </Link>
        )}

        {user?.role === "organizer" && (
          <>
            <Link to="/organizer/dashboard" style={{ marginRight: "15px" }}>
              Dashboard
            </Link>
            <Link to="/organizer/events" style={{ marginRight: "15px" }}>
              My Events
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard" style={{ marginRight: "15px" }}>
              Dashboard
            </Link>
            <Link to="/admin/approvals" style={{ marginRight: "15px" }}>
              Approvals
            </Link>
            <Link to="/admin/users" style={{ marginRight: "15px" }}>
              Users
            </Link>
          </>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span style={{ marginRight: "15px" }}>
              Hi, {user.name} ({user.role})
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: "15px" }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
