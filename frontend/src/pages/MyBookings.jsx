
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { dayOf, formatDate, monthOf } from '../utils/format';

const STATUS_STYLES = {
    pending: 'bg-marigold/25 text-ink',
    confirmed: 'bg-sage/20 text-ink',
    cancelled: 'bg-red-100 text-red-800',
};

const PAYMENT_STYLES = {
    unpaid: 'bg-gray-100 text-gray-700',
    submitted: 'bg-amber-100 text-amber-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

const PAYMENT_LABELS = {
    unpaid: 'Payment Pending',
    submitted: 'Payment Submitted',
    verified: 'Payment Verified',
    rejected: 'Payment Rejected',
};

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/bookings/')
            .then((res) => setBookings(res.data))
            .catch(() => setError('Could not load your bookings.'))
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;

        setError('');

        try {
            const res = await api.patch(`/bookings/${id}/cancel/`);
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? res.data : b))
            );
        } catch {
            setError('Could not cancel this booking. Please try again.');
        }
    };

    return (
        <main className="mx-auto max-w-[1040px] px-5 pt-6 pb-16">
            <h1 className="font-display text-4xl font-bold">
                My bookings
            </h1>

            {!loading && bookings.length > 0 && (
                <p className="mt-1">
                    {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                </p>
            )}

            {loading && <p className="mt-4">Loading your bookings...</p>}

            {error && (
                <p role="alert" className="mt-4 font-semibold text-red-700">
                    {error}
                </p>
            )}

            {!loading && !error && bookings.length === 0 && (
                <div className="mt-6 rounded-2xl border-2 border-dashed border-line bg-white px-6 py-10 text-center">
                    <p className="font-display text-2xl font-bold">
                        No trips booked yet
                    </p>
                    <p className="mt-2">
                        Pick a place and your boarding pass will show up here.
                    </p>
                    <Link
                        to="/"
                        className="mt-5 inline-block rounded-[10px] bg-ink px-5 py-2.5 font-semibold text-white hover:bg-lagoon"
                    >
                        Browse packages
                    </Link>
                </div>
            )}

            <div className="mt-6 grid gap-5">
                {bookings.map((b) => {
                    const cancelled = b.status === 'cancelled';

                    return (
                        <article
                            key={b.id}
                            className={`grid overflow-hidden rounded-2xl border border-line md:grid-cols-[1fr_250px] ${cancelled ? 'bg-mist' : 'bg-white'
                                }`}
                        >
                            <div className="flex gap-5 p-5">
                                <div className="grid h-20 w-20 shrink-0 place-content-center rounded-xl bg-ink text-center text-white">
                                    <span className="font-display text-3xl leading-none font-bold">
                                        {dayOf(b.start_date)}
                                    </span>
                                    <span className="text-sm">
                                        {monthOf(b.start_date)}
                                    </span>
                                </div>

                                <div>
                                    <h2 className="font-display text-xl leading-tight font-bold">
                                        <Link
                                            to={`/packages/${b.package}`}
                                            className="hover:underline"
                                        >
                                            {b.package_title}
                                        </Link>
                                    </h2>

                                    <p className="mt-1">
                                        {b.guests} {b.guests === 1 ? 'guest' : 'guests'}
                                    </p>

                                    <p className="text-sm">
                                        Booked on {formatDate(b.created_at)}
                                    </p>

                                    <p className="mt-2 text-sm">
                                        Booking ID: #{b.id}
                                    </p>
                                </div>
                            </div>

                            <div className="relative flex flex-col items-center justify-center gap-2 border-t-2 border-dashed border-line p-5 text-center md:border-t-0 md:border-l-2">
                                <span
                                    className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    Booking: {b.status}
                                </span>

                                <span
                                    className={`rounded-full px-3 py-1 text-sm font-semibold ${PAYMENT_STYLES[b.payment_status] || 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {PAYMENT_LABELS[b.payment_status] || 'Payment status unavailable'}
                                </span>

                                <p className={`font-display text-2xl font-bold ${cancelled ? 'line-through' : ''
                                    }`}>
                                    ₹{Number(b.total_price).toLocaleString('en-IN')}
                                </p>

                                {b.payment_reference && (
                                    <p className="break-all text-xs text-gray-600">
                                        UTR: {b.payment_reference}
                                    </p>
                                )}

                                {b.status === 'confirmed' && !cancelled && (
                                    <p className="font-semibold text-green-700">
                                        Your seat is confirmed!
                                    </p>
                                )}

                                {b.payment_status === 'submitted' && !cancelled && (
                                    <p className="text-xs text-gray-600">
                                        Your payment is awaiting verification.
                                    </p>
                                )}

                                {b.payment_status === 'rejected' && !cancelled && (
                                    <p className="text-xs font-semibold text-red-700">
                                        Payment could not be verified. Please contact us.
                                    </p>
                                )}

                                {!cancelled && b.status !== 'confirmed' && (
                                    <button
                                        onClick={() => handleCancel(b.id)}
                                        className="rounded-lg border-2 border-red-700 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-700 hover:text-white"
                                    >
                                        Cancel booking
                                    </button>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        </main>
    );
}
