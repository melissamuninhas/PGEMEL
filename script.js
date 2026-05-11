const STORAGE_KEY = "seaCaosDB_v1";

function createDefaultDB() {
  return {
    hero: {
      title: "NA LIVE COM A MELHOR COMUNIDADE!",
      subtitle: "Aqui a bagunca e garantida e as historias ficam ainda melhores juntos.",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1400&auto=format&fit=crop"
    },
    social: {
      discord: "https://discord.com",
      twitch: "https://www.twitch.tv/seacaos1",
      instagram: "https://www.instagram.com",
      twitter: "https://x.com"
    },
    schedule: [
      {
        id: crypto.randomUUID(),
        day: "Segunda",
        date: "2026-05-11",
        image: "https://images.unsplash.com/photo-1489599809927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
        title: "Harry Potter e o Enigma do Principe",
        episodes: "Filme Completo",
        time: "20:30"
      },
      {
        id: crypto.randomUUID(),
        day: "Terca",
        date: "2026-05-12",
        image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop",
        title: "The Walking Dead",
        episodes: "S07E01-E03",
        time: "21:00"
      },
      {
        id: crypto.randomUUID(),
        day: "Quarta",
        date: "2026-05-13",
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1200&auto=format&fit=crop",
        title: "Death Note",
        episodes: "E01-E04",
        time: "20:00"
      },
      {
        id: crypto.randomUUID(),
        day: "Sexta",
        date: "2026-05-15",
        image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1200&auto=format&fit=crop",
        title: "Demon Slayer",
        episodes: "S03E05-E06",
        time: "21:15"
      },
      {
        id: crypto.randomUUID(),
        day: "Domingo",
        date: "2026-05-17",
        image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop",
        title: "A Silent Voice",
        episodes: "Filme Completo",
        time: "19:45"
      }
    ],
    watched: [
      {
        id: crypto.randomUUID(),
        title: "Your Name",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
        rating: 9.4,
        category: "Animes"
      },
      {
        id: crypto.randomUUID(),
        title: "Arcane",
        image: "https://images.unsplash.com/photo-1518182170546-07661fd94144?q=80&w=1200&auto=format&fit=crop",
        rating: 9.1,
        category: "Series"
      },
      {
        id: crypto.randomUUID(),
        title: "Interstellar",
        image: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?q=80&w=1200&auto=format&fit=crop",
        rating: 9.7,
        category: "Filmes"
      },
      {
        id: crypto.randomUUID(),
        title: "Jujutsu Kaisen 0",
        image: "https://images.unsplash.com/photo-1612036782180-6f0822045d01?q=80&w=1200&auto=format&fit=crop",
        rating: 8.7,
        category: "Animes"
      },
      {
        id: crypto.randomUUID(),
        title: "Dark",
        image: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?q=80&w=1200&auto=format&fit=crop",
        rating: 8.9,
        category: "Series"
      }
    ],
    requests: []
  };
}

function loadDB() {
  return window.SeaCaosStore ? window.SeaCaosStore.getCurrent() : createDefaultDB();
}

function saveDB(db) {
  return window.SeaCaosStore ? window.SeaCaosStore.save(db) : Promise.resolve(db);
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const id = "toast-" + crypto.randomUUID();
  const icon = type === "success" ? "fa-circle-check" : type === "danger" ? "fa-circle-xmark" : "fa-circle-info";

  const toastEl = document.createElement("div");
  toastEl.className = "toast align-items-center";
  toastEl.id = id;
  toastEl.role = "alert";
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body"><i class="fa-solid ${icon} me-2"></i>${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 2800 });
  toast.show();
  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

function buildSocialLinks(social) {
  const entries = [
    { key: "discord", icon: "fa-discord" },
    { key: "twitch", icon: "fa-twitch" },
    { key: "instagram", icon: "fa-instagram" },
    { key: "twitter", icon: "fa-x-twitter" }
  ];

  return entries
    .map(({ key, icon }) => `<a class="social-link" href="${social[key]}" target="_blank" rel="noopener noreferrer" aria-label="${key}"><i class="fa-brands ${icon}"></i></a>`)
    .join("");
}

let scheduleSwiper = null;
let watchedSwiper = null;
let db = loadDB();
let currentFilter = "Todos";
let currentSearch = "";

function renderHero() {
  document.getElementById("heroTitle").textContent = db.hero.title;
  document.getElementById("heroSubtitle").textContent = db.hero.subtitle;
  document.getElementById("heroImage").src = db.hero.image;

  document.getElementById("heroTwitchBtn").href = db.social.twitch;
  document.getElementById("heroDiscordBtn").href = db.social.discord;
  document.getElementById("liveButton").href = db.social.twitch;
  document.getElementById("socialLinksHeader").innerHTML = buildSocialLinks(db.social);
  document.getElementById("socialLinksFooter").innerHTML = buildSocialLinks(db.social);
  document.getElementById("weekCount").textContent = db.schedule.length;
}

function openScheduleModal(item) {
  document.getElementById("modalTitle").textContent = item.title;
  document.getElementById("modalBody").innerHTML = `
    <img src="${item.image}" alt="${item.title}" class="img-fluid rounded mb-3" />
    <p><strong>Dia:</strong> ${item.day}</p>
    <p><strong>Data:</strong> ${formatDate(item.date)}</p>
    <p><strong>Episodios:</strong> ${item.episodes}</p>
    <p><strong>Horario:</strong> ${item.time}</p>
  `;
  const modal = new bootstrap.Modal(document.getElementById("scheduleModal"));
  modal.show();
}

function renderSchedule() {
  const skeleton = document.getElementById("scheduleSkeleton");
  const swiperRoot = document.getElementById("scheduleSwiper");
  const wrapper = document.getElementById("scheduleWrapper");

  wrapper.innerHTML = db.schedule
    .map(
      (item) => `
      <div class="swiper-slide">
        <article class="schedule-card" data-id="${item.id}">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <div class="schedule-body">
            <div class="schedule-meta mb-2">
              <span>${item.day}</span>
              <span>${formatDate(item.date)}</span>
            </div>
            <h4 class="h6 mb-2">${item.title}</h4>
            <div class="schedule-meta">
              <span>${item.episodes}</span>
              <span>${item.time}</span>
            </div>
          </div>
        </article>
      </div>
    `
    )
    .join("");

  skeleton.classList.add("d-none");
  swiperRoot.classList.remove("d-none");

  if (scheduleSwiper) {
    scheduleSwiper.destroy(true, true);
  }

  scheduleSwiper = new Swiper(".schedule-swiper", {
    slidesPerView: 1.08,
    spaceBetween: 16,
    pagination: { el: ".schedule-swiper .swiper-pagination", clickable: true },
    breakpoints: {
      576: { slidesPerView: 2.1 },
      992: { slidesPerView: 3.2 },
      1200: { slidesPerView: 4.2 }
    }
  });

  document.querySelectorAll(".schedule-card").forEach((card) => {
    card.addEventListener("click", () => {
      const item = db.schedule.find((s) => s.id === card.dataset.id);
      if (item) openScheduleModal(item);
    });
  });
}

function getFilteredWatched() {
  return db.watched.filter((item) => {
    const matchesFilter = currentFilter === "Todos" || item.category === currentFilter;
    const matchesSearch = item.title.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });
}

function renderWatched() {
  const data = getFilteredWatched();
  const grid = document.getElementById("watchedGrid");
  const wrapper = document.getElementById("watchedWrapper");

  if (!data.length) {
    grid.innerHTML = `<div class="col-12"><div class="glass p-4 rounded-4">Nenhum titulo encontrado com os filtros atuais.</div></div>`;
    wrapper.innerHTML = "";
    return;
  }

  const cardsHTML = data
    .map(
      (item) => `
      <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
        <article class="watched-card h-100">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <div class="watched-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="category-tag">${item.category}</span>
              <span class="rating-badge"><i class="fa-solid fa-star"></i> ${Number(item.rating).toFixed(1)}</span>
            </div>
            <h4 class="h6 mb-0">${item.title}</h4>
          </div>
        </article>
      </div>
    `
    )
    .join("");

  grid.innerHTML = cardsHTML;

  wrapper.innerHTML = data
    .map(
      (item) => `
      <div class="swiper-slide">
        <article class="watched-card">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <div class="watched-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="category-tag">${item.category}</span>
              <span class="rating-badge"><i class="fa-solid fa-star"></i> ${Number(item.rating).toFixed(1)}</span>
            </div>
            <h4 class="h6 mb-0">${item.title}</h4>
          </div>
        </article>
      </div>
    `
    )
    .join("");

  if (watchedSwiper) {
    watchedSwiper.destroy(true, true);
  }

  watchedSwiper = new Swiper(".watched-swiper", {
    slidesPerView: 1.15,
    spaceBetween: 16,
    pagination: { el: ".watched-swiper .swiper-pagination", clickable: true },
    breakpoints: {
      576: { slidesPerView: 2.2 },
      992: { slidesPerView: 3.2 }
    }
  });
}

function setupFiltersAndSearch() {
  document.querySelectorAll(".btn-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-filter").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderWatched();
    });
  });

  document.getElementById("searchInput").addEventListener("input", (event) => {
    currentSearch = event.target.value.trim();
    renderWatched();
  });
}

function setupRequestForm() {
  document.getElementById("requestForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("requestInput");
    const value = input.value.trim();

    if (!value) {
      showToast("Digite um titulo valido.", "danger");
      return;
    }

    db.requests.unshift({
      id: crypto.randomUUID(),
      title: value,
      createdAt: new Date().toISOString()
    });

    saveDB(db);
    input.value = "";
    showToast("Pedido enviado com sucesso!", "success");
  });
}

function setupParticles() {
  const canvas = document.getElementById("particlesCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    particles = Array.from({ length: 36 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.2
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = `rgba(192,132,252,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();
  window.addEventListener("resize", () => {
    resize();
    init();
  });
}

function init() {
  setupFiltersAndSearch();
  setupRequestForm();
  setupParticles();

  const store = window.SeaCaosStore;
  if (!store) {
    renderHero();
    renderSchedule();
    renderWatched();
    document.getElementById("pageLoader").classList.add("hidden");
    return;
  }

  store.ready
    .then(() => {
      store.subscribe((nextDb) => {
        db = nextDb;
        renderHero();
        renderSchedule();
        renderWatched();
        document.getElementById("pageLoader").classList.add("hidden");
      });
    })
    .catch((error) => {
      console.error(error);
      document.getElementById("pageLoader").classList.add("hidden");
      showToast("Falha ao conectar com o Firebase.", "danger");
    });
}

document.addEventListener("DOMContentLoaded", init);
