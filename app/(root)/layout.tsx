import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "../globals.css";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/Bottombar";
import RightSidebar from "@/components/shared/RightSidebar";
import Topbar from "@/components/shared/Topbar";

const font = Poppins({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Swarm",
    description: "A Next.js Application for Advice, Discussion, and More",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={font.className}>
                    <Topbar />

                    <main className="flex flex-row">
                        <LeftSidebar />
                        <section className="main-container">
                            <div className="w-full max-w-4xl">{children}</div>
                        </section>
                        {/* @ts-ignore */}
                        <RightSidebar />
                    </main>

                    <Bottombar />
                </body>
            </html>
        </ClerkProvider>
    );
}
