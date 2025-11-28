"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "react-toastify";
import apiClient from "@/lib/apiClient";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email is required");
            return;
        }

        setLoading(true);
        try {
            // ✔ Matches backend endpoint
            const res = await apiClient.post("/api/auth/forgot-password", {
                email,
            });

            toast.success(res.data.message || "Reset link sent to your email");
            setEmail("");
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to send reset link";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-card border border-border rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-foreground text-center mb-3">
                        Forgot Password
                    </h1>

                    <p className="text-muted-foreground text-center mb-6">
                        Enter your email and we’ll send you a reset link.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                disabled={loading}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                        >
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </motion.div>
                    </form>

                    <p className="text-center text-muted-foreground mt-6">
                        Remember your password?{" "}
                        <Link href="/login" className="text-primary hover:underline font-semibold">
                            Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
