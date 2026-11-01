import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
        return res.status(401).json({ error: "Access denied" });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        console.error("JWT_SECRET belum dikonfigurasi");
        return res.status(500).json({
            error: "Konfigurasi server belum lengkap",
        });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.userId;
        return next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid Token" });
    }
};

export default authenticate;