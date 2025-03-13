import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import * as pdfjs from 'pdfjs-dist';
import { Icon } from '@iconify/react/dist/iconify.js';

interface Book {
    id?: string;
    title: string;
    author: string;
    price: number;
    imageBase64?: string;
    pdfBase64?: string;
}

interface BookListProps {
    books: Book[];
    handleEdit: (book: Book) => void;
    handleDelete: (bookId: string | undefined) => void;
    loggedIn: boolean;
}

const BookList = ({ books, handleEdit, handleDelete, loggedIn }: BookListProps) => {
    const handleDownloadPdf = (pdfBase64: string | undefined) => {
        if (pdfBase64) {
            const link = document.createElement('a');
            link.href = pdfBase64;
            link.download = "book.pdf";
            link.click();
        }
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {books.map((book: Book) => (
                <div key={book.id} className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
                    <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6">
                        {/* Book Image */}
                        {book.imageBase64 && (
                            <div className="flex-shrink-0 w-full sm:w-40 h-52 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                                <img
                                    src={`data:image/png;base64,${book.imageBase64}`}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Book Info */}
                        <div className="flex-grow">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                            <p className="text-lg font-bold text-gray-900">${book.price}</p>

                            {/* Show PDF if available */}
                            {book.pdfBase64 && (
                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-700 mb-2">PDF Preview:</h4>
                                    <div className="overflow-hidden rounded-lg w-full max-h-96 overflow-y-auto shadow-md">  {/* Added overflow-y-auto */}
                                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                                            <Viewer
                                                fileUrl={`data:application/pdf;base64,${book.pdfBase64}`}
                                                initialPage={0}
                                                renderLoader={(props) => <div>Loading...</div>} // Optional loading indicator
                                            />
                                        </Worker>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Buttons Section */}
                    {loggedIn && (  // Only show buttons if user is logged in
                        <div className="mt-6 flex justify-between items-center space-x-4">
                            {/* Left side: Edit and Download Buttons */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleEdit(book)}
                                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    <Icon icon="carbon:edit" className="mr-2 text-xl" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDownloadPdf(`data:application/pdf;base64,${book.pdfBase64}`)}
                                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                >
                                    <Icon icon="carbon:download" className="mr-2 text-xl" />
                                    PDF
                                </button>
                            </div>

                            {/* Right side: Delete Button */}
                            <button
                                onClick={() => handleDelete(book.id)}
                                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
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
