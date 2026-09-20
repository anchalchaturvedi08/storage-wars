import React, { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import SellerLayout from "../../component/dashboard/SellerLayout";
import api from "../../api/axios";
import "./AddProduct.css";

function AddProduct() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        startingPrice: "",
        startTime: "",
        endTime: "",
        description: ""
    });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                alert(error.response?.data?.message || "Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    // Handle image change
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Submit Product + Auction
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            alert("Please select a product image");
            return;
        }

        setLoading(true);
        setSaved(false);

        try {
            // STEP 1: Create Product
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("category", formData.category);
            data.append("startingPrice", Number(formData.startingPrice));
            data.append("image", image);

            const productResponse = await api.post("/products", data);
            const product = productResponse.data.product;

            // STEP 2: Create Auction
            await api.post("/auctions", {
                product: product._id,
                startingPrice: Number(formData.startingPrice),
                startTime: formData.startTime,
                endTime: formData.endTime
            });

            setSaved(true);

            // Clear form
            setFormData({
                name: "",
                category: "",
                startingPrice: "",
                startTime: "",
                endTime: "",
                description: ""
            });

            setImage(null);
        } catch (error) {
            console.error("CREATE AUCTION ERROR:", error);
            alert(error.response?.data?.message || "Failed to create product and auction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SellerLayout title="Add Product">
            <div className="rounded-2xl bg-white p-6 shadow-soft">
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    {/* Product Name */}
                    <label className="text-sm font-bold">
                        Product Name
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3 font-normal" placeholder="Enter product name" />
                    </label>

                    {/* Category */}
                    <label className="text-sm font-bold">
                        Category
                        <select required name="category" value={formData.category} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3 font-normal">
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </label>

                    {/* Starting Price */}
                    <label className="text-sm font-bold">
                        Starting Bid Price
                        <input required min="0" type="number" name="startingPrice" value={formData.startingPrice} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3 font-normal" placeholder="Enter starting price" />
                    </label>

                    {/* Auction Start */}
                    <label className="text-sm font-bold">
                        Auction Start Date
                        <input required type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3 font-normal" />
                    </label>

                    {/* Auction End */}
                    <label className="text-sm font-bold">
                        Auction End Date
                        <input required type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3 font-normal" />
                    </label>

                    {/* Description */}
                    <label className="text-sm font-bold md:col-span-2">
                        Description
                        <textarea required rows="5" name="description" value={formData.description} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3 font-normal" placeholder="Product condition, specifications, history and details" />
                    </label>

                    {/* Image */}
                    <div className="md:col-span-2">
                        <div className="rounded-xl border-2 border-dashed p-8 text-center">
                            <ImagePlus className="mx-auto" />
                            <p className="mt-2 text-sm text-muted">Select Product Image</p>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-4" />
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loading} className="rounded-xl bg-ink p-3 font-bold text-white md:col-span-2 disabled:opacity-50">
                        {loading ? "Creating Auction..." : "Create Auction"}
                    </button>
                </form>

                {/* Success */}
                {saved && (
                    <p className="mt-4 rounded-xl bg-green-100 p-3 text-sm font-bold text-green-700">
                        Product and auction created successfully! ✅
                    </p>
                )}
            </div>
        </SellerLayout>
    );
}

export default AddProduct;