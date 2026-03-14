function getAgeFromDOB(dob) {
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function calculateAge() {
  const input = document.getElementById("dob").value;
  const result = document.getElementById("result");

  if (!input) {
    result.textContent = "Please select your date of birth.";
    result.style.color = "var(--result-error)";
    return;
  }

  const dob = new Date(input);
  const year = dob.getFullYear();

  // Validate year is exactly 4 digits
  if (!/^\d{4}$/.test(String(year))) {
    result.textContent = "Year must be exactly 4 digits.";
    result.style.color = "var(--result-error)";
    return;
  }

  const today = new Date();
  if (dob > today) {
    result.textContent = "DOB cannot be in the future.";
    result.style.color = "var(--result-error)";
    return;
  }

  const { years, months, days } = getAgeFromDOB(dob);
  result.textContent = `You are ${years} year(s), ${months} month(s), and ${days} day(s) old.`;
  result.style.color = "var(--result-success)";
}

// Attach event listener
document.getElementById("calculate-btn").addEventListener("click", calculateAge);
