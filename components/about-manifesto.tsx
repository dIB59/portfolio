export function AboutManifesto() {
    return (
        <section
            id="about"
            className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-border/60"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
                <div className="md:col-span-3">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="inline-block w-6 h-px bg-primary align-middle mr-2" />
                        01 / About
                    </p>
                </div>

                <div className="md:col-span-9">
                    <p
                        className="font-display italic text-foreground leading-[1.05] tracking-[-0.02em] max-w-4xl"
                        style={{ fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)" }}
                    >
                        Full-stack developer in Stockholm.
                        <br />
                        TypeScript, Postgres, and a bit of taste.
                    </p>
                </div>
            </div>
        </section>
    );
}
