
document.addEventListener("DOMContentLoaded", function() {
    
let mediaRecorder;
let audioChunks = [];
const recordButton = document.getElementById("startRecording");
const stopButton = document.getElementById("stopRecording");
const predictRecording = document.getElementById("predictRecording");
const recordedAudio = document.getElementById("recordedAudio");

async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        recordedAudio.src = URL.createObjectURL(audioBlob);
        predictRecording.disabled = false;
    };

    audioChunks = [];
    mediaRecorder.start();
    stopButton.disabled = false;
    recordButton.disabled = true;
}

function stopRecording() {
    mediaRecorder.stop();
    stopButton.disabled = true;
    recordButton.disabled = false;
}

function sendAudioToServer() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append("file", audioBlob, "recorded_audio.wav");
    fetch("/predict/", {
        method: "POST",
        body: formData
    }).then(response => response.text())
      .then(result => {
          // Handle the response from FastAPI (e.g., update the UI with the prediction result)
          // For now, we'll just log it to the console
          console.log(result);
      });
}
//code นี้รันอยู่ไหม
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
predictRecording.addEventListener("click", sendAudioToServer);

});
