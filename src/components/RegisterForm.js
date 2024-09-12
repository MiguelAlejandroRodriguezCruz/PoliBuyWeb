import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Nombre: '',
        Correo: '',
        Contraseña: '',
        Telefono: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log(formData);

        try {
            const response = await fetch('http://localhost:3001/registerUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Usuario registrado:', data);

            navigate('/'); // Redirigir después de registro exitoso
        } catch (error) {
            console.error('Error al registrar usuario:', error);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Registrarse</h2>
            <form onSubmit={handleRegister} className="register-form">
                <label htmlFor="Nombre">Nombre</label>
                <input type="text" id="Nombre" name="Nombre" value={formData.Nombre} onChange={handleInputChange} required className="form-input" />

                <label htmlFor="Correo">Correo electrónico</label>
                <input type="email" id="Correo" name="Correo" value={formData.Correo} onChange={handleInputChange} required className="form-input" />

                <label htmlFor="Contraseña">Contraseña</label>
                <input type="password" id="Contraseña" name="Contraseña" value={formData.Contraseña} onChange={handleInputChange} required className="form-input" />

                <label htmlFor="Telefono">Número de teléfono</label>
                <input type="text" id="Telefono" name="Telefono" value={formData.Telefono} onChange={handleInputChange} required className="form-input" />

                <button type="submit" className="register-button">Registrarse</button>
            </form>
            <p className="login-link">
                ¿Ya tienes cuenta? <a href="/LoginForm">Iniciar Sesión</a>
            </p>
        </div>
    );
};

export default RegisterForm;
