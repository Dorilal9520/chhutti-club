import { useState } from 'react';
import api from '../api/axios';

export default function ReviewForm({ packageId, onSuccess }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post(`/packages/${packageId}/reviews/`, { rating, comment });
            setComment('');
            setRating(5);
            await onSuccess();
        } catch (err) {
            const data = err.response?.data;
            if (data?.detail) {
                setError(data.detail);
            } else if (Array.isArray(data)) {
                setError(data[0]);
            } else {
                setError('Could not submit your review. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-2xl border border-line bg-white p-5">
            <h3 className="font-display text-xl font-bold">Write a review</h3>

            <div role="group" aria-label="Your rating" className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        aria-label={`${star} out of 5`}
                        aria-pressed={star === rating}
                        className={`text-3xl leading-none ${star <= rating ? 'text-marigold' : 'text-line'}`}
                    >
                        ★
                    </button>
                ))}
            </div>

            <label className="grid gap-1 text-sm font-semibold">
                Your experience
                <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you enjoy? What could be better?"
                    className="rounded-lg border-2 border-line px-3 py-2.5 text-base font-normal outline-none focus:border-ink"
                />
            </label>

            {error && <p role="alert" className="font-semibold text-red-700">{error}</p>}

            <button
                disabled={loading}
                className="justify-self-start rounded-[10px] bg-ink px-5 py-2.5 font-semibold text-white hover:bg-lagoon disabled:opacity-60"
            >
                {loading ? 'Submitting...' : 'Submit review'}
            </button>
        </form>
    );
}