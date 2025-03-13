"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

interface Book {
  id?: string;
  title: string;
  author: string;
  price: number;
  imageBase64?: string;
  pdfBase64?: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Book>({ title: "", author: "", price: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<"login" | "signup" | "books" | "add" | "edit">("login");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBooks();
    if (localStorage.getItem("username")) {
      setLoggedIn(true);
      setView("books");
    }
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("https://localhost:7153/api/books");
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleAuth = async (e: React.FormEvent, isSignup: boolean) => {
    e.preventDefault();
    const url = `https://localhost:7153/api/auth/${isSignup ? "signup" : "login"}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        isSignup ? alert("Account created! Please log in.") : localStorage.setItem("username", username);
        setLoggedIn(!isSignup);
        setView(isSignup ? "login" : "books");
      } else {
        alert("Invalid credentials or sign-up error.");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setLoggedIn(false);
    setView("login");
  };

  const handleEdit = (book: Book) => {
    setForm(book);
    setView("edit");
  };

  const handleSaveEdit = async () => {
    if (!form.id) return;

    try {
      const res = await fetch(`https://localhost:7153/api/books/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setBooks(books.map((b) => (b.id === form.id ? form : b)));
        setView("books");
        setForm({ title: "", author: "", price: 0 });
      } else {
        const errorText = await res.text();
        alert("Failed to update the book: " + errorText);
      }
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleAddBook = async () => {
    if (!form.title || !form.author || form.price <= 0) {
      return alert("Please fill in all fields correctly.");
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("price", String(form.price));

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    if (pdfFile) {
      formData.append("pdfFile", pdfFile);
    }

    console.log("FormData:", formData);

    try {
      const res = await fetch("https://localhost:7153/api/books", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Server Response:", result);
        return alert(`Failed to add book: ${result.message || "Unknown error"}`);
      }

      setBooks((prevBooks) => [...prevBooks, result]);

      setView("books");
      setForm({ title: "", author: "", price: 0 });
      setImageFile(null);
      setPdfFile(null);
    } catch (error) {
      console.error("Request Failed:", error);
      alert("Failed to add book. Check console for details.");
    }
  };

  // delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const res = await fetch(`https://localhost:7153/api/books/${id}`, { method: "DELETE" });

      if (res.ok) {
        setBooks(books.filter((b) => b.id !== id));
      } else {
        alert("Failed to delete book.");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar loggedIn={loggedIn} setView={setView} handleLogout={handleLogout} />

      {!loggedIn && (view === "login" || view === "signup") ? (
        <AuthForm
          view={view}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleAuth={handleAuth}
        />
      ) : (
        <>
          {view === "add" && (
            <BookForm
              view="add"
              form={form}
              setForm={setForm}
              handleSubmit={handleAddBook}
              setImageFile={setImageFile}
              setPdfFile={setPdfFile}
            />
          )}
          {view === "edit" && (
            <BookForm
              view="edit"
              form={form}
              setForm={setForm}
              handleSubmit={handleSaveEdit}
              setImageFile={setImageFile}
              setPdfFile={setPdfFile}
            />
          )}

          {/* Only show BookList when the view is "books" */}
          {view === "books" && (
            <BookList
              books={books}
              loggedIn={loggedIn}
              handleEdit={handleEdit}
              handleDelete={(bookId: string | undefined) => {
                // Handle undefined bookId, prevent errors if undefined
                if (bookId) {
                  handleDelete(bookId); // Call the original handleDelete only when bookId is not undefined
                } else {
                  console.warn('Invalid book ID.');
                }
              }}
            />
          )}

        </>

      )}
    </div>
  );
}
