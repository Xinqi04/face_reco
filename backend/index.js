const express = require("express");
const mysql = require("mysql2");
const path = require("path");  // Gunakan path untuk menangani path dengan aman
const app = express();

// Konfigurasi database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "_28Mei2004",  // Gantilah dengan password MySQL Anda jika berbeda
    database: "face"        // Nama database yang sesuai dengan yang Anda gunakan
});

db.connect((err) => {
    if (err) {
        console.error("Koneksi ke database gagal:", err.stack);
        return;
    }
    console.log("Koneksi ke database berhasil!");
});

// Endpoint untuk mengambil data berdasarkan ID
app.get("/getPerson/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM pasien WHERE ID_Pasien = ?", [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Menambahkan route untuk root ("/") agar bisa mengakses file index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Menambahkan route untuk mengakses file statis di folder 'public'
app.use(express.static(path.join(__dirname, "../public")));  // Sesuaikan dengan folder 'public'

// Jalankan server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
