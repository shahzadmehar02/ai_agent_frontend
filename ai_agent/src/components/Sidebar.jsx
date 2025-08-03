import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
    const location = useLocation();

    const navLinks = [
        { to: "/products", label: "📦 Products" },
        { to: "/invoices", label: "🧾 Invoices" },
        { to: "/chat", label: "🧾 Chat" }
    ];

    return (
        <aside className="w-64 min-h-screen bg-[#1a1333] text-white p-6 space-y-4 shadow-lg">
            <h2 className="text-2xl font-bold text-center text-purple-400 mb-6">📊 Dashboard</h2>
            {navLinks.map((link) => (
                <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-2 rounded-lg transition-colors text-lg ${
                        location.pathname === link.to
                            ? "bg-purple-700 text-white"
                            : "hover:bg-purple-800 hover:text-white text-gray-300"
                    }`}
                >
                    {link.label}
                </Link>
            ))}
        </aside>
    );
};
