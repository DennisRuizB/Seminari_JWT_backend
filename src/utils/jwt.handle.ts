import pkg from "jsonwebtoken";
const { sign, verify } = pkg;   //Importamos las funciones sign y verify de la librería jsonwebtoken
const JWT_SECRET = process.env.JWT_SECRET || "token.010101010101";
const REFRESH_TOKEN_SECRET = "secretKeyRefreshToken";

//No debemos pasar información sensible en el payload, en este caso vamos a pasar como parametro el ID del usuario
const generateToken = (id:string) => {
    const jwt = sign({id}, JWT_SECRET, {expiresIn: '5s'});
    return jwt;
};

const generateRefreshToken = (id:string) => {
    const refreshToken = sign({id}, REFRESH_TOKEN_SECRET, {expiresIn: '15s'});
    return refreshToken;
}

const refreshAccessToken = (refreshToken: string) => {
    try {
        const decoded = verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: string };
        const newAccessToken = generateToken(decoded.id);
        return newAccessToken;
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            throw new Error("REFRESH_TOKEN_EXPIRED"); // Error específico para token expirado
        }
        throw new Error("INVALID_REFRESH_TOKEN"); // Error genérico para token inválido
    }
};

const verifyToken = (jwt: string) => {
    const isOk = verify(jwt, JWT_SECRET);
    return isOk;
};

export { generateToken, verifyToken, generateRefreshToken, refreshAccessToken };