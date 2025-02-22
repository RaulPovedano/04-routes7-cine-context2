import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-sky-950 mb-6">Registro</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sky-900 mb-2">Usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:border-sky-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sky-900 mb-2">Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:border-sky-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-sky-800 text-white py-2 rounded hover:bg-sky-900"
                >
                    Registrarse
                </button>
                <p className="text-center mt-4">
                    ¿Ya tienes cuenta? {' '}
                    <Link to="/" className="text-sky-600 hover:text-sky-800">
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;