import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const RootLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Allow access only to login and register when not authenticated
    const publicRoutes = ['/', '/login', '/register'];
    if (!user && !publicRoutes.includes(location.pathname)) {
        return <Navigate to="/" replace/>;
    }

    // Redirect authenticated users away from login/register
    if (user && publicRoutes.includes(location.pathname)) {
        return <Navigate to="/home" replace/>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-sky-950 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <NavLink to={user ? "/home" : "/"} className="text-lg font-bold">VideoClub</NavLink>
                            {user && (
                                <div className="flex space-x-4 ml-10">
                                    <NavLink to="/movies" className="hover:text-amber-400">Peliculas</NavLink>
                                    <NavLink to="/search" className="hover:text-amber-400">Buscar</NavLink>
                                    <NavLink to="/reviews" className="hover:text-amber-400">Reviews</NavLink>
                                    <NavLink to="/favorites" className="hover:text-amber-400">Favorites</NavLink>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span>Hola, {user.username}</span>
                                    <button 
                                        onClick={logout}
                                        className="hover:text-amber-400"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <NavLink to="/" className="hover:text-amber-400">
                                    Iniciar Sesión
                                </NavLink>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-6">
                <Outlet />
            </main>
            <footer className="bg-sky-950 text-white text-center p-4 mt-auto">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <p className="text-center">VideoClub ©2025</p>
                </div>
            </footer>
        </div>
    )
}

export default RootLayout