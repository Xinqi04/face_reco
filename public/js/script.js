let model, webcam, labelContainer, maxPredictions;

async function init() {
    console.log("Button clicked!");  
 
    const modelURL = "./my_model/model.json"; // Lokasi file model
    const metadataURL = "./my_model/metadata.json"; // Lokasi file metadata

    try {
        // Memuat model
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Inisialisasi webcam
        const flip = true; // Flip kamera jika perlu
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup();
        await webcam.play();
        document.getElementById("webcam-container").appendChild(webcam.canvas);

        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        // Memulai loop untuk melakukan prediksi
        window.requestAnimationFrame(loop);

    } catch (error) {
        console.error("Error loading model or setting up webcam:", error);
        document.getElementById("error-message").innerText = "Terjadi kesalahan saat memuat model atau webcam.";
    }
};

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let maxAccuracy = 0;
    let predictedClass = "";

    // Menampilkan hasil prediksi
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability;

        labelContainer.childNodes[i].innerHTML = `${className}: ${(probability * 100).toFixed(2)}%`;

        // Mencari prediksi dengan akurasi tertinggi
        if (probability > maxAccuracy) {
            maxAccuracy = probability;
            predictedClass = className;
        }
    }

    // Jika akurasi lebih dari 80%, alihkan ke halaman details.html
    if (maxAccuracy >= 0.85) {
        window.location.href = `./details.html?id=${predictedClass}`;
    }
}
