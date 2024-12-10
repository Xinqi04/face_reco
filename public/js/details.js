        // Fungsi untuk mengambil data berdasarkan ID dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id'); // Ambil ID dari query parameter URL

        // Fetch data dari server menggunakan ID
        fetch(`/getPerson/${id}`)
            .then(response => response.json())
            .then(data => {
                // Cek apakah data ada
                if (data) {
                    // Menampilkan data ke halaman
                    document.getElementById('nama').textContent = data.Nama;
                    document.getElementById('tanggalLahir').textContent = data.Tanggal_Lahir;
                    document.getElementById('alamat').textContent = data.Alamat;
                    document.getElementById('jenisKelamin').textContent = data.Jenis_Kelamin;
                    document.getElementById('golonganDarah').textContent = data.Golongan_Darah;
                    document.getElementById('agama').textContent = data.Agama;
                    document.getElementById('wali').textContent = data.Wali;
                    document.getElementById('noTelepon').textContent = data.No_Telepon;
                    document.getElementById('createdAt').textContent = data.Created_At;
                    document.getElementById('updatedAt').textContent = data.Updated_At;
                } else {
                    alert('Data pasien tidak ditemukan.');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Terjadi kesalahan dalam pengambilan data.');
            });