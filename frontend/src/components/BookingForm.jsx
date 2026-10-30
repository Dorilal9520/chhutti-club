
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Field from './Field';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

export default function BookingForm({ pkg }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [startDate, setStartDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [seatsLeft, setSeatsLeft] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [errors, setErrors] = useState([]);
    const [booking, setBooking] = useState(null);
    const [paymentReference, setPaymentReference] = useState('');
    const [paymentSubmitted, setPaymentSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const today = new Date().toLocaleDateString('en-CA');
    const minDate = pkg.available_from > today ? pkg.available_from : today;
    const total = (
        Number(pkg.price_per_person) * Number(guests || 0)
    ).toLocaleString('en-IN');

    const upiLink = booking
        ? `upi://pay?${new URLSearchParams({
            pa: '9520158499@ibl',
            pn: 'Dorilal',
            am: Number(booking.total_price).toFixed(2),
            cu: 'INR',
            tn: `Chhutti Club Booking ${booking.id}`,
        }).toString()}`
        : '';

    useEffect(() => {
        if (!startDate) {
            setSeatsLeft(null);
            return;
        }

        api.get(`/packages/${pkg.id}/seats/`, {
            params: { date: startDate }
        })
            .then((res) => setSeatsLeft(res.data.seats_left))
            .catch(() => setSeatsLeft(null));
    }, [startDate, pkg.id, refresh]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }

        setErrors([]);
        setLoading(true);

        try {
            const res = await api.post('/bookings/', {
                package: pkg.id,
                start_date: startDate,
                guests: Number(guests),
            });

            setBooking(res.data);
            setRefresh((n) => n + 1);

        } catch (err) {
            const data = err.response?.data;

            if (data && typeof data === 'object') {
                setErrors(Object.values(data).flat());
            } else {
                setErrors(['Booking failed. Please try again.']);
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async () => {
        if (!paymentReference.trim()) {
            setErrors(['Please enter your transaction reference number.']);
            return;
        }

        setErrors([]);
        setPaymentLoading(true);

        try {
            await api.post(`/bookings/${booking.id}/payment/`, {
                payment_reference: paymentReference.trim(),
            });

            setPaymentSubmitted(true);

        } catch (err) {
            console.error(
                'Payment submission error:',
                err.response?.data || err
            );

            const data = err.response?.data;

            if (data && typeof data === 'object') {
                setErrors(Object.values(data).flat());
            } else {
                setErrors(['Payment submission failed. Please try again.']);
            }
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">

            {!booking && (
                <>
                    <Field
                        label="Start date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={minDate}
                        max={pkg.available_to}
                        required
                    />

                    <Field
                        label="Guests"
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        min="1"
                        max={pkg.max_guests}
                        required
                    />

                    <div className="flex items-baseline justify-between border-t-2 border-dashed border-line pt-4">
                        <span className="text-sm font-semibold">Total</span>
                        <span className="font-display text-2xl font-bold">
                            ₹{total}
                        </span>
                    </div>

                    {seatsLeft !== null && (
                        <p className={seatsLeft === 0 ? 'font-semibold text-red-700' : 'text-sm'}>
                            {seatsLeft === 0
                                ? 'No seats left on this date.'
                                : `${seatsLeft} seats left on this date.`}
                        </p>
                    )}
                </>
            )}

            {errors.length > 0 && (
                <div role="alert" className="font-semibold text-red-700">
                    {errors.map((message, index) => (
                        <p key={index}>{message}</p>
                    ))}
                </div>
            )}

            {!booking && (
                <button
                    type="submit"
                    disabled={loading || seatsLeft === 0}
                    className="rounded-[10px] bg-ink px-4 py-3 font-semibold text-white hover:bg-lagoon disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? 'Booking...' : user ? 'Book now' : 'Log in to book'}
                </button>
            )}

            {booking && (
                <div className="grid gap-4 rounded-xl border border-line p-4">

                    <h3 className="text-xl font-bold">
                        Booking created!
                    </h3>

                    <p className="text-sm">
                        Booking ID: #{booking.id}
                    </p>

                    <div className="rounded-lg bg-sage/20 p-3">
                        <p className="font-semibold">Amount to pay</p>
                        <p className="text-2xl font-bold">
                            ₹{Number(booking.total_price).toLocaleString('en-IN')}
                        </p>
                    </div>

                    <h4 className="font-semibold">
                        Pay using Bank of Baroda UPI QR
                    </h4>

                    <div className="mx-auto rounded-lg border border-line bg-white p-4">
                        <QRCodeSVG
                            value={upiLink}
                            size={240}
                            level="H"
                            includeMargin
                        />
                    </div>

                    <p className="text-sm text-gray-600">
                        Apne UPI app se QR scan karein aur upar dikhayi gayi
                        exact amount pay karein.
                    </p>

                    {!paymentSubmitted ? (
                        <>
                            <Field
                                label="Transaction Reference / UTR Number"
                                type="text"
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                onClick={handlePaymentSubmit}
                                disabled={paymentLoading}
                                className="rounded-[10px] bg-ink px-4 py-3 font-semibold text-white hover:bg-lagoon disabled:opacity-60"
                            >
                                {paymentLoading ? 'Submitting...' : 'Submit Payment Details'}
                            </button>
                        </>
                    ) : (
                        <div role="status" className="rounded-lg bg-sage/20 p-3">
                            <p className="font-bold">
                                Payment details submitted!
                            </p>
                            <p className="text-sm">
                                Your payment is pending admin verification.
                            </p>
                            <Link
                                to="/my-bookings"
                                className="mt-2 inline-block font-semibold underline"
                            >
                                View my bookings
                            </Link>
                        </div>
                    )}

                </div>
            )}
        </form>
    );
}
