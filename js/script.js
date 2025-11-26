const form = document.getElementById("attendance-form");
const input = document.getElementById("student-input");
const list = document.getElementById("attendance-list");
const pdfButton = document.getElementById("generate-pdf");
// Array para almacenar objetos de estudiantes
let students = [];
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = input.value.trim();
  if (name === "") {
    alert("Por favor escribe el nombre del estudiante.");
    return;
  }
  // Verificar si el nombre ya existe
  const exists = students.some((student) => student.name === name);
  if (exists) {
    alert("Este estudiante ya está registrado.");
    return;
  }
  // Agregar estudiante al array (por defecto presente)
  const student = { name: name, present: true };
  students.push(student);

  // Crear elemento de lista
  renderStudent(student);

  // Limpiar input
  input.value = "";
  input.focus();
});

function renderStudent(student) {
  const li = document.createElement("li");
  li.classList.add("student-present");

  const spanName = document.createElement("span");
  spanName.textContent = student.name;
  spanName.classList.add("student-name");

  const actions = document.createElement("div");
  actions.classList.add("student-actions");

  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Marcar Ausente";
  toggleButton.classList.add("btn-toggle");

  toggleButton.addEventListener("click", function () {
    student.present = !student.present;

    if (student.present) {
      li.classList.remove("student-absent");
      li.classList.add("student-present");
      toggleButton.textContent = "Marcar Ausente";
    } else {
      li.classList.remove("student-present");
      li.classList.add("student-absent");
      toggleButton.textContent = "Marcar Presente";
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  deleteButton.classList.add("btn-delete");

  deleteButton.addEventListener("click", function () {
    // Eliminar del array
    const index = students.indexOf(student);
    if (index > -1) {
      students.splice(index, 1);
    }

    // Eliminar del DOM
    list.removeChild(li);
  });

  actions.appendChild(toggleButton);
  actions.appendChild(deleteButton);

  li.appendChild(spanName);
  li.appendChild(actions);

  list.appendChild(li);
}

// Generar PDF
pdfButton.addEventListener("click", function () {
  if (students.length === 0) {
    alert("No hay estudiantes registrados para generar el informe.");
    return;
  }

  // Separar estudiantes presentes y ausentes
  const present = students.filter((s) => s.present);
  const absent = students.filter((s) => !s.present);

  // Crear instancia de jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text("Informe de Asistencias", 105, 20, { align: "center" });

  // Fecha y hora
  const now = new Date();
  const dateString = now.toLocaleDateString("es-ES");
  const timeString = now.toLocaleTimeString("es-ES");
  doc.setFontSize(10);
  doc.text(`Fecha: ${dateString} - Hora: ${timeString}`, 105, 30, {
    align: "center",
  });

  let yPosition = 45;

  // Estudiantes Presentes
  doc.setFontSize(14);
  doc.setTextColor(76, 175, 80); // Verde
  doc.text("Estudiantes Presentes:", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Negro

  if (present.length === 0) {
    doc.text("- Ninguno", 25, yPosition);
    yPosition += 8;
  } else {
    present.forEach((student, index) => {
      doc.text(`${index + 1}. ${student.name}`, 25, yPosition);
      yPosition += 8;
    });
  }

  yPosition += 10;

  // Estudiantes Ausentes
  doc.setFontSize(14);
  doc.setTextColor(244, 67, 54); // Rojo
  doc.text("Estudiantes Ausentes:", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Negro

  if (absent.length === 0) {
    doc.text("- Ninguno", 25, yPosition);
    yPosition += 8;
  } else {
    absent.forEach((student, index) => {
      doc.text(`${index + 1}. ${student.name}`, 25, yPosition);
      yPosition += 8;
    });
  }
  // Resumen
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de estudiantes: ${students.length}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Presentes: ${present.length}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Ausentes: ${absent.length}`, 20, yPosition);
  // Descargar PDF
  doc.save("informe-asistencias.pdf");
});
