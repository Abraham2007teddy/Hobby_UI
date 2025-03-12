import React, { useEffect, useState } from "react";

interface Book {
    id?: string;
    title: string;
    author: string;
    price: number;
    imageBase64?: string;
}

interface BookFormProps {
    view: "add" | "edit";
    form: Book;
    setForm: React.Dispatch<React.SetStateAction<Book>>;
    handleSubmit: () => Promise<void>;
    setImageFile?: React.Dispatch<React.SetStateAction<File | null>>;
}

const BookForm: React.FC<BookFormProps> = ({ view, form, setForm, handleSubmit, setImageFile }) => {
    const [localImage, setLocalImage] = useState<string | null>(null);

    useEffect(() => {
        // Reset local image and form values when switching views
        if (view === "add") {
            setForm({ title: "", author: "", price: 0, imageBase64: "" });
            setLocalImage(null);
        } else if (view === "edit") {
            setLocalImage(form.imageBase64 || null);
        }
    }, [view, setForm, form.imageBase64]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setImageFile?.(file);

        // Preview the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setLocalImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{view === "add" ? "Add a New Book" : "Edit Book"}</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Book Cover</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
                {localImage && <img src={localImage} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
            </div>

            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                {view === "add" ? "Add Book" : "Save Changes"}
            </button>
        </div>
    );
};

export default BookForm;
