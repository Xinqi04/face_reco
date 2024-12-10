const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

// Konfigurasi database langsung di dalam file
const db = mysql.createConnection({
    host: "localhost", // Ganti sesuai konfigurasi Anda
    user: "root",      // Ganti sesuai konfigurasi Anda
    password: "_28Mei2004", // Ganti sesuai konfigurasi Anda
    database: "face",  // Nama database
});

// Koneksi ke database
db.connect((err) => {
    if (err) {
        console.error("Koneksi ke database gagal:", err.message);
        process.exit(1); // Keluar dari proses jika koneksi gagal
    }
    console.log("Koneksi ke database berhasil!");
});

// Middleware untuk melayani file statis
app.use(express.static(path.join(__dirname, "public"))); // Folder 'public' menyimpan file frontend

// Route untuk menyajikan index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html")); // Lokasi file index.html
});

// Route untuk mengambil data pasien & riwayat penyakit berdasarkan ID
app.get("/getPersonWithHistory/:id", (req, res) => {
    const id = parseInt(req.params.id, 10); // Ensure ID is a number
    if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }

    // Query for patient data
    const queryPasien = "SELECT * FROM pasien WHERE ID_Pasien = ?";

    // Query for medical history data
    const queryRiwayat = "SELECT * FROM riwayat_penyakit WHERE ID_Pasien = ?";

    // Run both queries in parallel
    db.query(queryPasien, [id], (err, pasienResults) => {
        if (err) {
            console.error("Error querying pasien:", err.message);
            return res.status(500).json({ error: "Database error for patient data" });
        }

        if (pasienResults.length === 0) {
            return res.status(404).json({ error: "Patient data not found" });
        }

        db.query(queryRiwayat, [id], (err, riwayatResults) => {
            if (err) {
                console.error("Error querying riwayat_penyakit:", err.message);
                return res.status(500).json({ error: "Database error for medical history data" });
            }

            // Format the response in a way that the front-end expects
            const response = {
                biodata: pasienResults[0], // Rename to 'biodata' for consistency
                riwayatPenyakit: riwayatResults, // Keep the name consistent with front-end expectations
            };

            // Send the response
            res.json(response);
        });
    });
});

// Jalankan server pada port tertentu
const PORT = 3000; // Anda bisa mengganti port ini jika perlu
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
