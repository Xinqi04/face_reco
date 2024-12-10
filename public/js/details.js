async function loadData() {
    try {
        // Ambil ID dari query parameter URL
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (!id) {
            throw new Error('ID is required');
        }

        const response = await fetch(`/getPersonWithHistory/${id}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('API Response:', data);  // Log the entire response

        // Render biodata pasien
        document.getElementById('nama').textContent = data.biodata.Nama;
        document.getElementById('tanggalLahir').textContent = data.biodata.Tanggal_Lahir;
        document.getElementById('alamat').textContent = data.biodata.Alamat;
        document.getElementById('jenisKelamin').textContent = data.biodata.Jenis_Kelamin;
        document.getElementById('golonganDarah').textContent = data.biodata.Golongan_Darah;
        document.getElementById('agama').textContent = data.biodata.Agama;
        document.getElementById('wali').textContent = data.biodata.Wali;
        document.getElementById('noTelepon').textContent = data.biodata.No_Telepon;
        const photoElement = document.getElementById("patient-photo");

        // Tampilkan gambar pasien
        if (data.biodata.foto) {
            photoElement.src = `http://localhost:3000${data.biodata.foto}`;
        } else {
            photoElement.alt = "Foto tidak tersedia";
        }

        // Render riwayat penyakit
        const riwayatContainer = document.getElementById('riwayatContainer');
        riwayatContainer.innerHTML = ''; // Clear the container before adding new data
        if (data.riwayatPenyakit && data.riwayatPenyakit.length > 0) {
            data.riwayatPenyakit.forEach((entry) => {
                const div = document.createElement('div');
                div.classList.add('border', 'border-gray-300', 'p-4', 'mb-4', 'rounded', 'bg-white');
                div.innerHTML = `
                    <p><strong>Tanggal:</strong> ${entry.Tanggal_Kunjungan}</p>
                    <p><strong>Diagnosa:</strong> ${entry.Diagnosa}</p>
                    <p><strong>Poli:</strong> ${entry.Poli}</p>
                    <p><strong>Resep:</strong> ${entry.Resep}</p>
                    <p><strong>Obat:</strong> ${entry.Obat}</p>
                    <p><strong>Dokter:</strong> ${entry.Dokter}</p>
                `;
                riwayatContainer.appendChild(div);
            });
        } else {
            riwayatContainer.innerHTML = '<p class="text-gray-500">Riwayat penyakit tidak ditemukan.</p>';
        }

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

window.onload = loadData;
