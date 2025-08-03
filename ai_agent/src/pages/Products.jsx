import { useEffect, useState } from "react";
import '../Products.css'
import { api } from "../Api.js";
import { toast, Toaster } from "react-hot-toast";
import {ProductCard} from "../components/ProductsComponent.jsx";


export const Products = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProducts();
    }, []);

    console.log("Backend API URL:", import.meta.env.VITE_API_URL);

    const getProducts = () => {
        setLoading(true);
        api.get("/products/")
            .then((res) => {
                console.log("API response:", res.data);
                if (Array.isArray(res.data)) {
                    setProducts(res.data);
                } else {
                    toast.error("Unexpected API response");
                }
            })
            .catch(() => toast.error("Failed to load products"))
            .finally(() => setLoading(false));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { name, price };

        if (editingProduct) {
            api.put(`/products/${editingProduct.id}/`, payload)
                .then(() => {
                    toast.success("Product updated");
                    resetForm();
                    getProducts();
                })
                .catch(() => toast.error("Update failed"));
        } else {
            api.post("/products/", payload)
                .then(() => {
                    toast.success("Product created");
                    resetForm();
                    getProducts();
                })
                .catch(() => toast.error("Create failed"));
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setName(product.name);
        setPrice(product.price);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            api.delete(`/products/${id}/`)
                .then(() => {
                    toast.success("Product deleted");
                    getProducts();
                })
                .catch(() => toast.error("Delete failed"));
        }
    };

    const resetForm = () => {
        setName("");
        setPrice("");
        setEditingProduct(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Toaster position="top-right" />
            <div className="max-w-5xl mx-auto space-y-10">
                <header className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">📦 Product Manager</h1>
                    <p className="text-gray-500 mt-1">Manage your products with ease</p>
                </header>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="text-gray-800 border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Laptop"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="text-gray-800 border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. 1000"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
                        >
                            {editingProduct ? "Update Product" : "Add Product"}
                        </button>

                        {editingProduct && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-sm text-gray-500 hover:text-gray-700 underline"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>

                {/* Product List */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">📋 Product List</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading products...</p>
                    ) : products.length === 0 ? (
                        <p className="text-gray-500">No products available.</p>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );

};