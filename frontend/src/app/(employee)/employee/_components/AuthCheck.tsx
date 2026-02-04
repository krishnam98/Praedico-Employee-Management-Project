"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        // Simple one-time check
        const authStatus = localStorage.getItem("employeeAuth");

        if (!authStatus || authStatus !== "true") {
            // Not authenticated, redirect to login
            router.replace("/");
        }
    }, [router]);

    // Always render children immediately - redirect will happen if needed
    return <>{children}</>;
}
