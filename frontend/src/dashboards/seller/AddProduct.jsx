import React, { useEffect, useState } from "react";
import { ImagePlus, FileText } from "lucide-react";
import SellerLayout from "../../component/dashboard/SellerLayout";
import api from "../../api/axios";
import "./AddProduct.css";

function AddProduct() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        condition: "",
        brand: "",
        model: "",
        collectionDetails: "",
        name: "",
        category: "",
        startingPrice: "",
        startTime: "",
        endTime: "",
        description: ""
    });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [specs, setSpecs] = useState([{ label: "", value: "" }]);

    // Scheduling is built from a mode and a duration rather than two raw
    // datetime fields. Typing both by hand is how an auction ends up already
    // completed - the am/pm toggle on datetime-local is easy to get wrong.
    // ---------------------------------------------------------------
    // OPTIONAL FIELDS - set to true to show them in this form.
    //
    // Condition, brand, model, specifications, collection details and
    // document upload are hidden, NOT removed. They remain in the Product
    // model, are still accepted by the controller, and still render on the
    // auction detail page when a product has them. Flip this one constant
    // to bring the inputs back; nothing else needs changing.
    // ---------------------------------------------------------------
    const SHOW_OPTIONAL_FIELDS = false;

    const [startMode, setStartMode] = useState("now");
    const [duration, setDuration] = useState("3d");

    // The browser decides whether datetime-local shows AM/PM or 24-hour, based
    // on its locale - which is exactly how an auction ends up scheduled for
    // 5:10 am instead of pm. Separate controls remove the ambiguity.
    const [startDate, setStartDate] = useState("");
    const [startHour, setStartHour] = useState("10");
    const [startMinute, setStartMinute] = useState("00");
    const [startMeridiem, setStartMeridiem] = useState("AM");

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories?tree=true");
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

    // FileList is array-like but not an array, so spread it before storing.
    const handleImageChange = (e) => {
        const selected = [...e.target.files].slice(0, 5);
        setImages(selected);
    };

    const handleDocumentChange = (e) => {
        const selected = [...e.target.files].slice(0, 5);
        setDocuments(selected);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Specifications are a repeatable label/value pair. Kept as local state
    // and serialised to JSON on submit, because FormData cannot carry nested
    // objects through a multipart request.
    const updateSpec = (index, field, value) => {
        setSpecs(specs.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
        ));
    };

    const addSpecRow = () => {
        if (specs.length < 10) setSpecs([...specs, { label: "", value: "" }]);
    };

    const removeSpecRow = (index) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    // ---- scheduling ----
    const DURATIONS = [
        ["1h", "1 hour", 60],
        ["6h", "6 hours", 360],
        ["12h", "12 hours", 720],
        ["1d", "1 day", 1440],
        ["3d", "3 days", 4320],
        ["7d", "7 days", 10080],
        ["14d", "14 days", 20160]
    ];

    const computeTimes = () => {
        // "now" backdates the start by a minute so the auction is immediately
        // live rather than sitting as upcoming until the status job runs.
        let start;

        if (startMode === "now") {
            start = new Date(Date.now() - 60 * 1000);
        } else {
            if (!startDate) return null;

            // 12-hour to 24-hour: 12 AM is midnight (0), 12 PM is noon (12).
            let hour = parseInt(startHour, 10) % 12;
            if (startMeridiem === "PM") hour += 12;

            const [year, month, day] = startDate.split("-").map(Number);

            start = new Date(
                year,
                month - 1,
                day,
                hour,
                parseInt(startMinute, 10)
            );
        }

        if (!start || Number.isNaN(start.getTime())) return null;

        const minutes = DURATIONS.find((d) => d[0] === duration)?.[2] || 4320;

        const end = new Date(start.getTime() + minutes * 60 * 1000);

        return { start, end };
    };

    const preview = computeTimes();

    const previewStatus = preview
        ? preview.start > new Date()
            ? "upcoming"
            : "live"
        : null;

    const formatPreview = (date) =>
        date.toLocaleString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit"
        });

    const removeDocument = (index) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };

    // Submit Product + Auction
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            alert("Please select at least one product image");
            return;
        }

        const times = computeTimes();

        if (!times) {
            alert("Please choose when the auction should start");
            return;
        }

        // The old form took two raw datetimes and nothing checked them, so an
        // auction could be created already ended. Durations are always
        // positive, but a scheduled start in the past is still possible.
        if (times.end <= new Date()) {
            alert("The auction would already have ended. Choose a later start or a longer duration.");
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
            // Appending repeatedly under one name is how multer receives an
            // array for that field.
            data.append("condition", formData.condition);
            data.append("brand", formData.brand);
            data.append("model", formData.model);
            data.append("collectionDetails", formData.collectionDetails);

            // Drop blank rows before sending.
            data.append(
                "specifications",
                JSON.stringify(specs.filter((row) => row.label && row.value))
            );

            images.forEach((file) => data.append("images", file));
            documents.forEach((file) => data.append("documents", file));

            const productResponse = await api.post("/products", data);
            const product = productResponse.data.product;

            // STEP 2: Create Auction
            await api.post("/auctions", {
                product: product._id,
                startingPrice: Number(formData.startingPrice),
                startTime: times.start.toISOString(),
                endTime: times.end.toISOString()
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

            setSpecs([{ label: "", value: "" }]);
            setImages([]);
            setDocuments([]);
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
                            {categories.map((root) =>
                                root.children && root.children.length > 0 ? (
                                    <optgroup key={root._id} label={root.name}>
                                        {/* The optgroup LABEL is not selectable - that is
                                            standard HTML. So the root gets its own option
                                            as well, for lots that fit the category but no
                                            single subcategory: a mixed electronics box,
                                            a bundle of assorted parts.

                                            Filtering is unaffected either way - selecting
                                            a root on the Auctions page already includes
                                            everything beneath it. */}
                                        <option value={root._id}>
                                            {root.name} — general
                                        </option>

                                        {root.children.map((child) => (
                                            <option key={child._id} value={child._id}>
                                                {child.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ) : (
                                    <option key={root._id} value={root._id}>
                                        {root.name}
                                    </option>
                                )
                            )}
                        </select>
                    </label>

                    {/* Starting Price */}
                    <label className="text-sm font-bold">
                        Starting Bid Price
                        <input required min="0" type="number" name="startingPrice" value={formData.startingPrice} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3 font-normal" placeholder="Enter starting price" />
                    </label>

                    {/* ---- scheduling ---- */}
                    <div className="md:col-span-2">
                        <p className="text-sm font-bold">When should bidding open?</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setStartMode("now")}
                                className={
                                    "rounded-xl px-4 py-2.5 text-sm font-bold " +
                                    (startMode === "now"
                                        ? "bg-ink text-white"
                                        : "border bg-white")
                                }
                            >
                                Start immediately
                            </button>

                            <button
                                type="button"
                                onClick={() => setStartMode("schedule")}
                                className={
                                    "rounded-xl px-4 py-2.5 text-sm font-bold " +
                                    (startMode === "schedule"
                                        ? "bg-ink text-white"
                                        : "border bg-white")
                                }
                            >
                                Schedule for later
                            </button>
                        </div>

                        {startMode === "schedule" && (
                            <div className="mt-4">
                                <p className="text-sm font-bold">Start date and time</p>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={new Date().toISOString().slice(0, 10)}
                                        className="rounded-xl border p-3 text-sm"
                                    />

                                    <select
                                        value={startHour}
                                        onChange={(e) => setStartHour(e.target.value)}
                                        className="rounded-xl border p-3 text-sm"
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                            <option key={h} value={String(h)}>
                                                {h}
                                            </option>
                                        ))}
                                    </select>

                                    <span className="font-bold">:</span>

                                    <select
                                        value={startMinute}
                                        onChange={(e) => setStartMinute(e.target.value)}
                                        className="rounded-xl border p-3 text-sm"
                                    >
                                        {["00", "15", "30", "45"].map((m) => (
                                            <option key={m} value={m}>
                                                {m}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Explicit buttons rather than a dropdown, so the
                                        current choice is visible without opening it. */}
                                    <div className="flex overflow-hidden rounded-xl border">
                                        {["AM", "PM"].map((period) => (
                                            <button
                                                key={period}
                                                type="button"
                                                onClick={() => setStartMeridiem(period)}
                                                className={
                                                    "px-4 py-3 text-sm font-bold " +
                                                    (startMeridiem === period
                                                        ? "bg-ink text-white"
                                                        : "bg-white")
                                                }
                                            >
                                                {period}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <label className="mt-4 block text-sm font-bold">
                            Run for
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="mt-2 w-full rounded-xl border p-3 font-normal md:w-80"
                            >
                                {DURATIONS.map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {/* Shows exactly what will be created, so a wrong time
                            is obvious before submitting rather than after. */}
                        {preview && (
                            <div className="mt-4 rounded-xl bg-cream p-4 text-sm">
                                <p>
                                    <b className="uppercase">
                                        {previewStatus === "live" ? "Live" : "Upcoming"}
                                    </b>
                                    {previewStatus === "live"
                                        ? " — bidding opens as soon as you submit"
                                        : ` — bidding opens ${formatPreview(preview.start)}`}
                                </p>

                                <p className="mt-1 text-muted">
                                    Closes {formatPreview(preview.end)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <label className="text-sm font-bold md:col-span-2">
                        Description
                        <textarea required rows="5" name="description" value={formData.description} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3 font-normal" placeholder="Product condition, specifications, history and details" />
                    </label>

                    {SHOW_OPTIONAL_FIELDS && (
                        <>
                        {/* ---- optional details ---- */}
                        <label className="text-sm font-bold">
                            Condition
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border p-3 font-normal"
                            >
                                <option value="">Not specified</option>
                                <option value="new">New</option>
                                <option value="like-new">Like new</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                                <option value="for-parts">For parts</option>
                            </select>
                        </label>

                        <label className="text-sm font-bold">
                            Brand
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border p-3 font-normal"
                                placeholder="e.g. Royal Enfield"
                            />
                        </label>

                        <label className="text-sm font-bold">
                            Model
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border p-3 font-normal"
                                placeholder="e.g. Interceptor 650"
                            />
                        </label>

                        <label className="text-sm font-bold">
                            Collection / Shipping
                            <input
                                type="text"
                                name="collectionDetails"
                                value={formData.collectionDetails}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border p-3 font-normal"
                                placeholder="e.g. Pickup from Indore within 7 days"
                            />
                        </label>

                        {/* ---- specifications ---- */}
                        <div className="md:col-span-2">
                            <p className="text-sm font-bold">Specifications</p>

                            <p className="mt-1 text-xs text-muted">
                                Optional. Label and value pairs shown as a table on the
                                product page — engine capacity, RAM, dimensions.
                            </p>

                            <div className="mt-3 space-y-2">
                                {specs.map((row, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={row.label}
                                            onChange={(e) => updateSpec(index, "label", e.target.value)}
                                            className="w-1/3 rounded-xl border p-2.5 text-sm"
                                            placeholder="Label"
                                        />

                                        <input
                                            type="text"
                                            value={row.value}
                                            onChange={(e) => updateSpec(index, "value", e.target.value)}
                                            className="flex-1 rounded-xl border p-2.5 text-sm"
                                            placeholder="Value"
                                        />

                                        {specs.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSpecRow(index)}
                                                className="rounded-xl border px-3 font-bold text-muted hover:text-ink"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {specs.length < 10 && (
                                <button
                                    type="button"
                                    onClick={addSpecRow}
                                    className="mt-3 rounded-xl border px-4 py-2 text-sm font-bold"
                                >
                                    + Add specification
                                </button>
                            )}
                        </div>
                        </>
                    )}

                    {/* Images */}
                    <div className="md:col-span-2">
                        <div className="rounded-xl border-2 border-dashed p-6 text-center">
                            <ImagePlus className="mx-auto" />

                            <p className="mt-2 text-sm font-bold">
                                Product Photos
                            </p>

                            <p className="mt-1 text-xs text-muted">
                                Up to 5 images. The first becomes the main photo.
                            </p>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="mt-4"
                            />
                        </div>

                        {images.length > 0 && (
                            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                                {images.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index + 1}`}
                                            className="aspect-[4/3] w-full rounded-lg object-cover"
                                        />

                                        {index === 0 && (
                                            <span className="absolute left-1 top-1 rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold text-white">
                                                MAIN
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold shadow"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {SHOW_OPTIONAL_FIELDS && (
                        <>
                        {/* Documents */}
                        <div className="md:col-span-2">
                            <div className="rounded-xl border-2 border-dashed p-6 text-center">
                                <FileText className="mx-auto" />

                                <p className="mt-2 text-sm font-bold">
                                    Supporting Documents
                                </p>

                                <p className="mt-1 text-xs text-muted">
                                    Optional. PDF or Word, up to 5 files — service history,
                                    RC book, invoices. Bidders can download these before bidding.
                                </p>

                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    multiple
                                    onChange={handleDocumentChange}
                                    className="mt-4"
                                />
                            </div>

                            {documents.length > 0 && (
                                <ul className="mt-3 space-y-2">
                                    {documents.map((file, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-3 rounded-lg border p-2.5 text-sm"
                                        >
                                            <FileText size={16} />

                                            <span className="flex-1 truncate font-semibold">
                                                {file.name}
                                            </span>

                                            <span className="text-xs text-muted">
                                                {(file.size / 1024).toFixed(0)} KB
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => removeDocument(index)}
                                                className="font-bold text-muted hover:text-ink"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        </>
                    )}

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