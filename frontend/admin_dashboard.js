// ✅ Check admin login
const adminId = localStorage.getItem("adminId");
if(!adminId){
    alert("Admin not logged in!");
    window.location.href = "/frontend/login_registration_page.html";
}

// ✅ Show sections
function showSection(sectionId){
    document.querySelectorAll('.section').forEach(s => s.style.display='none');
    document.getElementById(sectionId).style.display='block';
}
showSection('profile');

// ✅ Fetch and display users
async function loadUsers(){
    try {
        const res = await fetch('http://localhost:8080/api/users');
        const users = await res.json();
        const tbody = document.querySelector('#userTable tbody');
        tbody.innerHTML = '';
        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${u.id}</td><td>${u.username}</td><td>${u.email || '-'}</td><td>${u.role}</td>`;
            tbody.appendChild(tr);
        });
    } catch(err){
        console.error("Error loading users:", err);
    }
}

// ✅ Fetch and display SOS alerts with Message column
async function loadAlerts(){
    try {
        const res = await fetch('http://localhost:8080/api/alerts');
        const alerts = await res.json();
        const tbody = document.querySelector('#alertsTable tbody');
        tbody.innerHTML = '';
        alerts.forEach(a => {
            const tr = document.createElement('tr');
            // Set row class based on priority
            tr.className = a.priority.toLowerCase() === 'urgent' ? 'alert-urgent' : 
                           a.priority.toLowerCase() === 'pending' ? 'alert-pending' : 'alert-resolved';
            tr.innerHTML = `
                <td>${a.id}</td>
                <td>${a.username}</td>
                <td>${a.location}</td>
                <td>${a.message || '-'}</td>  <!-- ✅ Message column -->
                <td>${a.priority}</td>
                <td>${new Date(a.created_at).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch(err){
        console.error("Error loading alerts:", err);
    }
}

// ✅ Fetch and display police stations
async function loadStations(){
    try {
        const res = await fetch('http://localhost:8080/api/stations');
        const stations = await res.json();
        const tbody = document.querySelector('#stationTable tbody');
        tbody.innerHTML = '';
        stations.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.name}</td>
                <td>${s.address}</td>
                <td>${s.mobile || '-'}</td>
                <td>${s.email || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch(err){
        console.error("Error loading stations:", err);
    }
}

// ✅ Logout
function logout(){
    localStorage.removeItem("adminId");
    window.location.href = "/frontend/login_registration_page.html";
}

// ✅ Initial load
loadUsers();
loadAlerts();
loadStations();
setInterval(loadAlerts, 5000); // refresh SOS alerts every 5 sec
