import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthTicket from '../components/AuthTicket';
import Field from '../components/Field';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || '/';

    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.username, form.password);
            navigate(redirectTo, { replace: true });
        } catch {
            setError('Wrong username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthTicket
            title="Welcome back"
            subtitle="Log in to book trips and see your bookings."
            footer={
                <>
                    New here?{' '}
                    <Link to="/register" className="font-semibold text-lagoon underline">
                        Create an account
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="grid gap-4">
                <Field
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                />
                <Field
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                />

                {error && <p role="alert" className="font-semibold text-red-700">{error}</p>}

                <button
                    disabled={loading}
                    className="rounded-[10px] bg-ink px-4 py-3 font-semibold text-white hover:bg-lagoon disabled:opacity-60"
                >
                    {loading ? 'Logging in...' : 'Log in'}
                </button>
            </form>
        </AuthTicket>
    );
}