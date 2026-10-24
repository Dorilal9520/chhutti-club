export default function ItineraryTimeline({ itinerary }) {
    const steps = (itinerary || '').split(/\r?\n/).filter((line) => line.trim());

    if (steps.length === 0) return null;

    return (
        <section className="mt-12">
            <h2 className="font-display text-2xl font-bold">Day by day</h2>

            <ol className="mt-6 border-l-2 border-dashed border-ink/30">
                {steps.map((line, index) => {
                    const [label, ...rest] = line.split(':');
                    const hasLabel = rest.length > 0;

                    return (
                        <li key={index} className="relative pb-8 pl-8 last:pb-0">
                            <span
                                aria-hidden="true"
                                className="absolute top-1.5 -left-[11px] size-5 rounded-full border-2 border-ink bg-marigold"
                            />
                            {hasLabel ? (
                                <>
                                    <h3 className="font-display text-lg font-bold">{label}</h3>
                                    <p className="mt-1 max-w-[60ch]">{rest.join(':').trim()}</p>
                                </>
                            ) : (
                                <p className="max-w-[60ch]">{line}</p>
                            )}
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}