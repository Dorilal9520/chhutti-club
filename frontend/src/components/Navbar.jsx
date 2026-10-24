import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-10 border-b border-white/10 bg-ink/95 py-4 text-white backdrop-blur">
            <div className="mx-auto flex max-w-[1040px] flex-wrap items-center justify-between gap-3 px-5">
                <Link to="/" aria-label="Chhutti Club home">
                    <Logo />
                </Link>

                <nav className="flex flex-wrap items-center gap-5 font-medium">
                    <Link to="/" className="hover:text-marigold">Packages</Link>
                    {user ? (
                        <>
                            <Link to="/my-bookings" className="hover:text-marigold">My bookings</Link>
                            <span className="text-white/75">Hi, {user.username}</span>
                            <button
                                onClick={handleLogout}
                                className="rounded-lg border-2 border-white px-3 py-1 font-semibold hover:bg-white hover:text-ink"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-marigold">Log in</Link>
                            <Link
                                to="/register"
                                className="rounded-lg bg-marigold px-3 py-1.5 font-semibold text-ink hover:bg-white"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}