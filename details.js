const urlParams = new URLSearchParams(window.location.search);
const patientId = parseInt(urlParams.get("id"));

const patients = JSON.parse(localStorage.getItem("patients")) || [];
const patient = patients.find(p => p.id === patientId);

const patientDetails = document.getElementById("patient-details");

if (patient) {
  patientDetails.innerHTML = `
    <h2>${patient.name}</h2>
    <p><strong>Вік:</strong> ${patient.age}</p>
    <p><strong>Контакт:</strong> ${patient.contact}</p>
    <p><strong>Дата останнього візиту:</strong> ${patient.lastVisit}</p>
    <p><strong>Деталі хвороби:</strong> ${patient.disease || "Інформація не вказана"}</p>
    <button onclick="goBack()" class="back-btn">🔙 Назад</button>
  `;
} else {
  patientDetails.innerHTML = `<p>Пацієнт не знайдений.</p>`;
}

function goBack() {
  window.location.href = "index.html";
}
