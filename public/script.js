// Завантаження пацієнтів через API
async function fetchPatients() {
  try {
    const response = await fetch('/api/patients');
    const data = await response.json();
    renderPatients(data);
  } catch (error) {
    console.error('Помилка при завантаженні пацієнтів:', error);
  }
}

// Відображення пацієнтів на сторінці
function renderPatients(patients) {
  const tableBody = document.querySelector("#patients-table tbody");
  tableBody.innerHTML = ""; // Очищаємо таблицю перед рендерингом

  patients.forEach(patient => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><a> ${patient.name}</a></td>
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
function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Додавання нового пацієнта через API
async function addPatient(patient) {
  try {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patient)
    });

    const newPatient = await response.json();
    renderPatients([newPatient]);
  } catch (error) {
    console.error('Помилка при додаванні пацієнта:', error);
  }
}

// Збереження пацієнта (новий або відредагований)
async function savePatient(event) {
  event.preventDefault();

  const newPatient = {
    name: document.getElementById("patient-name").value,
    age: parseInt(document.getElementById("patient-age").value),
    contact: document.getElementById("patient-contact").value,
    lastVisit: document.getElementById("patient-visit").value,
    disease: document.getElementById("patient-disease").value || "Інформація відсутня"
  };

  if (editingPatientId) {
    // Оновлення існуючого пацієнта через API
    await updatePatient(editingPatientId, newPatient);
  } else {
    // Додавання нового пацієнта через API
    await addPatient(newPatient);
  }

  // Закриваємо модальне вікно після збереження
  const modal = new bootstrap.Modal(document.getElementById("patient-modal"));
  modal.hide();
  patientForm.reset(); // Очищуємо форму
  editingPatientId = null;
}

// Оновлення існуючого пацієнта через API
async function updatePatient(id, patient) {
  try {
    const response = await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patient)
    });

    const updatedPatient = await response.json();
    fetchPatients(); // Оновлюємо список пацієнтів після оновлення
  } catch (error) {
    console.error('Помилка при оновленні пацієнта:', error);
  }
}

// Редагування пацієнта
function editPatient(id) {
  editingPatientId = id;

  // Отримуємо дані пацієнта для редагування
  fetch(`/api/patients/${id}`)
    .then(response => response.json())
    .then(patient => {
      document.getElementById("patient-name").value = patient.name;
      document.getElementById("patient-age").value = patient.age;
      document.getElementById("patient-contact").value = patient.contact;
      document.getElementById("patient-visit").value = patient.lastVisit;
      document.getElementById("patient-disease").value = patient.disease || "";
      const modal = new bootstrap.Modal(document.getElementById("patient-modal"));
      modal.show(); // Відкриваємо модальне вікно
    })
    .catch(error => console.error('Помилка при отриманні пацієнта:', error));
}

// Видалення пацієнта
async function deletePatient(id) {
  try {
    await fetch(`/api/patients/${id}`, {
      method: 'DELETE'
    });
    fetchPatients(); // Оновлюємо список пацієнтів після видалення
  } catch (error) {
    console.error('Помилка при видаленні пацієнта:', error);
  }
}
function renderPatients(patients) {
  const tableBody = document.querySelector("#patients-table tbody");
  tableBody.innerHTML = ""; // Очищення таблиці

  patients.forEach(patient => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><a href="/patient.html?id=${patient.id}">${patient.name}</a></td>
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


// Події
document.getElementById("add-patient-btn").addEventListener("click", () => {
  editingPatientId = null; // Очищаємо режим редагування
  document.getElementById("patient-form").reset(); // Очищуємо форму
  const modal = new bootstrap.Modal(document.getElementById("patient-modal"));
  modal.show(); // Відкриваємо модальне вікно
});

document.getElementById("patient-form").addEventListener("submit", savePatient);

// Початковий рендеринг пацієнтів
fetchPatients();
