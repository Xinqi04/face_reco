const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express();

// Konfigurasi database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "_28Mei2004",  // Ganti dengan password MySQL Anda
    database: "face"         // Nama database Anda
});

db.connect((err) => {
    if (err) {
        console.error("Koneksi ke database gagal:", err.stack);
        return;
    }
    console.log("Koneksi ke database berhasil!");
});

// Middleware untuk melayani file statis
app.use(express.static(path.join(__dirname, "public"))); // Folder 'public' harus berada dalam direktori yang sama dengan file server.js

// Route untuk menyajikan index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html")); // Lokasi file index.html
});

// Route untuk mengambil data berdasarkan ID
app.get("/getPerson/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM pasien WHERE ID_Pasien = ?", [id], (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results[0]);
    });
});

// Jalankan server
app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});
