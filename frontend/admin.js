// Connection Status
async function checkConnection(){
  const statusEl = document.getElementById("connectionStatus");
  try{
    const res = await fetch("/admin/health");
    if(!res.ok) throw new Error("Backend unreachable");
    const data = await res.json();
    statusEl.innerText = `✅ Backend connected | DB Time: ${new Date(data.db_time).toLocaleString()}`;
    statusEl.style.background="#004400";
  } catch(err){
    statusEl.innerText = `❌ Connection failed: ${err.message}`;
    statusEl.style.background="#440000";
  }
}
checkConnection();
setInterval(checkConnection,30000);

// Map Setup
const map = L.map("map").setView([51.3863,0.5210],12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(map);
let markers = [];

// Load Bookings
async function loadBookings(){
  document.getElementById('bookingsList').innerHTML = 'Loading...';
  markers.forEach(m=>map.removeLayer(m));
  markers=[];
  const res = await fetch("/admin/bookings");
  const bookings = await res.json();
  const listEl = document.getElementById('bookingsList');
  listEl.innerHTML='';
  bookings.forEach(b=>{
    const div = document.createElement('div');
    div.innerHTML = `<b>${b.name}</b> | ${b.reg} | ${b.service} | ${b.address} | ${b.lat.toFixed(5)},${b.lng.toFixed(5)}`;
    div.style.padding='0.25rem 0';
    listEl.appendChild(div);
    const marker = L.marker([b.lat,b.lng]).addTo(map).bindPopup(`<b>${b.name}</b><br>${b.service}<br>${b.reg}<br>${b.address}`);
    markers.push(marker);
  });
}

// Reset & Seed DB
document.getElementById('resetDb').addEventListener('click',async()=>{
  if(confirm("Reset & seed DB?")){
    const res = await fetch("/admin/reset-db",{method:'POST'});
    const data = await res.json();
    alert(data.message);
    loadBookings();
  }
});

document.getElementById('loadBookings').addEventListener('click',loadBookings);
loadBookings();

// Load & Save Settings
async function loadSettings(){
  const res = await fetch("/admin/settings");
  const settings = await res.json();
  settings.forEach(s=>{
    if(document.getElementById(s.key)) document.getElementById(s.key).value=s.value;
  });
}
loadSettings();

document.getElementById('saveSettings').addEventListener('click',async()=>{
  const fields = ['callout_fee','max_distance','seo_title','seo_meta_description','seo_keywords'];
  for(const f of fields){
    const val = document.getElementById(f).value;
    await fetch(`/admin/settings`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({key:f,value:val})
    });
  }
  alert('✅ Settings saved');
});