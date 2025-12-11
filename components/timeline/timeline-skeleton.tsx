import { m } from "framer-motion";

export function TimelineSkeleton() {
    return (
        <section className="py-20 px-6">
            <div className="text-center mb-20">
                <div className="h-12 w-64 bg-muted/30 rounded-lg mx-auto mb-4 animate-pulse" />
                <div className="h-6 w-96 bg-muted/20 rounded-lg mx-auto animate-pulse" />
            </div>

            <div className="relative max-w-4xl mx-auto">
                {/* Vertical line */}
                <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

                {/* Skeleton items */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="mb-12 relative">
                        <div className={`flex gap-6 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                            {/* Dot */}
                            <div className="absolute left-[19px] md:left-1/2 w-3 h-3 rounded-full bg-muted md:-translate-x-1/2 animate-pulse" />

                            {/* Content skeleton */}
                            <div className="flex-1 ml-12 md:ml-0">
                                <div className="bg-card/50 border border-border rounded-lg p-6 animate-pulse">
                                    <div className="h-8 w-3/4 bg-muted/30 rounded mb-3" />
                                    <div className="h-4 w-full bg-muted/20 rounded mb-2" />
                                    <div className="h-4 w-5/6 bg-muted/20 rounded mb-4" />
                                    <div className="flex gap-2">
                                        <div className="h-6 w-16 bg-muted/20 rounded" />
                                        <div className="h-6 w-16 bg-muted/20 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
