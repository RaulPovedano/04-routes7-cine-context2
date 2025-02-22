import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import ErrorPages from "../pages/ErrorPages";
import MovieDetail from "../pages/MovieDetail";
import MovieList from "../pages/MovieList";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Favorites from "../pages/Favorites";
import Review from "../pages/Review";
import Search from '../pages/Search';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return children;
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPages />,
        children: [
            {
                index: true,
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "home",
                element: <Home />
            },
            {
                path: "movies",
                element: <MovieList />
            },
            {
                path: "movie/:id",
                element: <MovieDetail />
            },
            {
                path: "reviews",
                element: <Review />
            },
            {
                path: "favorites",
                element: <ProtectedRoute><Favorites /></ProtectedRoute>
            },
            {
                path: "search",
                element: <Search />
            }
        ]
    }
]);