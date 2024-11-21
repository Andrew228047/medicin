// Масив пацієнтів
let patients = [
    { id: 1, name: "Олександр Іванов", age: 35, contact: "+380123456789", lastVisit: "2024-11-20" },
    { id: 2, name: "Марія Петрівна", age: 29, contact: "+380987654321", lastVisit: "2024-11-18" },
    { id: 3, name: "Павло Семенюк", age: 40, contact: "+380555555555", lastVisit: "2024-11-15" }
  ];
  
  // DOM елементи
  const tableBody = document.querySelector("#patients-table tbody");
  const modal = document.getElementById("patient-modal");
  const modalTitle = document.getElementById("modal-title");
  const closeModal = document.getElementById("close-modal");
  const patientForm = document.getElementById("patient-form");
  const addPatientBtn = document.getElementById("add-patient-btn");
  
  // Поля форми
  const nameInput = document.getElementById("patient-name");
  const ageInput = document.getElementById("patient-age");
  const contactInput = document.getElementById("patient-contact");
  const visitInput = document.getElementById("patient-visit");
  
  // Змінна для редагування пацієнта
  let editingPatientId = null;
  
  // Рендер таблиці пацієнтів
  function renderPatients() {
    tableBody.innerHTML = "";
    patients.forEach(patient => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${patient.name}</td>
        <td>${patient.age}</td>
        <td>${patient.contact}</td>
        <td>${patient.lastVisit}</td>
        <td>
          <button onclick="editPatient(${patient.id})">✏️ Редагувати</button>
          <button onclick="deletePatient(${patient.id})" style="background-color: red;">🗑️ Видалити</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Додавання нового пацієнта
  function addPatient(patient) {
    patient.id = Date.now();
    patients.push(patient);
    renderPatients();
  }
  
  // Редагування пацієнта
  function editPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (!patient) return;
  
    nameInput.value = patient.name;
    ageInput.value = patient.age;
    contactInput.value = patient.contact;
    visitInput.value = patient.lastVisit;
  
    editingPatientId = id;
    openModal("Редагувати пацієнта");
  }
  
  // Збереження змін
  function savePatient(e) {
    e.preventDefault();
    const newPatient = {
      name: nameInput.value,
      age: parseInt(ageInput.value),
      contact: contactInput.value,
      lastVisit: visitInput.value
    };
  
    if (editingPatientId) {
      patients = patients.map(patient =>
        patient.id === editingPatientId ? { ...newPatient, id: patient.id } : patient
      );
    } else {
      addPatient(newPatient);
    }
  
    closeModalWindow();
  }
  
  // Видалення пацієнта
  function deletePatient(id) {
    patients = patients.filter(patient => patient.id !== id);
    renderPatients();
  }
  
  // Модальне вікно
  function openModal(title) {
    modalTitle.textContent = title;
    modal.style.display = "flex";
  }
  
  function closeModalWindow() {
    modal.style.display = "none";
    patientForm.reset();
    editingPatientId = null;
  }
  
  closeModal.addEventListener("click", closeModalWindow);
  addPatientBtn.addEventListener("click", () => openModal("Додати пацієнта"));
  patientForm.addEventListener("submit", savePatient);
  
  renderPatients();
  