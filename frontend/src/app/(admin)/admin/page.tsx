"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/admin/auth/signin");
    }, [router]);

    return (
        <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center">
            <div className="text-white text-lg">Redirecting to Admin Portal...</div>
        </div>
    );
}
