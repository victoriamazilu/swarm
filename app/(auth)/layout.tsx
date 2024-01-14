import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Nunito } from "next/font/google";
import '../globals.css';

//Search engine optimization
export const metadata = {
    title: 'Swarm',
    description: 'A Next.js Application for Advice, Discussion, and More'
}

const font = Nunito({weight: "800", subsets: ["latin"]});
export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${font.className} bg-light-2`}>
                    <div className="w-full flex justify-center items-center min-h-screen">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}