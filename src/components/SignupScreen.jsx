import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, validatePassword, getPasswordStrength } from "../utils/validators";
import logo from '../components/miralda-palace-logo.png';

const SignupScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth(); // Removemos loading del contexto para el signup también
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar errores cuando el usuario empiece a escribir
        if (error) setError('');
    };

    const handleSignup = async () => {
        // Evitar múltiples envíos
        if (isSubmitting) {
            return;
        }

        setError('');
        setSuccess('');
        setIsSubmitting(true);

        // Validaciones básicas
        if (!formData.name.trim()) {
            setError('El nombre es requerido');
            setIsSubmitting(false);
            return;
        }
        if (!formData.lastname.trim()) {
            setError('El apellido es requerido');
            setIsSubmitting(false);
            return;
        }
        if (!formData.email.trim()) {
            setError('El email es requerido');
            setIsSubmitting(false);
            return;
        }

        // Validación de formato de email
        if (!isValidEmail(formData.email)) {
            setError('Por favor ingresa un email válido');
            setIsSubmitting(false);
            return;
        }

        // Validaciones de contraseña
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.message);
            setIsSubmitting(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await register(formData.name, formData.lastname, formData.email, formData.password);
            if (result) {
                setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');

                // Limpiar formulario
                setFormData({
                    name: '',
                    lastname: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });


                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error('Error en registro:', error);
            setError(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#2C3E50] flex items-center justify-center p-4">
            <div className="bg-[#FDF6E3] p-8 rounded-lg shadow-md w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                        <img
                            src={logo}
                            alt="Miralda Palace Logo"
                            className="w-10 h-10 object-contain"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-[#1C1C1C]">Miralda Palace</h1>
                    <p className="text-[#7F8C8D]">Crear cuenta nueva</p>
                </div>

                {/* Mensajes de error y éxito */}
                {error && (
                    <div
                        className={`mb-4 p-3 rounded-md border ${error.includes('email ya está registrado') || error.includes('usuario ya existe')
                                ? 'bg-orange-100 border-orange-400 text-orange-700'
                                : 'bg-red-100 border-red-400 text-red-700'
                            }`}
                    >
                        <div className="flex items-center">
                            <span className="mr-2">
                                {error.includes('email ya está registrado') || error.includes('usuario ya existe') ? '⚠️' : '❌'}
                            </span>
                            <span>{error}</span>
                        </div>
                        {(error.includes('email ya está registrado') || error.includes('usuario ya existe')) && (
                            <div className="mt-2 text-sm">
                                <Link to="/login" className="text-[#D4AF37] hover:text-[#b9962c] underline">
                                    ¿Ya tienes cuenta? Inicia sesión aquí
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                        <div className="flex items-center">
                            <span className="mr-2">✅</span>
                            <span>{success}</span>
                        </div>
                    </div>
                )}

                {/* Formulario */}
                <form className="space-y-4" noValidate>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[#7F8C8D] mb-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                placeholder="Juan"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-[#7F8C8D] mb-1">
                                Apellido
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                placeholder="Pérez"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#7F8C8D] mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            placeholder="usuario2@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#7F8C8D] mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            placeholder="8-64 caracteres, 1 mayúscula, 1 número, 1 especial"
                        />
                        {/* Indicador de fortaleza */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="text-xs text-[#7F8C8D] mb-1">Requisitos de contraseña:</div>
                                <div className="space-y-1">
                                    {(() => {
                                        const strength = getPasswordStrength(formData.password);
                                        return (
                                            <>
                                                <div className={`text-xs flex items-center ${strength.isValidLength ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <span className="mr-1">{strength.isValidLength ? '✓' : '○'}</span>
                                                    8-64 caracteres
                                                </div>
                                                <div className={`text-xs flex items-center ${strength.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <span className="mr-1">{strength.hasUppercase ? '✓' : '○'}</span>
                                                    Al menos una mayúscula
                                                </div>
                                                <div className={`text-xs flex items-center ${strength.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <span className="mr-1">{strength.hasNumber ? '✓' : '○'}</span>
                                                    Al menos un número
                                                </div>
                                                <div className={`text-xs flex items-center ${strength.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <span className="mr-1">{strength.hasSpecialChar ? '✓' : '○'}</span>
                                                    Carácter especial (@$!%*?&)
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#7F8C8D] mb-1">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            placeholder="Confirma tu contraseña"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSignup();
                                }
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleSignup}
                        disabled={isSubmitting}
                        className="w-full bg-[#D4AF37] text-[#2C3E50] py-2 px-4 rounded-md hover:bg-[#b9962c] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>

                {/* Link de login */}
                <p className="text-center text-sm text-[#7F8C8D] mt-4">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-[#D4AF37] hover:text-[#b9962c]">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupScreen;