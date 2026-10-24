const STEPS = [
    {
        title: 'Choose a package',
        text: 'Browse places and read the full day by day plan before you decide.',
    },
    {
        title: 'Pick your dates',
        text: 'Check how many seats are left on any date. The total updates as you change guests.',
    },
    {
        title: 'Book and go',
        text: 'Confirm in one click, track it in My bookings and cancel if plans change.',
    },
];

export default function HowItWorks() {
    return (
        <section className="mx-auto max-w-[1040px] px-5 py-12">
            <h2 className="font-display text-2xl font-bold">How booking works</h2>

            <ol className="mt-8 grid gap-8 md:grid-cols-3">
                {STEPS.map((step) => (
                    <li key={step.title} className="relative border-t-2 border-dashed border-ink/30 pt-6">
                        <span
                            aria-hidden="true"
                            className="absolute -top-[11px] left-0 size-5 rounded-full border-2 border-ink bg-marigold"
                        />
                        <h3 className="font-display text-xl font-bold">{step.title}</h3>
                        <p className="mt-2">{step.text}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
}