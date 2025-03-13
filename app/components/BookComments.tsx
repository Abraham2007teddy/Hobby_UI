import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

interface Comment {
    id: string;
    bookId: string;
    user: string;
    text: string;
}

interface BookCommentsProps {
    bookId: string;
    username: string;
    loggedIn: boolean;
}

const BookComments = ({ bookId, username, loggedIn }: BookCommentsProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        if (!bookId) return;

        const apiUrl = `https://localhost:7153/api/Comments/${bookId}`;

        const fetchComments = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error("Failed to fetch comments");
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, [bookId]);

    const addComment = async () => {
        if (newComment.trim() === "") return;

        const commentData = { bookId, user: username, text: newComment };
        const apiUrl = "https://localhost:7153/api/Comments";

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(commentData),
            });

            if (!response.ok) throw new Error("Failed to add comment");

            const newEntry = await response.json();
            setComments([...comments, newEntry]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const deleteComment = async (id: string) => {
        const apiUrl = `https://localhost:7153/api/Comments/${id}`;

        try {
            const response = await fetch(apiUrl, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete comment");

            setComments(comments.filter(comment => comment.id !== id));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const startEdit = (id: string, text: string) => {
        setEditingId(id);
        setEditText(text);
    };

    const saveEdit = async () => {
        if (!editingId) return;

        const apiUrl = `https://localhost:7153/api/Comments/${editingId}`;
        const updatedComment = { bookId, user: username, text: editText };

        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedComment),
            });

            if (!response.ok) throw new Error("Failed to edit comment");

            setComments(comments.map(comment =>
                comment.id === editingId ? { ...comment, text: editText } : comment
            ));
            setEditingId(null);
            setEditText("");
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };

    return (
        <div>
            <div className="max-h-60 overflow-y-auto px-2 space-y-2">
                {comments.length === 0 ? (
                    <p className="text-gray-600">No comments yet.</p>
                ) : (
                    comments.map(comment => (
                        <div
                            key={comment.id}
                            className={`p-2 mb-2 flex justify-between items-center rounded-lg 
                            ${loggedIn && comment.user === username ? "bg-blue-200" : "bg-gray-200"} text-left`}>

                            {editingId === comment.id ? (
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="border px-2 py-1 rounded w-full"
                                />
                            ) : (
                                <p><strong>{comment.user}</strong>: {comment.text}</p>
                            )}

                            {/* Show edit & delete buttons only for logged-in users */}
                            {loggedIn && comment.user === username && (
                                <div className="ml-2 flex space-x-2">
                                    {editingId === comment.id ? (
                                        <button onClick={saveEdit}>
                                            <Icon icon="mdi:check-bold" className="text-green-600 text-xl" />
                                        </button>
                                    ) : (
                                        <button onClick={() => startEdit(comment.id, comment.text)}>
                                            <Icon icon="mdi:pencil" className="text-blue-600 text-xl" />
                                        </button>
                                    )}
                                    <button onClick={() => deleteComment(comment.id)}>
                                        <Icon icon="mdi:trash-can-outline" className="text-red-600 text-xl" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            {/* Show input field only for logged-in users */}
            {loggedIn && (
                <div className="mt-4 flex space-x-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Write a comment..."
                    />
                    <button onClick={addComment} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookComments;    