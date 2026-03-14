const uploadImage = document.getElementById("uploadImage");
const dropZone = document.getElementById("dropZone");
const fileName = document.getElementById("fileName");
const outputPreview = document.getElementById("outputPreview");
const targetSize = document.getElementById("targetSize");
const unit = document.getElementById("unit");
const compressBtn = document.getElementById("compressBtn");
const outputSection = document.getElementById("outputSection");
const downloadPng = document.getElementById("downloadPng");
const downloadJpg = document.getElementById("downloadJpg");
const downloadPdf = document.getElementById("downloadPdf");

let originalData = "";
let compressedBlob = null;

function handleImage(file) {
  const maxSizeMB = 5;
  if (!file.type.startsWith("image/")) return alert("Please select an image.");
  if (file.size > maxSizeMB * 1024 * 1024) {
    alert(`Max file size is ${maxSizeMB} MB`);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    originalData = reader.result;
    fileName.textContent = file.name;
  };
  reader.readAsDataURL(file);
}

// Input select
uploadImage.onchange = (e) => {
  const file = e.target.files[0];
  if (file) handleImage(file);
};

// Drag and drop
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file) handleImage(file);
});

compressBtn.onclick = () => {
  if (!originalData) return alert("Please upload an image first.");

  const img = new Image();
  img.src = originalData;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const maxSize = parseFloat(targetSize.value) * (unit.value === "MB" ? 1024 * 1024 : 1024);
    let quality = 0.95;
    let dataUrl;
    let estimatedSize;

    do {
      dataUrl = canvas.toDataURL("image/jpeg", quality);
      estimatedSize = Math.round((dataUrl.length * (3 / 4)));
      quality -= 0.05;
    } while (estimatedSize > maxSize && quality > 0.05);

    outputPreview.innerHTML = `<img src="${dataUrl}" alt="Compressed Image" />`;
    outputSection.style.display = "block";

    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => compressedBlob = blob);
  };
};

downloadPng.onclick = () => {
  if (!compressedBlob) return alert("Compress image first.");
  const img = new Image();
  img.src = URL.createObjectURL(compressedBlob);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);
    const pngUrl = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = "compressed.png";
    a.click();
  };
};

downloadJpg.onclick = () => {
  if (!compressedBlob) return alert("Compress image first.");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(compressedBlob);
  a.download = "compressed.jpg";
  a.click();
};

downloadPdf.onclick = () => {
  if (!compressedBlob) return alert("Compress image first.");
  const reader = new FileReader();
  reader.onload = () => {
    const pdf = new window.jspdf.jsPDF();
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      const width = pdf.internal.pageSize.getWidth();
      const height = (img.height / img.width) * width;
      pdf.addImage(img, 'JPEG', 0, 0, width, height);
      pdf.save('compressed.pdf');
    };
  };
  reader.readAsDataURL(compressedBlob);
};

const resetBtn = document.getElementById("resetBtn");

resetBtn.onclick = () => {
  compressedBlob = null;
  originalData = "";
  uploadImage.value = "";
  fileName.textContent = "No file selected";
  outputPreview.innerHTML = "";
  outputSection.style.display = "none";
  targetSize.value = "";
};
