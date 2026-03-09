let lang = "tr";

const t = {
  tr: {
    title: "Sistem İzleme Paneli",
    subtitle: "Gerçek veri ile beslenen servis durum paneli.",
    overallOk: "Tüm Sistemler Çalışıyor",
    overallWarn: "Kısmi Servis Sorunu",
    overallDown: "Kritik Servis Problemi",
    overallSubOk: "Tüm servisler genel olarak erişilebilir durumda.",
    overallSubWarn: "Bazı servislerde bakım veya erişim sorunu bulunuyor.",
    overallSubDown: "Bir veya daha fazla servis şu anda çalışmıyor.",
    active: "Aktif",
    maintenance: "Bakımda",
    down: "Çalışmıyor",
    badge: "Canlı Veri",
    metaLeft: "bölge",
    metaRight: "güncelleme",
    desc: "API üzerinden anlık saat verisi çekiliyor"
  },
  en: {
    title: "System Status Panel",
    subtitle: "System status panel powered by live API data.",
    overallOk: "All Systems Operational",
    overallWarn: "Partial Service Disruption",
    overallDown: "Critical Service Issue",
    overallSubOk: "All services are generally accessible.",
    overallSubWarn: "Some services are under maintenance or partially affected.",
    overallSubDown: "One or more services are currently unavailable.",
    active: "Active",
    maintenance: "Maintenance",
    down: "Down",
    badge: "Live Data",
    metaLeft: "zone",
    metaRight: "updated",
    desc: "Live time data is fetched from API"
  }
};

// Şimdilik servis isimlerini koruyoruz, sadece gerçek veri kaynağı ekliyoruz
const services = [
  {
    name: "AI Music Engine",
    timezone: "Europe/Istanbul",
    status: "active",
    currentTime: "--:--:--",
    updatedAt: "--:--:--"
  },
  {
    name: "Data Analyzer",
    timezone: "Europe/London",
    status: "active",
    currentTime: "--:--:--",
    updatedAt: "--:--:--"
  },
  {
    name: "User Database",
    timezone: "America/New_York",
    status: "maintenance",
    currentTime: "--:--:--",
    updatedAt: "--:--:--"
  },
  {
    name: "System Cloud",
    timezone: "Asia/Tokyo",
    status: "active",
    currentTime: "--:--:--",
    updatedAt: "--:--:--"
  }
];

function getStatusText(status){
  if(status === "active") return t[lang].active;
  if(status === "maintenance") return t[lang].maintenance;
  return t[lang].down;
}

function getStatusColor(status){
  if(status === "active") return "green";
  if(status === "maintenance") return "yellow";
  return "red";
}

function getCardClass(status){
  if(status === "maintenance") return "yellowCard";
  if(status === "down") return "redCard";
  return "";
}

function formatTimeFromDatetime(datetimeString){
  const date = new Date(datetimeString);
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

async function fetchServiceData(service){
  try {
    const response = await fetch(`https://worldtimeapi.org/api/timezone/${service.timezone}`);

    if (!response.ok) {
      throw new Error("API error");
    }

    const data = await response.json();

    service.currentTime = formatTimeFromDatetime(data.datetime);
    service.updatedAt = new Date().toLocaleTimeString("tr-TR");
    
    // User Database'i örnek olarak bakımda bırakıyoruz
    if (service.name === "User Database") {
      service.status = "maintenance";
    } else {
      service.status = "active";
    }

  } catch (error) {
    service.status = "down";
    service.currentTime = "--:--:--";
    service.updatedAt = new Date().toLocaleTimeString("tr-TR");
  }
}

async function refreshAllServices(){
  await Promise.all(services.map(fetchServiceData));
  render();
}

function renderOverall(){
  const hasDown = services.some(s => s.status === "down");
  const hasMaintenance = services.some(s => s.status === "maintenance");

  const overallTitle = document.getElementById("overallTitle");
  const overallSub = document.getElementById("overallSub");
  const overallDot = document.getElementById("overallDot");

  overallDot.className = "dot";

  if(hasDown){
    overallTitle.textContent = t[lang].overallDown;
    overallSub.textContent = t[lang].overallSubDown;
    overallDot.classList.add("red");
  } else if(hasMaintenance){
    overallTitle.textContent = t[lang].overallWarn;
    overallSub.textContent = t[lang].overallSubWarn;
    overallDot.classList.add("yellow");
  } else {
    overallTitle.textContent = t[lang].overallOk;
    overallSub.textContent = t[lang].overallSubOk;
    overallDot.classList.add("green");
  }
}

function render(){
  document.getElementById("title").textContent = t[lang].title;
  document.getElementById("subtitle").textContent = t[lang].subtitle;

  const grid = document.getElementById("grid");

  grid.innerHTML = services.map(s => {
    const dot = getStatusColor(s.status);
    const statusText = getStatusText(s.status);
    const cardClass = getCardClass(s.status);

    return `
      <article class="card ${cardClass}">
        <div class="row">
          <div class="left">
            <div class="name">${s.name}</div>
            <div class="desc">${t[lang].desc}</div>
          </div>
          <div class="badge">${t[lang].badge}</div>
        </div>

        <div class="statusLine">
          <div class="status">
            <span class="dot ${dot}" aria-hidden="true"></span>
            <span>${statusText}</span>
          </div>

          <div class="metrics">
            <div>${t[lang].metaLeft}: <code>${s.timezone}</code></div>
            <div>${t[lang].metaRight}: <code>${s.updatedAt}</code></div>
          </div>

          <div class="metrics">
            <div>${lang === "tr" ? "saat" : "time"}: <code>${s.currentTime}</code></div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  renderOverall();
}

document.getElementById("langBtn").onclick = () => {
  lang = lang === "tr" ? "en" : "tr";
  document.getElementById("langBtn").textContent = lang === "tr" ? "EN" : "TR";
  render();
};

function tickHeaderClock(){
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  document.getElementById("clock").textContent =
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

render();
tickHeaderClock();
setInterval(tickHeaderClock, 1000);

// İlk yüklemede veri çek
refreshAllServices();

// Her 60 saniyede bir tekrar çek
setInterval(refreshAllServices, 60000);