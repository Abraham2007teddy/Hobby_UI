import React, { FormEvent } from "react";

interface AuthFormProps {
    view: "login" | "signup";
    username: string;
    password: string;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    handleAuth: (e: FormEvent, isSignup: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ view, username, password, setUsername, setPassword, handleAuth }) => {
    return (
        <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{view === "login" ? "Login" : "Sign Up"}</h2>
            <form onSubmit={(e) => handleAuth(e, view === "signup")}>
                <label className="block mb-2">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    required
                />
                <label className="block mb-2">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    {view === "login" ? "Login" : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;
