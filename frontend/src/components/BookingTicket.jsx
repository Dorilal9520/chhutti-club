import BookingForm from './BookingForm';
import { formatDate } from '../utils/format';

export default function BookingTicket({ pkg }) {
    const price = Number(pkg.price_per_person).toLocaleString('en-IN');

    return (
        <aside
            id="book"
            className="h-fit scroll-mt-24 overflow-hidden rounded-3xl border border-line bg-white lg:sticky lg:top-24"
        >
            <div className="px-6 pt-6 pb-6">
                <p className="text-sm">Per person</p>
                <p className="font-display text-4xl font-bold">₹{price}</p>

                <p className="mt-4 text-sm font-semibold">Available dates</p>
                <p>
                    {formatDate(pkg.available_from)} to {formatDate(pkg.available_to)}
                </p>
            </div>

            <div className="relative border-t-2 border-dashed border-line">
                <span className="absolute -top-[11px] -left-[11px] size-5 rounded-full bg-mist" />
                <span className="absolute -top-[11px] -right-[11px] size-5 rounded-full bg-mist" />

                <div className="px-6 pt-6 pb-6">
                    <BookingForm pkg={pkg} />
                </div>
            </div>
        </aside>
    );
}