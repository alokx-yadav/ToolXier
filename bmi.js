function calculateBMI() {
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const result = document.getElementById("result");

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    result.innerHTML = "❌ Please enter valid height and weight.";
    result.style.color = "red";
    return;
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters ** 2);
  const roundedBMI = bmi.toFixed(1);

  let category = "";
  let color = "";

  if (bmi < 18.5) {
    category = "Underweight";
    color = "#ff9800";
  } else if (bmi < 25) {
    category = "Normal weight";
    color = "#4caf50";
  } else if (bmi < 30) {
    category = "Overweight";
    color = "#ffc107";
  } else if (bmi < 35) {
    category = "Obese";
    color = "#f44336";
  } else {
    category = "Extremely Obese";
    color = "#d32f2f";
  }

  result.style.color = color;
  result.innerHTML = `Your BMI is <strong>${roundedBMI}</strong> (${category})`;
}
