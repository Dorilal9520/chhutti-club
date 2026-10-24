import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import BookingTicket from '../components/BookingTicket';
import ItineraryTimeline from '../components/ItineraryTimeline';
import ReviewForm from '../components/ReviewForm';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/format';

export default function PackageDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [pkg, setPkg] = useState(null);
    const [error, setError] = useState('');

    const loadPackage = useCallback(() => {
        return api.get(`/packages/${id}/`)
            .then((res) => setPkg(res.data))
            .catch(() => setError('This package could not be loaded.'));
    }, [id]);

    useEffect(() => {
        setPkg(null);
        setError('');
        loadPackage();
    }, [loadPackage]);

    const wrapper = 'mx-auto max-w-[1040px] px-5 pb-16';

    if (error) {
        return (
            <main className={wrapper}>
                <p>{error}</p>
                <Link to="/" className="mt-3 inline-block font-semibold text-lagoon underline">
                    Back to all packages
                </Link>
            </main>
        );
    }

    if (!pkg) {
        return <main className={wrapper}><p>Loading package...</p></main>;
    }

    const { destination } = pkg;
    const reviewCount = pkg.reviews.length;
    const alreadyReviewed = user && pkg.reviews.some((review) => review.user === user.username);

    const facts = [
        { label: 'Duration', value: `${pkg.duration_days} days` },
        { label: 'Group size', value: `Up to ${pkg.max_guests}` },
        {
            label: 'Rating',
            value: pkg.average_rating ? `${pkg.average_rating} out of 5` : 'Not rated yet',
        },
        { label: 'Bookable until', value: formatDate(pkg.available_to) },
    ];

    return (
        <main className={wrapper}>
            <Link to="/" className="inline-block py-2 font-semibold text-lagoon underline">
                Back to all packages
            </Link>

            <div className="relative mt-2 overflow-hidden rounded-3xl bg-lagoon text-white">
                {destination.image ? (
                    <img
                        src={destination.image}
                        alt={destination.name}
                        className="h-72 w-full object-cover md:h-[26rem]"
                    />
                ) : (
                    <div className="h-72 md:h-[26rem]" />
                )}

                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/90 via-ink/50 to-transparent px-6 pt-24 pb-6 md:px-8 md:pb-8">
                    <p className="font-semibold">
                        {destination.name}, {destination.country}
                    </p>
                    <h1 className="mt-1 font-display text-4xl leading-tight font-bold md:text-6xl">
                        {pkg.title}
                    </h1>
                </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
                {facts.map((fact) => (
                    <div key={fact.label} className="bg-white px-5 py-4">
                        <dt className="text-sm">{fact.label}</dt>
                        <dd className="font-display text-lg font-bold">{fact.value}</dd>
                    </div>
                ))}
            </dl>

            <a
                href="#book"
                className="mt-4 inline-block rounded-[10px] bg-ink px-5 py-2.5 font-semibold text-white lg:hidden"
            >
                Go to booking
            </a>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
                <div>
                    {pkg.description && <p className="max-w-[60ch] text-lg">{pkg.description}</p>}

                    <ItineraryTimeline itinerary={pkg.itinerary} />

                    <section className="mt-12">
                        <h2 className="font-display text-2xl font-bold">Reviews</h2>
                        {reviewCount > 0 && (
                            <p className="mt-1">
                                {pkg.average_rating} average from {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                            </p>
                        )}

                        {reviewCount === 0 ? (
                            <p className="mt-3">No reviews yet. Be the first to share how it went.</p>
                        ) : (
                            <div className="mt-5 grid gap-3">
                                {pkg.reviews.map((review) => (
                                    <article key={review.id} className="rounded-xl border border-line bg-white px-5 py-4">
                                        <p className="font-semibold">
                                            {review.user}
                                            <span className="ml-3 text-marigold" aria-label={`${review.rating} out of 5`}>
                                                {'★'.repeat(review.rating)}
                                            </span>
                                        </p>
                                        {review.comment && <p className="mt-1">{review.comment}</p>}
                                    </article>
                                ))}
                            </div>
                        )}

                        {user ? (
                            alreadyReviewed ? (
                                <p className="mt-4 font-semibold">You have reviewed this package. Thank you!</p>
                            ) : (
                                <ReviewForm packageId={pkg.id} onSuccess={loadPackage} />
                            )
                        ) : (
                            <p className="mt-4">
                                <Link to="/login" className="font-semibold text-lagoon underline">Log in</Link>
                                {' '}to write a review.
                            </p>
                        )}
                    </section>
                </div>

                <BookingTicket pkg={pkg} />
            </div>
        </main>
    );
}