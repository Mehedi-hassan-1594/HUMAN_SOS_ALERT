// Get logged-in userId from localStorage
const userId = localStorage.getItem("userId");
if(!userId){
  alert("User not logged in!");
  window.location.href = "/frontend/login_registration_page.html";
}

// Load profile
async function loadProfile(){
  try {
    const res = await fetch(`http://localhost:8080/api/users/${userId}`);
    const data = await res.json();
    document.getElementById('username').innerText = data.username;
    document.getElementById('role').innerText = `Role: ${data.role}`;
    document.getElementById('email').innerText = data.email || '-';
    document.getElementById('phone').innerText = data.phone || '-';
    document.getElementById('lastLogin').innerText = data.last_login ? new Date(data.last_login).toLocaleString() : '-';
    document.getElementById('welcomeUser').innerText = `Welcome, ${data.username}`;
  } catch(err){
    console.error("Error loading profile:", err);
  }
}

// Load alerts
async function loadAlerts(){
  try {
    const res = await fetch(`http://localhost:8080/api/users/${userId}/alerts`);
    const alerts = await res.json();
    const tbody = document.querySelector('#alertTable tbody');
    tbody.innerHTML='';
    alerts.forEach(a=>{
      const tr = document.createElement('tr');
      tr.className = `alert-${a.priority}`;
      tr.innerHTML = `<td>${a.id}</td><td>${a.location}</td><td>${a.priority}</td><td>${new Date(a.created_at).toLocaleString()}</td>`;
      tbody.appendChild(tr);
    });
  } catch(err){
    console.error("Error loading alerts:", err);
  }
}

// Send SOS
async function sendSOS(){
  const location = document.getElementById('sosLocation').value;
  const priority = document.getElementById('sosPriority').value;
  if(!location){ alert('Enter location'); return; }
  try {
    await fetch(`http://localhost:8080/api/users/${userId}/alerts`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({location, priority})
    });
    document.getElementById('sosLocation').value='';
    loadAlerts();
    alert("SOS sent successfully!");
  } catch(err){
    console.error("Error sending SOS:", err);
  }
}

// Load police stations
async function loadStations(){
  try {
    const res = await fetch(`http://localhost:8080/api/users/${userId}/stations`);
    const stations = await res.json();
    const tbody = document.querySelector('#stationTable tbody');
    tbody.innerHTML='';
    stations.forEach(s=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${s.name}</td><td>${s.address}</td>`;
      tbody.appendChild(tr);
    });
  } catch(err){
    console.error("Error loading stations:", err);
  }
}

// Logout
function logout(){
  localStorage.removeItem("userId");
  window.location.href = "/frontend/login_registration_page.html";
}

// Initialize
loadProfile();
loadAlerts();
loadStations();
setInterval(loadAlerts, 5000); // Real-time refresh every 5 sec
