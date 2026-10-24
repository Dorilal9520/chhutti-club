import { Link } from 'react-router-dom';

export default function FeaturedTicket({ pkg }) {
    const { destination } = pkg;
    const price = Number(pkg.price_per_person).toLocaleString('en-IN');

    return (
        <Link
            to={`/packages/${pkg.id}`}
            className="block overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_40px_-18px_rgba(17,50,58,0.45)] transition-transform hover:rotate-0 motion-reduce:transition-none lg:rotate-2"
        >
            <div className="relative h-56 bg-lagoon text-white">
                {destination.image ? (
                    <img
                        src={destination.image}
                        alt={destination.name}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <span className="absolute bottom-4 left-5 font-display text-4xl font-bold">
                        {destination.name}
                    </span>
                )}
                <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-sm font-semibold text-ink">
                    Featured package
                </span>
            </div>

            <div className="px-6 pt-5 pb-6">
                <h2 className="font-display text-2xl leading-tight font-bold">{pkg.title}</h2>
                <p className="mt-1 font-semibold text-lagoon">
                    {destination.name}, {destination.country}
                </p>
                <p className="mt-2 text-[0.95rem]">
                    {pkg.duration_days} days, up to {pkg.max_guests} guests
                </p>
            </div>

            <div className="relative border-t-2 border-dashed border-line">
                <span className="absolute -top-[11px] -left-[11px] size-5 rounded-full bg-mist" />
                <span className="absolute -top-[11px] -right-[11px] size-5 rounded-full bg-mist" />

                <div className="flex items-center justify-between gap-3 px-6 py-4">
                    <div>
                        <p className="text-sm">Per person</p>
                        <p className="font-display text-2xl font-bold">₹{price}</p>
                    </div>
                    <span className="rounded-[10px] bg-ink px-4 py-2.5 font-semibold text-white">
                        View package
                    </span>
                </div>
            </div>
        </Link>
    );
}