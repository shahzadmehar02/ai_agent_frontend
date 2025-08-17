import {Products} from "./pages/Products.tsx";
import {Toaster} from 'react-hot-toast';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {InvoiceManager} from "./pages/Invoices.tsx";
import {Sidebar} from "./components/Sidebar.tsx";
import {ChatBox} from "./components/ChatComponent.jsx";

function App() {
    return (
        <div className="min-h-screen bg-[#0c0823] text-white flex">
        <Router>
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/" element={<Navigate to="/products" />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/invoices" element={<InvoiceManager />} />
                    <Route path="/invoices" element={<InvoiceManager />} />
                    <Route path="/chat" element={<ChatBox />} />

                </Routes>
            </main>
        </Router>
        </div>
    )
}

export default App
