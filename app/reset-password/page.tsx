"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async (e: any) => {
        e.preventDefault();

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        const data = await res.json();
        setMessage(data.message);

        if (res.ok) {
            // Redirect to login page after success
            setTimeout(() => {
                router.push("/login");
            }, 1500); // 1.5s delay to show success message
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleReset} className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-xl font-bold mb-4">Reset Password</h2>

                <input
                    type="password"
                    className="w-full border p-2 rounded mb-3"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className="w-full p-2 bg-green-500 text-white rounded">
                    Update Password
                </button>

                {message && <p className="mt-3 text-sm text-blue-600">{message}</p>}
            </form>
        </div>
    );
}
