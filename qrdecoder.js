const fileInput = document.getElementById('file-input');
const previewImg = document.getElementById('preview-img');
const canvas = document.getElementById('qr-canvas');
const ctx = canvas.getContext('2d');
const qrResult = document.getElementById('qr-result');
const startCamera = document.getElementById('start-camera');
const resetBtn = document.getElementById('reset-btn');
const copyBtn = document.getElementById('copy-btn');
const video = document.getElementById('video');

let stream = null;
let scanning = false;

// ----------- Image Upload -------------
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      previewImg.src = img.src;
      previewImg.style.display = "block";

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      qrResult.textContent = code?.data || "No QR code found!";
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// ----------- Start Camera -------------
startCamera.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // iOS
    video.style.display = "block";
    scanning = true;
    scanCamera();
  } catch (error) {
    alert("Camera access denied or not available.");
  }
});

// ----------- Camera Scanner Loop -------------
function scanCamera() {
  if (!scanning) return;

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      qrResult.textContent = code.data;
      scanning = false;
      stopCamera();
      return;
    }
  }

  requestAnimationFrame(scanCamera);
}

// ----------- Stop Camera -------------
function stopCamera() {
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }
  video.style.display = "none";
}

// ----------- Reset Button -------------
resetBtn.addEventListener('click', () => {
  fileInput.value = '';
  previewImg.src = '';
  previewImg.style.display = 'none';
  qrResult.textContent = 'No result yet...';
  stopCamera();
});

// ----------- Copy to Clipboard -------------
copyBtn.addEventListener('click', () => {
  const text = qrResult.textContent;
  if (text && text !== 'No result yet...') {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  }
});
