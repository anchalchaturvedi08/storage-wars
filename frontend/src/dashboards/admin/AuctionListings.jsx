import React, { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, ShoppingBag, X } from "lucide-react";
import DashboardLayout from "../../component/dashboard/DashboardLayout";
import DataTable from "../../component/dashboard/DataTable";
import api from "../../api/axios";
import "./AuctionListings.css";

const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });
};

function AdminAuctions() {
    const [auctions, setAuctions] = useState([]);
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingAuction, setEditingAuction] = useState(null);
    const [editFormData, setEditFormData] = useState({ product: "", startingPrice: "", startTime: "", endTime: "", status: "upcoming" });
    const [formData, setFormData] = useState({ product: "", startingPrice: "", startTime: "", endTime: "" });

    const fetchAuctions = async () => {
        try {
            const response = await api.get("/auctions");
            setAuctions(response.data.auctions || []);
        } catch (error) {
            console.error("FETCH AUCTIONS ERROR:", error);
            alert(error.response?.data?.message || "Failed to fetch auctions");
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            setProducts(response.data.products || []);
        } catch (error) {
            console.error("FETCH PRODUCTS ERROR:", error);
        }
    };

    useEffect(() => {
        fetchAuctions();
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => ({ ...current, [name]: value }));

        if (name === "product") {
            const selectedProduct = products.find((product) => product._id === value);
            if (selectedProduct) {
                setFormData((current) => ({ ...current, product: value, startingPrice: selectedProduct.startingPrice }));
            }
        }
    };

    const openCreateForm = () => {
        setFormData({ product: "", startingPrice: "", startTime: "", endTime: "" });
        setShowForm(true);
    };

    const closeCreateForm = () => {
        setShowForm(false);
        setFormData({ product: "", startingPrice: "", startTime: "", endTime: "" });
    };

    const createAuction = async (e) => {
        e.preventDefault();

        if (!formData.product) return alert("Please select a product");
        if (!formData.startTime) return alert("Please select start time");
        if (!formData.endTime) return alert("Please select end time");
        if (new Date(formData.endTime) <= new Date(formData.startTime)) return alert("End time must be after start time");

        try {
            setLoading(true);
            await api.post("/auctions", {
                product: formData.product,
                startingPrice: Number(formData.startingPrice),
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString()
            });
            alert("Auction created successfully");
            closeCreateForm();
            await fetchAuctions();
        } catch (error) {
            console.error("CREATE AUCTION ERROR:", error);
            alert(error.response?.data?.message || "Failed to create auction");
        } finally {
            setLoading(false);
        }
    };

    const updateAuction = async (e) => {
        e.preventDefault();
        if (!editingAuction) return;
        if (new Date(editFormData.endTime) <= new Date(editFormData.startTime)) return alert("End time must be after start time");

        try {
            setLoading(true);

            await api.patch(`/auctions/${editingAuction._id}`, {
                product: editFormData.product,
                startingPrice: Number(editFormData.startingPrice),
                startTime: new Date(editFormData.startTime).toISOString(),
                endTime: new Date(editFormData.endTime).toISOString(),
                status: editFormData.status
            });

            alert("Auction updated successfully");
            setEditingAuction(null);
            await fetchAuctions();

        } catch (error) {
            console.error("UPDATE AUCTION ERROR:", error);
            alert(error.response?.data?.error || error.response?.data?.message || error.message);

        } finally {
            setLoading(false);
        }
    };

    const deleteAuction = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this auction?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/auctions/${id}`);
            setAuctions((currentAuctions) => currentAuctions.filter((auction) => auction._id !== id));
            alert("Auction deleted successfully");
        } catch (error) {
            console.error("DELETE AUCTION ERROR:", error);
            alert(error.response?.data?.message || "Failed to delete auction");
        }
    };

    const createOrder = async (auctionId) => {
        try {
            const response = await api.post(`/orders/from-auction/${auctionId}`);
            alert(response.data.message || "Order created successfully");
        } catch (error) {
            console.error("CREATE ORDER ERROR:", error);
            alert(error.response?.data?.message || "Failed to create order");
        }
    };

    return (
        <DashboardLayout role="admin" title="Auction Listings">
            <div className="mb-5 flex justify-between">
                <p className="text-sm text-muted">Manage live and upcoming auction listings.</p>
                <button onClick={openCreateForm} className="rounded-xl bg-ink px-4 py-2 font-bold text-white"><Plus className="inline" size={16} /> New Auction</button>
            </div>

            <DataTable
                headers={["Auction", "Product", "Start Price", "Current Bid", "Status"]}
                rows={auctions.map((auction, index) => [
                    `AUC-${String(index + 1).padStart(4, "0")}`,
                    auction.product?.name || "No Product",
                    money(auction.startingPrice),
                    money(auction.currentBid),
                    auction.status
                ])}
                actions={(row, index) => {
                    const auction = auctions[index];

                    return (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setEditingAuction(auction);
                                    setEditFormData({
                                        product: auction.product?._id || auction.product || "",
                                        startingPrice: auction.startingPrice || "",
                                        startTime: auction.startTime ? new Date(auction.startTime).toISOString().slice(0, 16) : "",
                                        endTime: auction.endTime ? new Date(auction.endTime).toISOString().slice(0, 16) : "",
                                        status: auction.status || "upcoming"
                                    });
                                }}
                                className="rounded-lg bg-gray-100 p-2"
                                title="Edit Auction"
                            >
                                <Edit3 size={16} />
                            </button>

                            {auction.status === "completed" && (
                                <button onClick={() => createOrder(auction._id)} className="rounded-lg bg-green-100 p-2 text-green-700" title="Create Order">
                                    <ShoppingBag size={16} />
                                </button>
                            )}

                            <button onClick={() => deleteAuction(auction._id)} className="rounded-lg bg-red-100 p-2 text-red-600" title="Delete Auction">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                }}
            />

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black">Create New Auction</h2>
                                <p className="mt-1 text-sm text-gray-500">Select a product and set the auction timing.</p>
                            </div>
                            <button onClick={closeCreateForm} className="rounded-lg bg-gray-100 p-2" title="Close"><X size={18} /></button>
                        </div>

                        <form onSubmit={createAuction} className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-bold">Product</label>
                                <select name="product" value={formData.product} onChange={handleChange} required className="w-full rounded-xl border p-3 outline-none">
                                    <option value="">Select Product</option>
                                    {products.map((product) => (
                                        <option key={product._id} value={product._id}>{product.name} - {money(product.startingPrice)}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold">Starting Price</label>
                                <input type="number" name="startingPrice" value={formData.startingPrice} onChange={handleChange} min="0" required className="w-full rounded-xl border p-3 outline-none" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold">Start Time</label>
                                <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full rounded-xl border p-3 outline-none" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold">End Time</label>
                                <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} required className="w-full rounded-xl border p-3 outline-none" />
                            </div>

                            <div className="flex justify-end gap-3 md:col-span-2">
                                <button type="button" onClick={closeCreateForm} className="rounded-xl border px-5 py-3 font-bold">Cancel</button>
                                <button type="submit" disabled={loading} className="rounded-xl bg-ink px-5 py-3 font-bold text-white disabled:opacity-50">{loading ? "Creating..." : "Create Auction"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingAuction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black">Edit Auction</h2>
                                <p className="mt-1 text-sm text-gray-500">Update auction details.</p>
                            </div>
                            <button onClick={() => setEditingAuction(null)} className="rounded-lg bg-gray-100 p-2" title="Close"><X size={18} /></button>
                        </div>

                        <form onSubmit={updateAuction} className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-bold">Product</label>
                                <select value={editFormData.product || editingAuction.product?._id || ""} onChange={(e) => setEditFormData({ ...editFormData, product: e.target.value })} className="w-full rounded-xl border p-3 outline-none">
                                    <option value="">Select Product</option>
                                    {products.map((product) => (
                                        <option key={product._id} value={product._id}>{product.name} - {money(product.startingPrice)}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold">Starting Price</label>
                                <input type="number" value={editFormData.startingPrice} onChange={(e) => setEditFormData({ ...editFormData, startingPrice: e.target.value })} min="0" required className="w-full rounded-xl border p-3 outline-none" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold">Status</label>
                                <select value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })} className="w-full rounded-xl border p-3 outline-none">
                                    <option value="upcoming">Upcoming</option>
                                    <option value="live">Live</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold">Start Time</label>
                                <input type="datetime-local" value={editFormData.startTime} onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })} required className="w-full rounded-xl border p-3 outline-none" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold">End Time</label>
                                <input type="datetime-local" value={editFormData.endTime} onChange={(e) => setEditFormData({ ...editFormData, endTime: e.target.value })} required className="w-full rounded-xl border p-3 outline-none" />
                            </div>

                            <div className="flex justify-end gap-3 md:col-span-2">
                                <button type="button" onClick={() => setEditingAuction(null)} className="rounded-xl border px-5 py-3 font-bold">Cancel</button>
                                <button type="submit" disabled={loading} className="rounded-xl bg-ink px-5 py-3 font-bold text-white disabled:opacity-50">{loading ? "Saving..." : "Save Changes"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default AdminAuctions;