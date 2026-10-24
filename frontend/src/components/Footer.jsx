import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-8 bg-ink text-white">
            <div className="mx-auto flex max-w-[1040px] flex-wrap items-center justify-between gap-4 px-5 py-8">
                <div>
                    <Logo />
                    <p className="mt-1 text-sm text-white/75">
                        A portfolio project built with Django REST Framework and React.
                    </p>
                </div>
                <nav className="flex gap-5 text-sm font-semibold">
                    <Link to="/">Packages</Link>
                    <Link to="/my-bookings">My bookings</Link>
                </nav>
            </div>

            <div className="border-t border-white/15">
                <p className="mx-auto max-w-[1040px] px-5 py-4 text-sm text-center text-white/75">
                    &copy; {year} Dorilal Verma. All rights reserved.
                </p>
            </div>
        </footer>
    );
}