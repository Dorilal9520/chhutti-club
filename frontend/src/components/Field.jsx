export default function Field({ label, ...props }) {
    return (
        <label className="grid gap-1 text-sm font-semibold">
            {label}
            <input
                {...props}
                className="rounded-lg border-2 border-line bg-white px-3 py-2.5 text-base font-normal outline-none focus:border-ink"
            />
        </label>
    );
}