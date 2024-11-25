// Отримуємо ID пацієнта з параметрів URL
const urlParams = new URLSearchParams(window.location.search);
const patientId = urlParams.get('id');

// Завантаження даних пацієнта
async function fetchPatientDetails(id) {
  try {
    const response = await fetch(`/api/patients/${id}`);
    if (!response.ok) throw new Error('Помилка при завантаженні деталей пацієнта');
    const patient = await response.json();
    renderPatientDetails(patient);
  } catch (error) {
    console.error('Помилка:', error);
  }
}

// Відображення деталей пацієнта
function renderPatientDetails(patient) {
  document.getElementById('patient-name').textContent = patient.name;
  document.getElementById('patient-age').textContent = patient.age;
  document.getElementById('patient-contact').textContent = patient.contact;
  document.getElementById('patient-last-visit').textContent = patient.lastVisit;
  document.getElementById('patient-disease').textContent = patient.disease || 'Інформація відсутня';
}

// Завантажуємо деталі пацієнта
if (patientId) {
  fetchPatientDetails(patientId);
} else {
  console.error('ID пацієнта не знайдено в URL');
}
