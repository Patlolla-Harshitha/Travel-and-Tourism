// ========== Distance + Expenses ==========
async function calculateDistance() {
  const start = document.getElementById("startLocation").value;
  const dest = document.getElementById("destination").value;
  const mode = document.getElementById("mode").value;

  const startCoords = await getCoordinates(start);
  const destCoords = await getCoordinates(dest);

  if (!startCoords || !destCoords) {
    document.getElementById("resultText").innerText = "Error: Could not fetch locations.";
    return;
  }

  const distance = getDistance(startCoords, destCoords);
  displayDistanceAndExpenses(distance, mode, start, dest);
}

async function getCoordinates(place) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`);
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  }
  return null;
}
function getDistance(c1, c2) {
  const R = 6371;
  const dLat = (c2.lat - c1.lat) * Math.PI/180;
  const dLon = (c2.lon - c1.lon) * Math.PI/180;
  const lat1 = c1.lat * Math.PI/180;
  const lat2 = c2.lat * Math.PI/180;

  const a = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function displayDistanceAndExpenses(km, mode, start, dest) {
  let costPerKm = {car:10, train:5, bus:3, flight:20}[mode] || 0;
  const total = km * costPerKm;
  document.getElementById("resultText").innerText = 
    `Estimated cost from ${start} to ${dest} by ${mode}: ₹${total.toFixed(2)}`;
  document.getElementById("distanceText").innerText = `Distance: ${km.toFixed(2)} km`;
}

// ========== Navigation ==========
function showNextInterface() {
  document.getElementById("interface1").style.display = "none";
  document.getElementById("interface2").style.display = "block";
}
function showPreviousInterface() {
  document.getElementById("interface2").style.display = "none";
  document.getElementById("interface1").style.display = "block";
}
function showPreviousInterfaceFromLocalServices() {
  document.getElementById("localServicesInterface").style.display="none";
  document.getElementById("interface2").style.display="block";
}
function showPreviousInterfaceFromTransportFacilities() {
  document.getElementById("transportFacilitiesInterface").style.display="none";
  document.getElementById("interface2").style.display="block";
}
function showPreviousInterfaceFromEmergency() {
  document.getElementById("emergencyInterface").style.display="none";
  document.getElementById("localServicesInterface").style.display="block";
}
function showPreviousInterfaceFromWeather() {
  document.getElementById("weatherInterface").style.display="none";
  document.getElementById("interface2").style.display="block";
}
function showPreviousInterfaceFromCurrency() {
  document.getElementById("currencyInterface").style.display="none";
  document.getElementById("interface2").style.display="block";
}
function showPreviousInterfaceFromCarbon() {
  document.getElementById("carbonInterface").style.display="none";
  document.getElementById("interface2").style.display="block";
}
function showPreviousInterfaceFromPlaces() {
  document.getElementById("placesInterface").style.display="none";
  document.getElementById("interface2").style.display="block";
}

// ========== Services ==========
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.icon').forEach(icon=>{
    icon.addEventListener('click', async()=>{
      switch(icon.id) {
        case 'hotel': window.open('https://www.booking.com','_blank'); break;
        case 'transport': toggleView("interface2","transportFacilitiesInterface"); break;
        case 'services': toggleView("interface2","localServicesInterface"); break;
        case 'weather': showWeather(); break;
        case 'currency': showCurrency(); break;
        case 'carbon': showCarbon(); break;
        case 'places': showPlaces(); break;
        case 'food': window.open('https://www.zomato.com','_blank'); break;
        case 'emergencyContacts': toggleView("localServicesInterface","emergencyInterface"); break;
        case 'regionalTraveling': window.open('https://www.olacabs.com','_blank'); break;
        case 'instantBooking': window.open('https://www.abhibus.com','_blank'); break;
        case 'carRenting': window.open('https://www.zoomcar.com','_blank'); break;
      }
    });
  });
});
function toggleView(hide, show) {
  document.getElementById(hide).style.display="none";
  document.getElementById(show).style.display="block";
}

// ========== API Features ==========
async function showWeather() {
  const dest = document.getElementById("destination").value;
  if (!dest) { alert("Enter destination first!"); return; }
  toggleView("interface2","weatherInterface");
  const res = await fetch(`https://wttr.in/${encodeURIComponent(dest)}?format=%C+%t`);
  const text = await res.text();
  document.getElementById("weatherData").innerText = `Weather in ${dest}: ${text}`;
}
async function showCurrency() {
  toggleView("interface2","currencyInterface");
  const res = await fetch("https://api.exchangerate.host/latest?base=INR&symbols=USD,EUR,GBP");
  const data = await res.json();
  document.getElementById("currencyData").innerText =
    `1 INR = ${data.rates.USD.toFixed(2)} USD | ${data.rates.EUR.toFixed(2)} EUR | ${data.rates.GBP.toFixed(2)} GBP`;
}
async function showCarbon() {
  toggleView("interface2","carbonInterface");
  const mode = document.getElementById("mode").value;
  const km = parseFloat(document.getElementById("distanceText").innerText.replace(/[^0-9.]/g,'')) || 0;
  let factor = {car:0.12, bus:0.05, train:0.04, flight:0.18}[mode] || 0.1;
  document.getElementById("carbonData").innerText = 
    `Your trip emits about ${(km*factor).toFixed(2)} kg CO₂`;
}
function showPlaces() {
  toggleView("interface2","placesInterface");
  const dest = document.getElementById("destination").value.toLowerCase();
  const placesData = {
    paris:["Eiffel Tower","Louvre Museum","Notre-Dame Cathedral"],
    london:["Big Ben","Tower Bridge","London Eye"],
    delhi:["India Gate","Red Fort","Lotus Temple"],
    newyork:["Statue of Liberty","Central Park","Times Square"]
  };
  const list = document.getElementById("placesList");
  list.innerHTML = "";
  (placesData[dest]||["No famous places found"]).forEach(p=>{
    const li=document.createElement("li"); li.textContent=p; list.appendChild(li);
  });
}