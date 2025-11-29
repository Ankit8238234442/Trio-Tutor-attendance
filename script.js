let home = document.getElementById("home");
let attendanceSection = document.getElementById("attendanceSection");
let addStudentSection = document.getElementById("addStudentSection");
let currentClass = "";

const tbody = document.getElementById("attendanceTbody");

// ---------- HOME MENU ----------
document.querySelectorAll(".class-btn").forEach(btn => {
  btn.addEventListener("click", ()=>{
    currentClass = btn.dataset.class;
    document.getElementById("attendanceTitle").textContent = currentClass;
    home.classList.add("hidden");
    attendanceSection.classList.remove("hidden");
    loadAttendanceClass();
  });
});

document.getElementById("goAddStudent").addEventListener("click", ()=>{
  const selectedClass = document.getElementById("addClassSelect").value;
  if(!selectedClass){ alert("Select class first"); return; }
  currentClass = selectedClass;
  document.getElementById("addStudentTitle").textContent = "Add Student to "+currentClass;
  home.classList.add("hidden");
  addStudentSection.classList.remove("hidden");
});

// ---------- ADD STUDENT ----------
document.getElementById("addStudentHome").addEventListener("click", ()=>{
  const name = document.getElementById("newStudentName").value.trim();
  const phone = document.getElementById("newStudentPhone").value.trim();
  if(!name || !phone){ alert("Enter name and phone"); return; }

  let data = JSON.parse(localStorage.getItem(currentClass)) || [];
  data.push({ name, phone, status: "Present" });
  localStorage.setItem(currentClass, JSON.stringify(data));
  alert("Student added successfully!");
  document.getElementById("newStudentName").value="";
  document.getElementById("newStudentPhone").value="+91";
});

// ---------- ATTENDANCE ----------
function loadAttendanceClass(){
  tbody.innerHTML="";
  let students = JSON.parse(localStorage.getItem(currentClass)) || [];
  students.forEach((s, i)=>{
    let row = `<tr>
      <td>${i+1}</td>
      <td>${s.name}</td>
      <td>${s.phone}</td>
      <td>
        <select class="status" data-index="${i}">
          <option ${s.status=="Present"?"selected":""}>Present</option>
          <option ${s.status=="Absent"?"selected":""}>Absent</option>
        </select>
      </td>
      <td><button class="deleteBtn" data-index="${i}">❌</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Update status
tbody.addEventListener("change", e=>{
  if(e.target.classList.contains("status")){
    let students = JSON.parse(localStorage.getItem(currentClass)) || [];
    let index = e.target.dataset.index;
    students[index].status = e.target.value;
    localStorage.setItem(currentClass, JSON.stringify(students));
  }
});

// Delete student
tbody.addEventListener("click", e=>{
  if(e.target.classList.contains("deleteBtn")){
    let students = JSON.parse(localStorage.getItem(currentClass)) || [];
    students.splice(e.target.dataset.index,1);
    localStorage.setItem(currentClass, JSON.stringify(students));
    loadAttendanceClass();
  }
});

// Save Attendance
document.getElementById("saveAttendance").addEventListener("click", ()=>{
  alert("Attendance saved for "+currentClass);
});

// WhatsApp
document.getElementById("sendWhatsApp").addEventListener("click", ()=>{
  let students = JSON.parse(localStorage.getItem(currentClass)) || [];
  let absentees = students.filter(s => s.status==="Absent");
  if(absentees.length===0){ alert("No absent students"); return; }
  let msg = absentees.map(s => `Your child ${s.name} was absent today.`).join("\n");
  msg += "\n\n✅ Powered by Vraksh Enterprises";
  const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
});
document.getElementById("sendWhatsApp").addEventListener("click", () => {
  let students = JSON.parse(localStorage.getItem(currentClass)) || [];
  let absentees = students.filter(s => s.status === "Absent");
  
  if (absentees.length === 0) {
    alert("No absent students today!");
    return;
  }

  absentees.forEach((student, index) => {
    setTimeout(() => {
      const message = `Dear Parent,\nYour child ${student.name} was absent today.\n\nPowered by Vraksh Enterprises 🌿`;
      const phone = student.phone.replace(/\s+/g, '');
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    }, index * 2000); // opens each chat 2 seconds apart
  });
});


// Export Excel
document.getElementById("exportExcel").addEventListener("click", ()=>{
  let students = JSON.parse(localStorage.getItem(currentClass)) || [];
  if(students.length===0){ alert("No data to export"); return; }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(students);
  XLSX.utils.book_append_sheet(wb, ws, currentClass);
  XLSX.writeFile(wb, currentClass+"_Attendance.xlsx");
});

// Clear Attendance
document.getElementById("clearAttendance").addEventListener("click", ()=>{
  if(confirm("Clear all data for "+currentClass+"?")){
    localStorage.removeItem(currentClass);
    loadAttendanceClass();
  }
});

// Back buttons
document.getElementById("backAttendance").addEventListener("click", ()=>{
  attendanceSection.classList.add("hidden");
  home.classList.remove("hidden");
});
document.getElementById("backAddStudent").addEventListener("click", ()=>{
  addStudentSection.classList.add("hidden");
  home.classList.remove("hidden");
});
