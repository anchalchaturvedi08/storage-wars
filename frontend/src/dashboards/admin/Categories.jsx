import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import DashboardLayout from "../../component/dashboard/DashboardLayout";
import api from "../../api/axios";

import "./Categories.css";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCategories(response.data.categories);
      } catch (error) {
        console.log(error);

        alert(
          error.response?.data?.message ||
            "Failed to fetch categories"
        );
      }
    };

    fetchCategories();
  }, []);

  // Add category
  const addCategory = async () => {
    if (!name.trim()) return;

    try {
      const response = await api.post(
        "/categories",
        {
          name: name.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCategories((currentCategories) => [
        ...currentCategories,
        response.data.category,
      ]);

      setName("");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to add category"
      );
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCategories((currentCategories) =>
        currentCategories.filter(
          (category) => category._id !== id
        )
      );

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  return (
    <DashboardLayout role="admin" title="Categories">

      {/* Add Category */}
      <div className="mb-5 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-xl border bg-white p-3"
          placeholder="New category name"
        />

        <button
          onClick={addCategory}
          className="rounded-xl bg-ink px-5 font-bold text-white"
        >
          Add
        </button>
      </div>

      {/* Categories */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((category) => (
          <div
            className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-soft"
            key={category._id}
          >
            <span className="font-bold">
              {category.name}
            </span>

            <button
              onClick={() =>
                deleteCategory(category._id)
              }
              className="text-red-500"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}

export default AdminCategories;