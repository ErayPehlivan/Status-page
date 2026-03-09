let lang = "tr";

const t = {
  tr: {
    title: "Sistem İzleme Paneli",
    subtitle: "Arka planda çalışan servislerin durumunu gösteren görsel prototip.",
    overallOk: "Tüm Sistemler Çalışıyor",
    overallWarn: "Kısmi Servis Sorunu",
    overallDown: "Kritik Servis Problemi",
    overallSubOk: "Tüm servisler genel olarak erişilebilir durumda.",
    overallSubWarn: "Bazı servislerde bakım veya erişim sorunu bulunuyor.",
    overallSubDown: "Bir veya daha fazla servis şu anda çalışmıyor.",
    active: "Aktif",
    maintenance: "Bakımda",
    down: "Çalışmıyor",
    badge: "Canlı Prototip",
    metaLeft: "uptime",
    metaRight: "latency",
    desc: "Durum takibi için görsel servis kartı"
  },
  en: {
    title: "System Status Panel",
    subtitle: "Visual prototype showing background service status.",
    overallOk: "All Systems Operational",
    overallWarn: "Partial Service Disruption",
    overallDown: "Critical Service Issue",
    overallSubOk: "All services are generally accessible.",
    overallSubWarn: "Some services are under maintenance or partially affected.",
    overallSubDown: "One or more services are currently unavailable.",
    active: "Active",
    maintenance: "Maintenance",
    down: "Down",
    badge: "Live Prototype",
    metaLeft: "uptime",
    metaRight: "latency",
    desc: "Visual service card for status tracking"
  }
};

const services = [
  { name: "AI Music Engine", status: "active", uptime: "99.98%", latency: "42ms" },
  { name: "Data Analyzer", status: "active", uptime: "99.95%", latency: "38ms" },
  { name: "User Database", status: "maintenance", uptime: "—", latency: "—" },
  { name: "System Cloud", status: "active", uptime: "100%", latency: "21ms" },
  { name: "Notification Service", status: "active", uptime: "99.91%", latency: "25ms" },
  { name: "API Gateway", status: "active", uptime: "99.97%", latency: "18ms" },
  { name: "Payment Service", status: "down", uptime: "97.40%", latency: "—" },
  { name: "Analytics Engine", status: "active", uptime: "99.89%", latency: "31ms" }
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
            <div>${t[lang].metaLeft}: <code>${s.uptime}</code></div>
            <div>${t[lang].metaRight}: <code>${s.latency}</code></div>
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

function tick(){
  const d = new Date();
  const pad = n => String(n).padStart(2,"0");
  document.getElementById("clock").textContent =
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

render();
tick();
setInterval(tick, 1000);