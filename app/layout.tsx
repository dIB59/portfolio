import type React from "react";
import type { Metadata } from "next";
import "@/app/globals.css";
import { MotionProvider } from "@/components/motion-provider";
import { Toaster } from "@/components/ui/sonner";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ibrahimiqbal.vercel.app";

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: "Ibrahim Iqbal | Full-Stack Developer",
        template: "%s | Ibrahim Iqbal",
    },
    description: "Ibrahim Iqbal's professional portfolio - Full-Stack Developer and Creative Technologist. Showcasing projects and career journey.",
    keywords: [
        "Ibrahim Iqbal",
        "Full-Stack Developer",
        "Web Development",
        "React",
        "Next.js",
        "TypeScript",
        "Software Engineer",
        "Portfolio",
    ],
    authors: [{ name: "Ibrahim Iqbal", url: baseUrl }],
    creator: "Ibrahim Iqbal",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: baseUrl,
        title: "Ibrahim Iqbal | Full-Stack Developer",
        description: "Full-Stack Developer - Career journey and project showcase",
        siteName: "Ibrahim Iqbal Portfolio",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Ibrahim Iqbal Portfolio",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Ibrahim Iqbal | Full-Stack Developer",
        description: "Full-Stack Developer - Career journey and project showcase",
        images: ["/og-image.png"],
        creator: "@ibrahimiqbal",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: [
            {
                url: "/icon-light-32x32.png",
                media: "(prefers-color-scheme: light)",
            },
            {
                url: "/icon-dark-32x32.png",
                media: "(prefers-color-scheme: dark)",
            },
            {
                url: "/icon.svg",
                type: "image/svg+xml",
            },
        ],
        apple: "/apple-icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`font-sans antialiased`}>
                <MotionProvider>{children}</MotionProvider>
                <Toaster />
            </body>
        </html>
    );
}
