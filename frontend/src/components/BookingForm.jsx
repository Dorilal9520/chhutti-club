import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Field from './Field';
import { useAuth } from '../context/AuthContext';

export default function BookingForm({ pkg }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [startDate, setStartDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [seatsLeft, setSeatsLeft] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [errors, setErrors] = useState([]);
    const [booked, setBooked] = useState(false);
    const [loading, setLoading] = useState(false);

    const today = new Date().toLocaleDateString('en-CA');
    const minDate = pkg.available_from > today ? pkg.available_from : today;
    const total = (Number(pkg.price_per_person) * Number(guests || 0)).toLocaleString('en-IN');

    useEffect(() => {
        if (!startDate) {
            setSeatsLeft(null);
            return;
        }
        api.get(`/packages/${pkg.id}/seats/`, { params: { date: startDate } })
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
        setBooked(false);
        setLoading(true);
        try {
            await api.post('/bookings/', {
                package: pkg.id,
                start_date: startDate,
                guests: Number(guests),
            });
            setBooked(true);
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

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
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
                <span className="font-display text-2xl font-bold">₹{total}</span>
            </div>

            {seatsLeft !== null && (
                <p className={seatsLeft === 0 ? 'font-semibold text-red-700' : 'text-sm'}>
                    {seatsLeft === 0
                        ? 'No seats left on this date.'
                        : `${seatsLeft} seats left on this date.`}
                </p>
            )}

            {errors.length > 0 && (
                <div role="alert" className="font-semibold text-red-700">
                    {errors.map((message, index) => <p key={index}>{message}</p>)}
                </div>
            )}

            {booked && (
                <p role="status" className="rounded-lg bg-sage/20 px-3 py-2 font-semibold">
                    Booked! <Link to="/my-bookings" className="underline">View my bookings</Link>
                </p>
            )}

            <button
                disabled={loading || seatsLeft === 0}
                className="rounded-[10px] bg-ink px-4 py-3 font-semibold text-white hover:bg-lagoon disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? 'Booking...' : user ? 'Book now' : 'Log in to book'}
            </button>
        </form>
    );
}