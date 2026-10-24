import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import PackageCard from '../components/PackageCard';
import FeaturedTicket from '../components/FeaturedTicket';
import DestinationTiles from '../components/DestinationTiles';
import HowItWorks from '../components/HowItWorks';
import { DEMO_PACKAGES } from '../demoData';

export default function Home() {
    const [packages, setPackages] = useState([]);
    const [usingDemo, setUsingDemo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        api.get('/packages/')
            .then((res) => setPackages(res.data))
            .catch(() => {
                setPackages(DEMO_PACKAGES);
                setUsingDemo(true);
            })
            .finally(() => setLoading(false));
    }, []);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return packages.filter((p) => {
            const text = `${p.title} ${p.destination.name} ${p.destination.country}`.toLowerCase();
            const matchesText = !q || text.includes(q);
            const matchesPrice = !maxPrice || Number(p.price_per_person) <= Number(maxPrice);
            return matchesText && matchesPrice;
        });
    }, [packages, search, maxPrice]);

    const destinations = useMemo(() => {
        const byName = new Map();
        packages.forEach((p) => {
            const d = p.destination;
            const price = Number(p.price_per_person);
            const current = byName.get(d.name);
            if (!current) {
                byName.set(d.name, { name: d.name, image: d.image, minPrice: price });
            } else if (price < current.minPrice) {
                current.minPrice = price;
            }
        });
        return [...byName.values()];
    }, [packages]);

    const featured = packages.find((p) => p.destination.image) || packages[0];

    const pickDestination = (name) => {
        setSearch(name);
        document.getElementById('packages')?.scrollIntoView({ block: 'start' });
    };

    const clearFilters = () => {
        setSearch('');
        setMaxPrice('');
    };

    const inputClass =
        'bg-transparent pt-1 text-lg font-medium outline-none placeholder:font-normal placeholder:text-ink/50';
    const labelClass =
        'flex min-w-[200px] flex-1 flex-col rounded-lg px-3.5 py-2 text-sm font-semibold focus-within:bg-mist';

    return (
        <main>
            <section className="mx-auto grid max-w-[1040px] items-center gap-12 px-5 pt-8 pb-10 lg:grid-cols-[1.1fr_1fr]">
                <div>
                    <h1 className="font-display text-[clamp(2.6rem,6.5vw,4.6rem)] leading-[1.02] font-bold tracking-tight">
                        Pick a place. The plan is already made.
                    </h1>
                    <p className="mt-5 max-w-[44ch] text-lg">
                        Every package comes with a day by day itinerary, clear prices and seats you can check before you book.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2 rounded-2xl border-2 border-ink bg-white p-2">
                        <label className={labelClass}>
                            Where to
                            <input
                                type="text"
                                placeholder="Goa, Manali, Richi"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={inputClass}
                            />
                        </label>
                        <label className={labelClass}>
                            Budget per person (max)
                            <input
                                type="number"
                                min="0"
                                placeholder="15000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className={inputClass}
                            />
                        </label>
                    </div>

                    {usingDemo && (
                        <p className="mt-5 border-l-4 border-marigold bg-white px-4 py-3 text-[0.95rem]">
                            Showing sample packages because the backend API is not connected yet.
                        </p>
                    )}
                </div>

                {featured && <FeaturedTicket pkg={featured} />}
            </section>

            <DestinationTiles
                destinations={destinations}
                selected={search}
                onSelect={pickDestination}
            />

            <section id="packages" className="mx-auto max-w-[1040px] scroll-mt-24 px-5 py-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-display text-2xl font-bold">All packages</h2>
                    <p>
                        {visible.length} {visible.length === 1 ? 'package' : 'packages'} found
                        {(search || maxPrice) && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="ml-4 font-semibold text-lagoon underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </p>
                </div>

                <div className="mt-6 grid gap-5">
                    {loading && <p>Loading packages...</p>}
                    {!loading && visible.length === 0 && (
                        <p>No packages match this search. Try a different place or a higher budget.</p>
                    )}
                    {visible.map((pkg) => (
                        <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                </div>
            </section>

            <HowItWorks />
        </main>
    );
}