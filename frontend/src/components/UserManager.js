import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUser, updateUser } from "../services/userService";
import { useAuth } from "../context/useAuth";

function UserManager() {
  const { isAdmin, user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Edit state
  const [editingUser, setEditingUser] = useState(null); // user object being edited
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to load users. Admin access required."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (id === currentUser?.id) {
      alert("You cannot delete your own account!");
      return;
    }
    if (!window.confirm("Delete this user? This will also delete all their products.")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user.");
    }
  }

  function openEdit(user) {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      password: "", // require re-entering password on update
      role: user.role,
    });
    setEditError("");
    setFieldErrors({});
  }

  function cancelEdit() {
    setEditingUser(null);
    setEditForm({});
    setEditError("");
    setFieldErrors({});
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setEditError("");
    setFieldErrors({});
    setEditLoading(true);

    try {
      const updated = await updateUser(editingUser.id, {
        ...editForm,
        mobile: Number(editForm.mobile),
      });
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      setEditingUser(null);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        setFieldErrors(data);
      } else {
        setEditError(data?.error || data || "Failed to update user.");
      }
    } finally {
      setEditLoading(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="section">
        <div className="alert alert-error">
          🚫 Access Denied — Admin only area.
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>👥 User Management</h2>
        <span className="badge badge-admin">Admin View</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="loading-text">Loading users...</div>}

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>✏️ Edit User</h3>
            <p className="text-muted">Updating: {editingUser.email}</p>

            {editError && <div className="alert alert-error">{editError}</div>}

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
                {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Enter new password"
                  required
                />
                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
              </div>

              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="number"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  required
                />
                {fieldErrors.mobile && <span className="field-error">{fieldErrors.mobile}</span>}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="empty-state">No users found.</div>
      )}

      {!loading && users.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u.id} className={u.email === currentUser?.email ? "highlight-row" : ""}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{u.name}</strong>
                    {u.email === currentUser?.email && (
                      <span className="badge badge-you">You</span>
                    )}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.mobile}</td>
                  <td>
                    <span className={`badge ${u.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u.id)}
                        disabled={u.email === currentUser?.email}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-muted" style={{ marginTop: "12px", fontSize: "0.85rem" }}>
        Total users: {users.length}
      </p>
    </div>
  );
}

export default UserManager;