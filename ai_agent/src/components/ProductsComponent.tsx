import {React} from "react";

type Product = {
    id: number;
    name: string;
    price: number;
};

type ProductCardProps = {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col justify-between">
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-green-600 text-sm mt-1">${product.price}</p>
        </div>
        <div className="flex gap-2 mt-4">
            <button
                onClick={() => onEdit(product)}
                className="text-sm text-blue-600 hover:underline"
            >
                ✏️ Edit
            </button>
            <button
                onClick={() => onDelete(product.id)}
                className="text-sm text-red-400 hover:underline"
            >
                🗑️ Delete
            </button>
        </div>
    </div>
);
