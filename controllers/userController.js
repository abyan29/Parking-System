import { Op } from "sequelize";
import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class UserController {
    static async store(req, res) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({
                    message: "Username, email, dan password wajib diisi",
                });
            }

            const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
                return res.status(409).json({
                    message: "Email sudah terdaftar",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                email,
                password: hashedPassword,
            });

            return res.status(201).json({
                message: "User berhasil ditambahkan",
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error("Gagal menambahkan user:", error);
            return res.status(500).json({ message: "Terjadi kesalahan pada server" });
        }
    }

    static async get(req, res) {
        try {
            const { search } = req.query;
            const where = {};

            if (search) {
                where[Op.or] = [
                    { username: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                ];
            }

            const users = await User.findAll({
                where,
                attributes: { exclude: ["password"] },
            });

            return res.json({ data: users });
        } catch (error) {
            console.error("Gagal mengambil daftar user:", error);
            return res.status(500).json({ message: "Terjadi kesalahan pada server" });
        }
    }

    static async detail(req, res) {
        try {
            const user = await User.findByPk(req.params.id, {
                attributes: { exclude: ["password"] },
            });

            if (!user) {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }

            return res.json({ data: user });
        } catch (error) {
            console.error("Gagal mengambil detail user:", error);
            return res.status(500).json({ message: "Terjadi kesalahan pada server" });
        }
    }

    static async update(req, res) {
        try {
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }

            const { username, email, password } = req.body;
            const updates = {};

            if (username !== undefined) updates.username = username;

            if (email !== undefined) {
                const existingUser = await User.findOne({ where: { email } });

                if (existingUser && existingUser.id !== user.id) {
                    return res.status(409).json({ message: "Email sudah digunakan" });
                }

                updates.email = email;
            }

            if (password !== undefined) {
                updates.password = await bcrypt.hash(password, 10);
            }

            await user.update(updates);

            return res.json({
                message: "User berhasil diperbarui",
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error("Gagal memperbarui user:", error);
            return res.status(500).json({ message: "Terjadi kesalahan pada server" });
        }
    }

    static async delete(req, res) {
        try {
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }

            await user.destroy();

            return res.json({ message: "User berhasil dihapus" });
        } catch (error) {
            console.error("Gagal menghapus user:", error);
            return res.status(500).json({ message: "Terjadi kesalahan pada server" });
        }
    }

    static async me(req, res) {
        try {
            const user = await User.findByPk(req.userId, {
                attributes: { exclude: ["password"] },
            });

            if (!user) {
                return res.status(404).json({
                    message: "User tidak ditemukan",
                });
            }

            return res.json({ data: user });
        } catch (error) {
            console.error("Gagal mengambil profil user:", error);
            return res.status(500).json({
                message: "Terjadi kesalahan pada server",
            });
        }
    }

    static async login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username/email dan password wajib diisi",
            });
        }

        const user = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email: username }],
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "Username/email atau password salah",
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Username/email atau password salah",
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET belum dikonfigurasi");
            return res.status(500).json({
                message: "Konfigurasi server belum lengkap",
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login berhasil",
            token,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
        } catch (error) {
            console.error("Gagal login:", error);
            return res.status(500).json({
                message: "Terjadi kesalahan pada server",
            });
        }
    }

    static async register(req,res) {
        try {
            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET belum dikonfigurasi");
                return res.status(500).json({
                    message: "Konfigurasi server belum lengkap"
                });
            };
            const {username, email, password} = req.body;
            const hashedPassword = await bcrypt.hash(password , 10);
            
            const user = await User.create({ username, email, password: hashedPassword });
            
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(201).json({ token });
            
        } catch (error) {
            console.error("Gagal regis", error);
            return res.status(500).json({ message: "terjadi kesalahan pada server" });
        }
    }
}