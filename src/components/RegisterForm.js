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
            console.log('Usuario registrado:', data); // Puedes manejar esta respuesta según tus necesidades

            navigate('/home'); // Redirigir después de registro exitoso
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            // Puedes agregar lógica para manejar el error aquí
        }
    };

    return (
        <div className="form-container">
            <h2>Registrarse</h2>
            <form onSubmit={handleRegister}>
                <label htmlFor="Nombre">Nombre</label>
                <input type="text" id="Nombre" name="Nombre" value={formData.Nombre} onChange={handleInputChange} required />

                <label htmlFor="Correo">Correo electrónico</label>
                <input type="email" id="Correo" name="Correo" value={formData.Correo} onChange={handleInputChange} required />

                <label htmlFor="Contraseña">Contraseña</label>
                <input type="password" id="Contraseña" name="Contraseña" value={formData.Contraseña} onChange={handleInputChange} required />

                <label htmlFor="Telefono">Número de teléfono</label>
                <input type="text" id="Telefono" name="Telefono" value={formData.Telefono} onChange={handleInputChange} required />

                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes cuenta? <a href="/LoginForm">Iniciar Sesión</a></p>
        </div>
    );
};

export default RegisterForm;

