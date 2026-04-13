import React, { useState, useEffect } from "react";
import {
  getAllProductsPaginated,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { useAuth } from "../context/useAuth";

const emptyForm = {
  productName: "",
  productSKU: "",
  productDescription: "",
  productPrice: "",
  productDiscount: "",
};

function ProductManager() {
  const { user, isAdmin } = useAuth();

  const [tab, setTab] = useState("all"); // "all" or "mine"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination (only for "all" tab)
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [tab, page]);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      if (tab === "all") {
        const data = await getAllProductsPaginated(page, pageSize);
        setProducts(data.content || []);
        setTotalPages(data.totalPages || 1);
      } else {
        const data = await getMyProducts();
        setProducts(data);
      }
    } catch (err) {
      setError("Failed to load products. Make sure you're logged in.");
    } finally {
      setLoading(false);
    }
  }

  function handleTabChange(newTab) {
    setTab(newTab);
    setPage(0);
    setShowForm(false);
    setError("");
  }

  function handleFormChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  }

  function openAddForm() {
    setFormData(emptyForm);
    setEditingId(null);
    setFormError("");
    setFieldErrors({});
    setShowForm(true);
  }

  function openEditForm(product) {
    setFormData({
      productName: product.productName,
      productSKU: product.productSKU,
      productDescription: product.productDescription,
      productPrice: product.productPrice,
      productDiscount: product.productDiscount,
    });
    setEditingId(product.productId);
    setFormError("");
    setFieldErrors({});
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setFormError("");
    setFieldErrors({});
    setEditingId(null);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setFormLoading(true);

    const payload = {
      ...formData,
      productPrice: Number(formData.productPrice),
      productDiscount: Number(formData.productDiscount),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchProducts();
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        setFieldErrors(data);
      } else {
        setFormError(data?.error || data || "Failed to save product.");
      }
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete product.");
    }
  }

  function canEditOrDelete(product) {
    return isAdmin || product.userName === user?.email || product.userId?.toString() === user?.id?.toString();
  }

  // Better ownership check using email from JWT vs userName from product
  function isOwner(product) {
    return product.userId && user && (
      isAdmin || product.userName === user.email
    );
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>📦 Products</h2>
        <button className="btn btn-primary" onClick={openAddForm}>
          + Add Product
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${tab === "all" ? "active" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          All Products
        </button>
        <button
          className={`tab-btn ${tab === "mine" ? "active" : ""}`}
          onClick={() => handleTabChange("mine")}
        >
          My Products
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card form-card">
          <h3>{editingId ? "✏️ Edit Product" : "➕ Add New Product"}</h3>

          {formError && <div className="alert alert-error">{formError}</div>}

          <form onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleFormChange}
                  placeholder="e.g. Wireless Mouse"
                  required
                />
                {fieldErrors.productName && (
                  <span className="field-error">{fieldErrors.productName}</span>
                )}
              </div>

              <div className="form-group">
                <label>SKU Code</label>
                <input
                  type="text"
                  name="productSKU"
                  value={formData.productSKU}
                  onChange={handleFormChange}
                  placeholder="e.g. MOUSE-001"
                  required
                />
                {fieldErrors.productSKU && (
                  <span className="field-error">{fieldErrors.productSKU}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="productDescription"
                value={formData.productDescription}
                onChange={handleFormChange}
                placeholder="Describe the product (min 20 characters)..."
                rows="3"
                required
              />
              {fieldErrors.productDescription && (
                <span className="field-error">{fieldErrors.productDescription}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleFormChange}
                  placeholder="0"
                  min="1"
                  required
                />
                {fieldErrors.productPrice && (
                  <span className="field-error">{fieldErrors.productPrice}</span>
                )}
              </div>

              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="productDiscount"
                  value={formData.productDiscount}
                  onChange={handleFormChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  required
                />
                {fieldErrors.productDiscount && (
                  <span className="field-error">{fieldErrors.productDiscount}</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={formLoading}>
                {formLoading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancelForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading */}
      {loading && <div className="loading-text">Loading products...</div>}

      {/* Products Table */}
      {!loading && products.length === 0 && (
        <div className="empty-state">
          <p>No products found.</p>
          {tab === "mine" && <p>Add your first product using the button above.</p>}
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Final Price</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const finalPrice =
                  product.productPrice -
                  (product.productPrice * product.productDiscount) / 100;

                // updated something ////////////////////////////////////////////
                const canAct = isAdmin || product.userName === user?.email;
                //const canAct = isAdmin || (product.userName && user && product.userName === user.email);

                return (
                  <tr key={product.productId}>
                    <td>{tab === "all" ? page * pageSize + index + 1 : index + 1}</td>
                    <td>
                      <strong>{product.productName}</strong>
                      <br />
                      <small className="text-muted">{product.productDescription.slice(0, 50)}...</small>
                    </td>
                    <td><span className="badge">{product.productSKU}</span></td>
                    <td>₹{product.productPrice.toLocaleString()}</td>
                    <td>{product.productDiscount}%</td>
                    <td className="price-final">₹{Math.round(finalPrice).toLocaleString()}</td>
                    <td>
                      {product.userName || "—"}
                      {isAdmin && product.userName === user?.email && (
                        <span className="badge badge-you">You</span>
                      )}
                      {!isAdmin && product.userName === user?.email && (
                        <span className="badge badge-you">You</span>
                      )}
                    </td>
                    <td>
                      <div className="action-btns">
                        {canAct && (
                          <>
                            <button
                              className="btn btn-sm btn-edit"
                              onClick={() => openEditForm(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(product.productId)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {!canAct && <span className="text-muted">—</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination - only for "all" tab */}
      {tab === "all" && totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary btn-sm"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            ← Prev
          </button>
          <span className="page-info">
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductManager;