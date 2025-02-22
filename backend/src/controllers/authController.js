// se encarga de los controladores de autenticación

// librería para generar y verificar jwt
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// controlador del login
const login = async (req, res) => {
    // extraemos username y password
    const { username, password } = req.body;
    // buscamos el usuario en la BD
    const user = await User.findOne({ username });
    if(!user || !(await user.comparePassword(password))){
        return res.status(401).json({ message: 'Credenciales Incorrectas.' });
    };
    // generamos el token JWT
    const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:'1h'});

    // creamos la cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // solo en producción
        maxAge: 3600000, // 1 hora
        sameSite: 'strict' // previniendo ataques CSRF
    });
    res.json({ message:'Inicio de sesión exitoso.' });
};

const register = async (req, res) => {
    // controlador para registar usuarios
    const { username, password } = req.body;
    // verificamos que el username no exista ya
    const existingUser = await User.findOne({ username });
    if(existingUser){
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
    };
    // creamos el nuevo usuario
    const user = new User({ username, password }); // ***** revisar *****
    // hasheamos la contraseña
    await user.save();
    res.status(201).json({ message:'Registro exitoso.' });
};

const logout = async (req, res) => {
    res.cookie('token','',{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // solo en producción
        maxAge: 0, // caducar la cookie inmediatamente
    });
    res.json({ message:'Sesión cerrada con existo.' });
};

const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'No autorizado. Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Usuario autenticado', user });
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};


export { login, register, logout, checkAuth };