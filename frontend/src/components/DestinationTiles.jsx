const TONES = [
    'bg-lagoon text-white',
    'bg-marigold text-ink',
    'bg-ink text-white',
    'bg-sage text-white',
];

export default function DestinationTiles({ destinations, selected, onSelect }) {
    if (destinations.length < 2) return null;

    return (
        <section className="mx-auto max-w-[1040px] px-5 py-8">
            <h2 className="font-display text-2xl font-bold">Popular destinations</h2>
            <p className="mt-1">Tap a place to see only its packages.</p>

            <div className="mt-5 flex snap-x gap-4 overflow-x-auto p-2 pb-4">
                {destinations.map((d, index) => {
                    const active = selected.trim().toLowerCase() === d.name.toLowerCase();
                    return (
                        <button
                            key={d.name}
                            type="button"
                            aria-pressed={active}
                            onClick={() => onSelect(active ? '' : d.name)}
                            className={`relative h-44 w-40 shrink-0 snap-start overflow-hidden rounded-2xl text-left ${TONES[index % TONES.length]} ${active ? 'ring-4 ring-offset-2 ring-ink' : ''}`}
                        >
                            {d.image && (
                                <img
                                    src={d.image}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            )}
                            <span
                                className={`absolute inset-x-0 bottom-0 p-3 ${d.image ? 'bg-linear-to-t from-ink/90 to-transparent pt-10 text-white' : ''}`}
                            >
                                <span className="block font-display text-xl leading-tight font-bold">{d.name}</span>
                                <span className="block text-sm">
                                    From ₹{d.minPrice.toLocaleString('en-IN')}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}