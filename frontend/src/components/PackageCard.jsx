import { Link } from 'react-router-dom';

const TONES = [
    'bg-lagoon text-white',
    'bg-marigold text-ink',
    'bg-ink text-white',
    'bg-sage text-white',
];

export default function PackageCard({ pkg }) {
    const { destination } = pkg;
    const tone = TONES[pkg.id % TONES.length];
    const price = Number(pkg.price_per_person).toLocaleString('en-IN');

    return (
        <article className="grid overflow-hidden rounded-2xl border border-line bg-white md:grid-cols-[1fr_200px]">
            <div className="grid sm:grid-cols-[170px_1fr]">
                <div className={`relative flex min-h-30 items-end p-3.5 sm:min-h-[170px] ${tone}`}>
                    {destination.image ? (
                        <img
                            src={destination.image}
                            alt={destination.name}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    ) : (
                        <span className="font-display text-[1.7rem] leading-none font-bold">
                            {destination.name}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2 px-[22px] py-[18px]">
                    <h3 className="text-2xl leading-tight">{pkg.title}</h3>
                    <p className="font-semibold text-lagoon">
                        {destination.name}, {destination.country}
                    </p>
                    <ul className="mt-auto flex flex-wrap gap-x-[18px] gap-y-1 text-[0.95rem]">
                        <li>{pkg.duration_days} days</li>
                        <li>Up to {pkg.max_guests} guests</li>
                        {pkg.average_rating && <li>Rated {pkg.average_rating} out of 5</li>}
                    </ul>
                </div>
            </div>

            <div
                className="relative flex flex-col items-center justify-center gap-0.5 border-t-2 border-dashed border-line p-[18px] text-center
          before:absolute before:-top-[11px] before:-left-[11px] before:size-5 before:rounded-full before:bg-mist before:content-['']
          after:absolute after:-top-[11px] after:-right-[11px] after:size-5 after:rounded-full after:bg-mist after:content-['']
          md:border-t-0 md:border-l-2
          md:after:top-auto md:after:right-auto md:after:-bottom-[11px] md:after:-left-[11px]"
            >
                <small className="text-sm">Per person</small>
                <span className="font-display text-3xl font-bold">₹{price}</span>
                <Link
                    to={`/packages/${pkg.id}`}
                    className="mt-2.5 inline-block rounded-[10px] bg-ink px-4 py-2.5 font-semibold text-white hover:bg-lagoon"
                >
                    View package
                </Link>
            </div>
        </article>
    );
}