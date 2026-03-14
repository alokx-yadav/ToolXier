const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileElem");
const resizeBtn = document.getElementById("resizeBtn");
const presetSelect = document.getElementById("presetSelect");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

const downloadJpg = document.getElementById("downloadJpg");
const downloadPng = document.getElementById("downloadPng");
const downloadPdf = document.getElementById("downloadPdf");
const downloadButtons = document.getElementById("downloadButtons");

let selectedImage = null;
let canvasData = null;

dropArea.addEventListener("dragover", e => {
  e.preventDefault();
  dropArea.style.borderColor = "#2196F3";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.borderColor = "#888";
});

dropArea.addEventListener("drop", e => {
  e.preventDefault();
  dropArea.style.borderColor = "#888";
  handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener("change", () => {
  handleFile(fileInput.files[0]);
});

function handleFile(file) {
  if (!file.type.startsWith("image/")) return alert("Invalid image file.");
  if (file.size > 5 * 1024 * 1024) return alert("Max file size is 5MB.");

  const reader = new FileReader();
  reader.onload = () => {
    selectedImage = reader.result;
    resizeBtn.disabled = false;
  };
  reader.readAsDataURL(file);
}

presetSelect.addEventListener("change", () => {
  const value = presetSelect.value;
  if (value) {
    const [w, h] = value.split("x");
    widthInput.value = w;
    heightInput.value = h;
  }
});

resizeBtn.addEventListener("click", () => {
  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);
  if (!width || !height) return alert("Please enter valid width and height.");

  const img = new Image();
  img.src = selectedImage;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    canvasData = canvas;
    downloadButtons.style.display = "block";
  };
});

downloadJpg.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = canvasData.toDataURL("image/jpeg");
  link.download = "resized-image.jpg";
  link.click();
});

downloadPng.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = canvasData.toDataURL("image/png");
  link.download = "resized-image.png";
  link.click();
});

downloadPdf.addEventListener("click", () => {
  const imgData = canvasData.toDataURL("image/jpeg", 0.9);
  const pdf = new window.jspdf.jsPDF();
  pdf.addImage(imgData, 'JPEG', 10, 10, 180, 150);
  pdf.save("resized-image.pdf");
});
