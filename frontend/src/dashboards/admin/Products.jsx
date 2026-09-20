import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";

import DashboardLayout from "../../component/dashboard/DashboardLayout";
import DataTable from "../../component/dashboard/DataTable";
import api from "../../api/axios";

import "./Products.css";

const money = (n) =>
    "₹" + Number(n || 0).toLocaleString("en-IN");

function AdminProducts() {

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fetch products from backend
    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const response = await api.get("/products");

                setProducts(response.data.products || []);

            } catch (error) {

                console.error(
                    "Failed to fetch products:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to fetch products"
                );
            }
        };

        fetchProducts();

    }, []);

    // Change product status
    const toggleProductStatus = async (product) => {

        try {

            const newStatus =
                product.status === "active"
                    ? "inactive"
                    : "active";

            const response = await api.patch(
                `/products/${product._id}`,
                {
                    status: newStatus
                }
            );

            setProducts((currentProducts) =>
                currentProducts.map((p) =>
                    p._id === product._id
                        ? response.data.product
                        : p
                )
            );

        } catch (error) {

            console.error(
                "Failed to update product status:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update product status"
            );
        }
    };

    return (
        <DashboardLayout
            role="admin"
            title="Products"
        >

            <DataTable
                headers={[
                    "Product",
                    "Category",
                    "Price",
                    "Status"
                ]}

                rows={products.map((product) => [
                    product.name,

                    product.category?.name ||
                    "No Category",

                    money(product.startingPrice),

                    product.status
                ])}

                actions={(row, index) => {

                    const product = products[index];

                    return (
                        <div className="flex gap-2">

                            {/* Status Button */}
                            <button
                                onClick={() =>
                                    toggleProductStatus(product)
                                }
                                className="rounded-lg border px-3 py-2 text-xs font-bold"
                            >
                                {product.status === "active"
                                    ? "Set Inactive"
                                    : "Set Active"}
                            </button>

                            {/* View Button */}
                            <button
                                onClick={() =>
                                    setSelectedProduct(product)
                                }
                                className="rounded-lg bg-gray-100 p-2"
                                title="View Product"
                            >
                                <Eye size={16} />
                            </button>

                        </div>
                    );
                }}
            />

            {/* Product Details Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white p-6">

                        <div className="flex items-center justify-between">

                            <h2 className="text-xl font-black">
                                Product Details
                            </h2>

                            <button
                                onClick={() =>
                                    setSelectedProduct(null)
                                }
                                className="rounded-lg bg-gray-100 px-3 py-2 font-bold"
                            >
                                ✕
                            </button>

                        </div>

                        <div className="mt-5 space-y-3">

                            <p>
                                <b>Name:</b>{" "}
                                {selectedProduct.name}
                            </p>

                            <p>
                                <b>Description:</b>{" "}
                                {selectedProduct.description}
                            </p>

                            <p>
                                <b>Category:</b>{" "}
                                {selectedProduct.category?.name ||
                                    "No Category"}
                            </p>

                            <p>
                                <b>Starting Price:</b>{" "}
                                {money(
                                    selectedProduct.startingPrice
                                )}
                            </p>

                            <p>
                                <b>Seller:</b>{" "}
                                {selectedProduct.seller?.name ||
                                    "N/A"}
                            </p>

                            <p>
                                <b>Email:</b>{" "}
                                {selectedProduct.seller?.email ||
                                    "N/A"}
                            </p>

                            <p>
                                <b>Status:</b>{" "}
                                {selectedProduct.status}
                            </p>

                        </div>

                    </div>

                </div>
            )}

        </DashboardLayout>
    );
}

export default AdminProducts;