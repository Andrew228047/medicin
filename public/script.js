// Завантаження пацієнтів із localStorage
let patients = JSON.parse(localStorage.getItem("patients")) || [];

// Отримання елементів DOM
const tableBody = document.querySelector("#patients-table tbody");
const modal = new bootstrap.Modal(document.getElementById("patient-modal"));
const patientForm = document.getElementById("patient-form");

const nameInput = document.getElementById("patient-name");
const ageInput = document.getElementById("patient-age");
const contactInput = document.getElementById("patient-contact");
const visitInput = document.getElementById("patient-visit");
const diseaseInput = document.getElementById("patient-disease");

let editingPatientId = null; // Для режиму редагування

// Збереження пацієнтів у localStorage
function saveToLocalStorage() {
  localStorage.setItem("patients", JSON.stringify(patients));
}

// Відображення списку пацієнтів
function renderPatients() {
  tableBody.innerHTML = ""; // Очищаємо таблицю перед рендерингом
  patients.forEach(patient => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><a href="details.html?id=${patient.id}" class="patient-link">${patient.name}</a></td>
      <td>${patient.age}</td>
      <td>${patient.contact}</td>
      <td>${patient.lastVisit}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editPatient(${patient.id})">✏️ Редагувати</button>
        <button class="btn btn-danger btn-sm" onclick="deletePatient(${patient.id})">🗑️ Видалити</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Додавання нового пацієнта
function addPatient(patient) {
  patient.id = Date.now(); // Генеруємо унікальний ID
  patients.push(patient);
  saveToLocalStorage();
  renderPatients();
}

// Редагування пацієнта
function editPatient(id) {
  const patient = patients.find(p => p.id === id);
  if (!patient) return;

  // Заповнення форми даними пацієнта
  nameInput.value = patient.name;
  ageInput.value = patient.age;
  contactInput.value = patient.contact;
  visitInput.value = patient.lastVisit;
  diseaseInput.value = patient.disease || "";

  editingPatientId = id;
  modal.show(); // Відкриваємо модальне вікно
}

// Видалення пацієнта
function deletePatient(id) {
  patients = patients.filter(patient => patient.id !== id);
  saveToLocalStorage();
  renderPatients();
}

// Збереження змін або нового пацієнта
function savePatient(event) {
  event.preventDefault();

  const newPatient = {
    name: nameInput.value,
    age: parseInt(ageInput.value),
    contact: contactInput.value,
    lastVisit: visitInput.value,
    disease: diseaseInput.value || "Інформація відсутня"
  };

  if (editingPatientId) {
    // Оновлення існуючого пацієнта
    patients = patients.map(patient =>
      patient.id === editingPatientId ? { ...newPatient, id: patient.id } : patient
    );
  } else {
    // Додавання нового пацієнта
    addPatient(newPatient);
  }

  saveToLocalStorage();
  modal.hide(); // Закриваємо модальне вікно
  editingPatientId = null;
  patientForm.reset(); // Очищуємо форму
}

// Події
document.getElementById("add-patient-btn").addEventListener("click", () => {
  editingPatientId = null; // Очищуємо режим редагування
  patientForm.reset(); // Очищуємо форму
  modal.show(); // Відкриваємо модальне вікно
});

patientForm.addEventListener("submit", savePatient);

// Початковий рендеринг пацієнтів
renderPatients();
