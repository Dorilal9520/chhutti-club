import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthTicket from '../components/AuthTicket';
import Field from '../components/Field';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);
        try {
            await register(form.username, form.email, form.password);
            navigate('/', { replace: true });
        } catch (err) {
            const data = err.response?.data;
            if (data && typeof data === 'object') {
                setErrors(Object.values(data).flat());
            } else {
                setErrors(['Something went wrong. Please try again.']);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthTicket
            title="Create account"
            subtitle="It takes less than a minute."
            footer={
                <>
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-lagoon underline">
                        Log in
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
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />
                <Field
                    label="Password (at least 6 characters)"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    minLength={6}
                />

                {errors.length > 0 && (
                    <div role="alert" className="font-semibold text-red-700">
                        {errors.map((message, index) => <p key={index}>{message}</p>)}
                    </div>
                )}

                <button
                    disabled={loading}
                    className="rounded-[10px] bg-ink px-4 py-3 font-semibold text-white hover:bg-lagoon disabled:opacity-60"
                >
                    {loading ? 'Creating account...' : 'Create account'}
                </button>
            </form>
        </AuthTicket>
    );
}