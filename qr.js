let qrcode;

function generateQR() {
  const input = document.getElementById('qrInput').value.trim();
  const qrBox = document.getElementById('qrBox');

  if (!input) {
    alert("Please enter or paste something!");
    return;
  }

  document.getElementById("qrcode").innerHTML = "";

  qrcode = new QRCode(document.getElementById("qrcode"), {
    text: input,
    width: 200,
    height: 200,
    colorDark: "#000428",
    colorLight: "#f8fafc",
    correctLevel: QRCode.CorrectLevel.H
  });

  qrBox.classList.remove("hidden");
}

function downloadQR() {
  const canvas = document.querySelector("#qrcode canvas");
  if (canvas) {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-code.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}

function shareQR() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!navigator.share || !canvas) {
    alert("Sharing not supported on this browser.");
    return;
  }

  canvas.toBlob((blob) => {
    const file = new File([blob], "qr-code.png", { type: "image/png" });
    navigator.share({
      title: "QR Code",
      text: "Scan this QR code",
      files: [file]
    });
  });
}

function pasteFromClipboard() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('qrInput').value = text;
  }).catch(err => {
    alert("Clipboard access denied");
  });
}

function resetQR() {
  document.getElementById('qrInput').value = "";
  document.getElementById("qrcode").innerHTML = "";
  document.getElementById("qrBox").classList.add("hidden");
}
