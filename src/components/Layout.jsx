import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import Logo from './miralda-palace-logo.png'; // Importa el logo desde components

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const { user, logout, validateToken } = useAuth();

    useEffect(() => {
        const interval = setInterval(() => {
            if (!validateToken()) clearInterval(interval);
        }, 60000);

        validateToken();

        return () => clearInterval(interval);
    }, [validateToken]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4 flex justify-between items-center py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        {/* Logo */}
                        <div className="w-12 h-12">
                            <img src={Logo} alt="Miralda Palace Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Miralda Palace</h1>
                            <p className="text-gray-600">Bienvenido {user.full_name}</p>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                <nav className="py-4 bg-white border-b border-gray-200">
                    <ul className="flex space-x-4 max-w-6xl mx-auto px-4">
                        <li>
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors font-medium"
                            >
                                <span className="mr-2">🏠</span>
                                Inicio
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => navigate('/apartments')}
                                className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors font-medium"
                            >
                                <span className="mr-2">🏢</span>
                                Apartamentos
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => navigate('/contracts')}
                                className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors font-medium"
                            >
                                <span className="mr-2">📄</span>
                                Contratos
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
