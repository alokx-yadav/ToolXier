function toggleCustomRate(value) {
  const customInput = document.getElementById("customRate");
  if (value === "custom") {
    customInput.style.display = "block";
  } else {
    customInput.style.display = "none";
    customInput.value = "";
  }
}

function calculateGST() {
  const amount = parseFloat(document.getElementById("amount").value);
  const gstRateOption = document.getElementById("gstRate").value;
  const customRate = parseFloat(document.getElementById("customRate").value);
  const taxType = document.getElementById("type").value;

  let gstRate = gstRateOption === "custom" ? customRate : parseFloat(gstRateOption);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  if (gstRateOption === "custom" && (isNaN(customRate) || customRate < 0)) {
    alert("Please enter a valid custom GST rate.");
    return;
  }

  let netAmount, gstAmount, totalAmount;

  if (taxType === "exclusive") {
    gstAmount = (amount * gstRate) / 100;
    netAmount = amount;
    totalAmount = netAmount + gstAmount;
  } else if (taxType === "inclusive") {
    gstAmount = (amount * gstRate) / (100 + gstRate);
    totalAmount = amount;
    netAmount = totalAmount - gstAmount;
  }

  document.getElementById("netAmount").textContent = netAmount.toFixed(2);
  document.getElementById("gstAmount").textContent = gstAmount.toFixed(2);
  document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);
}
