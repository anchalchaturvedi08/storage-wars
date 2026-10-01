import React, { useEffect, useState } from "react";
import DashboardLayout from "../../component/dashboard/DashboardLayout";
import api from "../../api/axios";

function AdminCategories() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    parent: "",
    status: "active"
  });

  const [imageFile, setImageFile] = useState(null);

  const fetchTree = async () => {
    try {
      const response = await api.get("/categories?tree=true");
      setTree(response.data.categories || []);
    } catch (error) {
      console.error("CATEGORY FETCH ERROR:", error);
      alert(error.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", parent: "", status: "active" });
    setImageFile(null);
    setEditing(null);
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      // FormData, not JSON, because an image may be attached. Multer reads
      // multipart/form-data; express.json would ignore the file entirely.
      const payload = new FormData();

      payload.append("name", form.name);
      payload.append("description", form.description);
      payload.append("parent", form.parent);

      if (editing) {
        payload.append("status", form.status);
      }

      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (editing) {
        await api.patch(`/categories/${editing._id}`, payload);
      } else {
        await api.post("/categories", payload);
      }

      alert(editing ? "Category updated" : "Category created");

      resetForm();
      fetchTree();

    } catch (error) {
      console.error("CATEGORY SAVE ERROR:", error);
      alert(error.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name || "",
      description: category.description || "",
      parent: category.parent ? String(category.parent._id || category.parent) : "",
      status: category.status || "active"
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/categories/${category._id}`);
      alert("Category deleted");
      fetchTree();
    } catch (error) {
      // The server refuses while subcategories or products still point here.
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <DashboardLayout role="admin" title="Categories">
      <div className="grid gap-6 lg:grid-cols-3">

        {/* ---------- form ---------- */}
        <section className="rounded-2xl bg-white p-6 shadow-soft lg:col-span-1">
          <h2 className="text-xl font-black">
            {editing ? "Edit Category" : "Add Category"}
          </h2>

          <p className="mt-1 text-sm text-muted">
            Leave the parent empty to create a top-level category.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            <label className="block text-sm font-bold">
              Parent Category
              <select
                name="parent"
                value={form.parent}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              >
                <option value="">None — top level</option>
                {tree.map((root) => (
                  <option key={root._id} value={root._id}>
                    {root.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-bold">
              Name
              <input
                required
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
                placeholder="e.g. Vintage Watches"
              />
            </label>

            <label className="block text-sm font-bold">
              Description
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
                placeholder="Shown on the public categories page"
              />
            </label>

            <label className="block text-sm font-bold">
              Image
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files[0] || null)}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              />
              {editing && editing.image && !imageFile && (
                <span className="mt-1 block text-xs font-normal text-muted">
                  Leave empty to keep the current image.
                </span>
              )}
            </label>

            {editing && (
              <label className="block text-sm font-bold">
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border p-3 font-normal"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-ink p-3 font-bold text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border px-5 font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ---------- tree ---------- */}
        <section className="rounded-2xl bg-white p-6 shadow-soft lg:col-span-2">
          <h2 className="text-xl font-black">All Categories</h2>

          {loading ? (
            <p className="mt-6 text-sm text-muted">Loading...</p>
          ) : tree.length === 0 ? (
            <p className="mt-6 text-sm text-muted">
              No categories yet. Create one using the form.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {tree.map((root) => (
                <div key={root._id} className="rounded-xl border p-4">

                  <div className="flex items-center gap-4">
                    {root.image ? (
                      <img
                        src={root.image}
                        alt={root.name}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="grid h-14 w-14 place-items-center rounded-lg bg-cream text-xs text-muted">
                        No image
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-black">
                        {root.name}
                        {root.status === "inactive" && (
                          <span className="ml-2 text-xs font-normal text-muted">
                            (inactive)
                          </span>
                        )}
                      </p>
                      <p className="truncate text-sm text-muted">
                        {root.description || "No description"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => startEdit(root)}
                      className="rounded-lg border px-3 py-1 text-sm font-bold"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(root)}
                      className="rounded-lg border px-3 py-1 text-sm font-bold"
                    >
                      Delete
                    </button>
                  </div>

                  {root.children && root.children.length > 0 && (
                    <div className="mt-4 space-y-2 border-t pt-4 pl-4">
                      {root.children.map((child) => (
                        <div
                          key={child._id}
                          className="flex items-center gap-3"
                        >
                          {child.image ? (
                            <img
                              src={child.image}
                              alt={child.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-cream" />
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold">
                              {child.name}
                              {child.status === "inactive" && (
                                <span className="ml-2 text-xs font-normal text-muted">
                                  (inactive)
                                </span>
                              )}
                            </p>
                            <p className="truncate text-xs text-muted">
                              {child.description || "No description"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => startEdit(child)}
                            className="rounded-lg border px-3 py-1 text-xs font-bold"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => remove(child)}
                            className="rounded-lg border px-3 py-1 text-xs font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AdminCategories;