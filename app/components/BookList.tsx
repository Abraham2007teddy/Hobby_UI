import React from "react";

interface Book {
    id?: string;
    title: string;
    author: string;
    price: number;
    imageBase64?: string;
}

interface BookListProps {
    books: Book[];
    loggedIn: boolean;
    handleEdit: (book: Book) => void;
    handleDelete: (id: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, loggedIn, handleEdit, handleDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {books.map((book) => (
                <div key={book.id} className="bg-white p-4 shadow-md rounded-lg">
                    {/* Show book image or default placeholder */}
                    <img
                        src={book.imageBase64
                            ? `data:image/png;base64,${book.imageBase64}`
                            : "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp"}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded"
                    />
                    <h2 className="text-xl font-bold mt-2">{book.title}</h2>
                    <p className="text-gray-700">Author: {book.author}</p>
                    <p className="text-gray-700">Price: ${book.price}</p>

                    {loggedIn && (
                        <div className="flex justify-between mt-4">
                            <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(book)}>
                                Edit
                            </button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(book.id!)}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BookList;
