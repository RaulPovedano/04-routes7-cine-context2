import jwt from 'jsonwebtoken';
// middelware para verificar el token

const authMiddleware = async (req, res, next) => {
    try {
        // estraemos el token
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'No token, no se puede acceder' });
        }
        // verificamos el token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // añadimos el id del usuario al objeto req
        req.userId = verified.userId;
        // continuar con la petición
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error validando el token'});
    }
};

export default authMiddleware;