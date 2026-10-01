import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit3, Trash2, X } from "lucide-react";

import SellerLayout from "../../component/dashboard/SellerLayout";
import DataTable from "../../component/dashboard/DataTable";
import api from "../../api/axios";

import "./MyProducts.css";

const money = (n) =>
    "₹" + Number(n || 0).toLocaleString("en-IN");

function MyProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [editingProduct, setEditingProduct] =
        useState(null);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        startingPrice: "",
        description: "",
        status: "active"
    });

    const [loading, setLoading] = useState(false);


    // ==================================================
    // FETCH PRODUCTS
    // ==================================================

    const fetchMyProducts = async () => {
        try {
            const response = await api.get("/products");

            const allProducts =
                response.data.products || [];

            const user = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const myProducts = allProducts.filter(
                (product) =>
                    String(
                        product.seller?._id ||
                        product.seller
                    ) ===
                    String(
                        user?._id ||
                        user?.id
                    )
            );

            setProducts(myProducts);

        } catch (error) {
            console.log(
                "MY PRODUCTS ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to fetch products"
            );
        }
    };


    // ==================================================
    // FETCH CATEGORIES
    // ==================================================

    const fetchCategories = async () => {
        try {
            const response =
                await api.get("/categories");

            setCategories(
                response.data.categories || []
            );

        } catch (error) {
            console.log(
                "CATEGORY ERROR:",
                error
            );
        }
    };


    useEffect(() => {
        fetchMyProducts();
        fetchCategories();
    }, []);


    // ==================================================
    // HANDLE INPUT
    // ==================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };


    // ==================================================
    // OPEN EDIT
    // ==================================================

    const openEdit = (product) => {
        setEditingProduct(product);

        setFormData({
            name: product.name || "",

            category:
                product.category?._id ||
                product.category ||
                "",

            startingPrice:
                product.startingPrice || "",

            description:
                product.description || "",

            status:
                product.status || "active"
        });
    };


    // ==================================================
    // CLOSE EDIT
    // ==================================================

    const closeEdit = () => {
        setEditingProduct(null);

        setFormData({
            name: "",
            category: "",
            startingPrice: "",
            description: "",
            status: "active"
        });
    };


    // ==================================================
    // UPDATE PRODUCT
    // ==================================================

    const updateProduct = async (e) => {
        e.preventDefault();

        if (!editingProduct) {
            return;
        }

        try {
            setLoading(true);

            await api.patch(
                `/products/${editingProduct._id}`,
                {
                    name: formData.name,
                    description:
                        formData.description,
                    category:
                        formData.category,
                    images:
                        editingProduct.images || [],
                    startingPrice:
                        Number(
                            formData.startingPrice
                        ),
                    status:
                        formData.status
                }
            );

            alert(
                "Product updated successfully"
            );

            closeEdit();

            // Refresh products
            fetchMyProducts();

        } catch (error) {
            console.error(
                "UPDATE PRODUCT ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update product"
            );

        } finally {
            setLoading(false);
        }
    };


    // ==================================================
    // DELETE PRODUCT
    // ==================================================

    const deleteProduct = async (id) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(
                `/products/${id}`
            );

            setProducts(
                (currentProducts) =>
                    currentProducts.filter(
                        (product) =>
                            product._id !== id
                    )
            );

            alert(
                "Product deleted successfully"
            );

        } catch (error) {
            console.log(
                "DELETE PRODUCT ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };


    return (
        <SellerLayout title="My Products">

            {/* Add Product */}
            <div className="mb-5">
                <Link
                    to="/seller/add-product"
                    className="rounded-xl bg-ink px-4 py-2 font-bold text-white"
                >
                    <Plus
                        className="inline"
                        size={16}
                    />{" "}
                    Add Product
                </Link>
            </div>


            {/* Products Table */}
            <DataTable
                headers={[
                    "Product",
                    "Category",
                    "Starting Price",
                    "Status"
                ]}
                rows={products.map(
                    (product) => [
                        product.name,

                        product.category?.name ||
                            product.category ||
                            "N/A",

                        money(
                            product.startingPrice
                        ),

                        product.status
                    ]
                )}
                actions={(row, index) => {
                    const product =
                        products[index];

                    return (
                        <div className="flex gap-2">

                            {/* Edit */}
                            <button
                                className="rounded-lg bg-gray-100 p-2"
                                title="Edit Product"
                                onClick={() =>
                                    openEdit(
                                        product
                                    )
                                }
                            >
                                <Edit3
                                    size={16}
                                />
                            </button>


                            {/* Delete */}
                            <button
                                onClick={() =>
                                    deleteProduct(
                                        product._id
                                    )
                                }
                                className="rounded-lg bg-red-100 p-2 text-red-600"
                                title="Delete Product"
                            >
                                <Trash2
                                    size={16}
                                />
                            </button>

                        </div>
                    );
                }}
            />


            {/* ==================================================
                EDIT PRODUCT MODAL
            ================================================== */}

            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">

                        {/* Header */}
                        <div className="mb-5 flex items-center justify-between">

                            <div>
                                <h2 className="text-2xl font-black">
                                    Edit Product
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Update your product details.
                                </p>
                            </div>

                            <button
                                onClick={
                                    closeEdit
                                }
                                className="rounded-lg bg-gray-100 p-2"
                                title="Close"
                            >
                                <X
                                    size={18}
                                />
                            </button>

                        </div>


                        {/* Form */}
                        <form
                            onSubmit={
                                updateProduct
                            }
                            className="grid gap-4 md:grid-cols-2"
                        >

                            {/* Product Name */}
                            <div>
                                <label className="mb-1 block text-sm font-bold">
                                    Product Name
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
                                    required
                                    className="w-full rounded-xl border p-3 outline-none focus:ring-2"
                                />
                            </div>


                            {/* Category */}
                            <div>
                                <label className="mb-1 block text-sm font-bold">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="w-full rounded-xl border p-3 outline-none"
                                >
                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map(
                                        (
                                            category
                                        ) => (
                                            <option
                                                key={
                                                    category._id
                                                }
                                                value={
                                                    category._id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>


                            {/* Starting Price */}
                            <div>
                                <label className="mb-1 block text-sm font-bold">
                                    Starting Price
                                </label>

                                <input
                                    type="number"
                                    name="startingPrice"
                                    value={
                                        formData.startingPrice
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    required
                                    className="w-full rounded-xl border p-3 outline-none"
                                />
                            </div>


                            {/* Status */}
                            <div>
                                <label className="mb-1 block text-sm font-bold">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full rounded-xl border p-3 outline-none"
                                >
                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>
                                </select>
                            </div>


                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-bold">
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
                                    rows="5"
                                    required
                                    className="w-full rounded-xl border p-3 outline-none"
                                />
                            </div>


                            {/* Buttons */}
                            <div className="flex justify-end gap-3 md:col-span-2">

                                <button
                                    type="button"
                                    onClick={
                                        closeEdit
                                    }
                                    className="rounded-xl border px-5 py-3 font-bold"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        loading
                                    }
                                    className="rounded-xl bg-ink px-5 py-3 font-bold text-white disabled:opacity-50"
                                >
                                    {loading
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </SellerLayout>
    );
}

export default MyProducts;