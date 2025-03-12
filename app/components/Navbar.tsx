import React from "react"

interface NavbarProps {
    loggedIn: boolean;
    setView: (view: "books" | "add" | "edit" | "login" | "signup") => void;
    handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ loggedIn, setView, handleLogout }) => {
    return (
        <nav className="flex justify-between bg-white shadow-lg p-4 rounded-lg mb-6">
            <div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded mr-4" onClick={() => setView("books")}>
                    View Books
                </button>

                {loggedIn && (
                    <button className="px-4 py-2 bg-purple-500 text-white rounded" onClick={() => setView("add")}>
                        Add Book
                    </button>
                )}
            </div>

            {!loggedIn ? (
                <div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2" onClick={() => setView("login")}>
                        Login
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={() => setView("signup")}>
                        Sign Up
                    </button>
                </div>
            ) : (
                <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleLogout}>
                    Logout
                </button>
            )}
        </nav>
    )
}

export default Navbar;