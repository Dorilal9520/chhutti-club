export default function Logo({ className = '' }) {
    return (
        <span className={`inline-flex items-center gap-3 ${className}`}>
            <svg width="40" height="40" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                <circle className="fill-marigold" cx="33" cy="15" r="7" />
                <polygon className="fill-mist" points="3,42 19,17 29,32 35,24 45,42" />
            </svg>
            <span className="font-display text-2xl leading-none font-bold">Chhutti Club</span>
        </span>
    );
}