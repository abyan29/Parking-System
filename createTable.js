import connection from "./model/connection.js";
import "./model/user.js";
import "./model/parkir.js";

try {
    await connection.authenticate();
    console.log("Koneksi database berhasil.");

    await connection.sync();
    console.log("Tabel berhasil dibuat.");
} catch (error) {
    console.error("Gagal membuat tabel:", error);
    process.exitCode = 1;
} finally {
    await connection.close();
}