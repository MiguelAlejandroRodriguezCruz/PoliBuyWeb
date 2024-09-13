import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.jpeg';

const LoginForm = ({ handleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Error de red al intentar iniciar sesión');
            }

            const data = await response.json();
            handleLogin(email);
            navigate("/Home");
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Credenciales incorrectas. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="login-form-container">
            <div className="login-header">
                <img src="../src/assets/images/Logo.jpeg" alt="Logotipo" className="login-logo" />
                <h2 className="login-title">Polibuy</h2>
            </div>
            <form onSubmit={onSubmit} className="login-form">
                <label htmlFor="email">Correo electrónico</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-input"
                />

                <label htmlFor="password">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="login-button">Entrar</button>
            </form>
            <p className="login-footer">
                ¿No tienes cuenta? <a href="/RegisterForm" className="register-link">Registrarse</a>
            </p>
            <p className="forgot-password">
                <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
            </p>
        </div>
    );
};

export default LoginForm;

