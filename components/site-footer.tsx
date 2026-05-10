import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const SOCIAL = [
    { href: "https://github.com/dIB59", label: "GitHub", icon: Github },
    {
        href: "https://www.linkedin.com/in/ibrahim-iqbal-a7b9991b5/",
        label: "LinkedIn",
        icon: Linkedin,
    },
    { href: "mailto:ibrahim@alvalabs.io", label: "Email", icon: Mail },
];

export function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border/60 px-6 md:px-12 lg:px-20 py-12 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10">
                <div className="space-y-4 max-w-md">
                    <p
                        className="font-display italic text-foreground leading-tight"
                        style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                    >
                        Let&rsquo;s build something.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Open to interesting work — full-time, contract, or a
                        well-defined project.
                    </p>
                </div>

                <div className="flex flex-col md:items-end gap-6">
                    <ul className="flex items-center gap-5">
                        {SOCIAL.map(({ href, label, icon: Icon }) => (
                            <li key={label}>
                                <Link
                                    href={href}
                                    target={href.startsWith("http") ? "_blank" : undefined}
                                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    aria-label={label}
                                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center w-10 h-10 rounded-full border border-border hover:border-primary/40"
                                >
                                    <Icon className="w-4 h-4" aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        © {year} Ibrahim Iqbal · Built with Next.js
                    </p>
                </div>
            </div>
        </footer>
    );
}
