export default function AuthTicket({ title, subtitle, children, footer }) {
    return (
        <main className="mx-auto max-w-[460px] px-5 pt-10 pb-16">
            <div className="overflow-hidden rounded-3xl border border-line bg-white">
                <div className="bg-ink px-6 py-7 text-white">
                    <h1 className="font-display text-4xl font-bold">{title}</h1>
                    <p className="mt-2 text-white/80">{subtitle}</p>
                </div>

                <div className="relative border-t-2 border-dashed border-line">
                    <span className="absolute -top-[11px] -left-[11px] size-5 rounded-full bg-mist" />
                    <span className="absolute -top-[11px] -right-[11px] size-5 rounded-full bg-mist" />
                    <div className="px-6 pt-8 pb-6">{children}</div>
                </div>
            </div>

            <p className="mt-6 text-center">{footer}</p>
        </main>
    );
}