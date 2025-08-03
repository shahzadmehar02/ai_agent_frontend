import { useState, useEffect } from "react";
import { api } from "../Api.js";
import { toast } from "react-hot-toast";
import '../Products.css';

export const InvoiceManager = () => {
    const [invoices, setInvoices] = useState([]);
    const [customer, setCustomer] = useState("");
    const [products, setProducts] = useState([{ name: "", price: "" }]);
    const [editingInvoice, setEditingInvoice] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = () => {
        api.get("/invoices/")
            .then(res => setInvoices(res.data))
            .catch(() => toast.error("Failed to load invoices"));
    };

    const handleProductChange = (index, field, value) => {
        const updated = [...products];
        updated[index][field] = value;
        setProducts(updated);
    };

    const addProduct = () => {
        setProducts([...products, { name: "", price: "" }]);
    };

    const handleEdit = (invoice) => {
        setCustomer(invoice.customer || "");
        setProducts(invoice.products.map(p => ({ name: p.name, price: p.price })));
        setEditingInvoice(invoice);
    };

    const resetForm = () => {
        setCustomer("");
        setProducts([{ name: "", price: "" }]);
        setEditingInvoice(null);
    };

    const createOrUpdateInvoice = () => {
        const payload = { customer, products };

        if (editingInvoice) {
            api.put(`/invoices/${editingInvoice.id}/`, payload)
                .then(() => {
                    toast.success("Invoice updated");
                    fetchInvoices();
                    resetForm();
                })
                .catch(() => toast.error("Update failed"));
        } else {
            api.post("/invoices/", payload)
                .then(() => {
                    toast.success("Invoice created");
                    fetchInvoices();
                    resetForm();
                })
                .catch(() => toast.error("Creation failed"));
        }
    };

    const deleteInvoice = (id) => {
        if (!window.confirm("Are you sure you want to delete this invoice?")) return;

        api.delete(`/invoices/${id}/`)
            .then(() => {
                toast.success("Invoice deleted");
                fetchInvoices();
            })
            .catch(() => toast.error("Delete failed"));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold text-blue-800 text-center">🧾 {editingInvoice ? "Edit Invoice" : "Create Invoice"}</h2>

                <div className="bg-white p-6 rounded-xl shadow space-y-4">
                    <input
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        placeholder="Customer name"
                        className="text-gray-800 border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    {products.map((product, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-4">
                            <input
                                value={product.name}
                                onChange={(e) => handleProductChange(index, "name", e.target.value)}
                                placeholder="Product name"
                                className="text-gray-800 border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                value={product.price}
                                onChange={(e) => handleProductChange(index, "price", parseFloat(e.target.value))}
                                placeholder="Price"
                                className="text-gray-800 border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}

                    <button
                        onClick={addProduct}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        + Add another product
                    </button>

                    <button
                        onClick={createOrUpdateInvoice}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                    >
                        {editingInvoice ? "Update Invoice" : "Create Invoice"}
                    </button>

                    {editingInvoice && (
                        <button
                            onClick={resetForm}
                            className="text-sm text-gray-500 hover:text-gray-700 underline mt-2"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                {/* Invoices list */}
                <div>
                    <h3 className="text-2xl font-semibold text-blue-800 mb-4">📜 All Invoices</h3>
                    {invoices.length === 0 ? (
                        <p className="text-gray-500">No invoices found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {invoices.map((inv) => (
                                <li key={inv.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-3 hover:shadow-lg transition">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-blue-800 font-semibold text-lg">
                                            <span>👤</span>
                                            <span>{inv.customer || "N/A"}</span>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            <button
                                                onClick={() => handleEdit(inv)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => deleteInvoice(inv.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>

                                    </div>

                                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                                        <span>🛒</span>
                                        <span>Products:</span>
                                    </div>

                                    <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
                                        {inv.products.map((p, i) => (
                                            <li key={i}>
                                                <span className="font-medium">{p.name}</span> — ${p.price}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
