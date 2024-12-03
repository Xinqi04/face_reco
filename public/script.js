let model, webcam, labelContainer, maxPredictions;

async function init() {
    console.log("Button clicked!");  // Cek apakah init dipanggil
    const modelURL = "./my_model/model.json";  // Path ke model Anda
    const metadataURL = "./my_model/metadata.json";  // Path ke metadata model Anda

    try {
        // Memuat model
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;  // Mengaktifkan flip jika perlu
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup();  // Setup webcam
        await webcam.play();  // Mulai webcam

        // Meminta frame per frame untuk prediksi
        window.requestAnimationFrame(loop);

        // Menampilkan video stream dari webcam ke dalam halaman
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        
        // Menyiapkan tempat untuk label prediksi
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

    } catch (error) {
        console.error("Error loading model:", error);
    }
}

async function loop() {
    webcam.update();  // Memperbarui frame dari webcam
    await predict();  // Melakukan prediksi
    window.requestAnimationFrame(loop);  // Lanjutkan proses prediksi
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    
    // Menampilkan prediksi untuk masing-masing kelas
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability;
        
        labelContainer.childNodes[i].innerHTML = className + ": " + probability.toFixed(2);
    }
}
