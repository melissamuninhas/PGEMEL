const STORAGE_KEY = "seaCaosDB_v1";
const ADMIN_AUTH_KEY = "seaCaosAdminLogged";

function createDefaultDB() {
  return {
    hero: {
      title: "NA LIVE COM A MELHOR COMUNIDADE!",
      subtitle: "Aqui a bagunca e garantida e as historias ficam ainda melhores juntos.",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1400&auto=format&fit=crop"
    },
    social: {
      discord: "https://discord.com",
      twitch: "https://www.twitch.tv",
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
      }
    ],
    watched: [
      {
        id: crypto.randomUUID(),
        title: "Your Name",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
        rating: 9.4,
        category: "Animes"
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

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const icon = type === "success" ? "fa-circle-check" : type === "danger" ? "fa-circle-xmark" : "fa-circle-info";
  const toastEl = document.createElement("div");
  toastEl.className = "toast align-items-center";
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body"><i class="fa-solid ${icon} me-2"></i>${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>
  `;

  container.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 2600 });
  toast.show();
  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Arquivo invalido. Selecione uma imagem."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxDimension = 1280;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        if (dataUrl.length > 750000) {
          reject(new Error("Imagem muito grande. Use uma imagem menor para salvar."));
          return;
        }

        resolve(dataUrl);
      };
      image.onerror = () => reject(new Error("Nao foi possivel processar a imagem selecionada."));
      image.src = reader.result;
    };
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo selecionado."));
    reader.readAsDataURL(file);
  });
}

async function resolveImageInput(urlInputId, fileInputId, fallbackImage = "") {
  const url = document.getElementById(urlInputId).value.trim();
  const fileInput = document.getElementById(fileInputId);
  const file = fileInput?.files?.[0];

  if (file) {
    return fileToDataUrl(file);
  }

  if (url) {
    return url;
  }

  return fallbackImage;
}

let db = loadDB();

function setAdminVisibility(isLogged) {
  document.getElementById("loginSection").classList.toggle("d-none", isLogged);
  document.getElementById("adminApp").classList.toggle("d-none", !isLogged);
}

function renderDashboard() {
  const cards = [
    { label: "Itens no Cronograma", value: db.schedule.length, icon: "fa-calendar-week" },
    { label: "Conteudos Assistidos", value: db.watched.length, icon: "fa-photo-film" },
    { label: "Pedidos Pendentes", value: db.requests.length, icon: "fa-inbox" },
    { label: "Links Sociais", value: 4, icon: "fa-link" }
  ];

  const container = document.getElementById("dashboardCards");
  container.innerHTML = cards
    .map(
      (card) => `
      <div class="col-6 col-xl-3">
        <div class="dashboard-stat">
          <h4><i class="fa-solid ${card.icon} me-2"></i>${card.label}</h4>
          <p>${card.value}</p>
        </div>
      </div>
    `
    )
    .join("");
}

function fillHeroForm() {
  document.getElementById("heroTitleInput").value = db.hero.title;
  document.getElementById("heroSubtitleInput").value = db.hero.subtitle;
  const heroImageInput = document.getElementById("heroImageInput");
  heroImageInput.value = db.hero.image.startsWith("data:image") ? "" : db.hero.image;
  document.getElementById("heroImageFileInput").value = "";
}

function fillLinksForm() {
  document.getElementById("discordInput").value = db.social.discord;
  document.getElementById("twitchInput").value = db.social.twitch;
  document.getElementById("instagramInput").value = db.social.instagram;
  document.getElementById("twitterInput").value = db.social.twitter;
}

function renderScheduleTable() {
  const tbody = document.getElementById("scheduleTable");
  if (!db.schedule.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Nenhum item cadastrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = db.schedule
    .map(
      (item) => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${item.image}" alt="${item.title}" width="56" height="40" style="object-fit:cover;border-radius:8px;" />
            <span>${item.title}</span>
          </div>
        </td>
        <td>${item.day}<br><small>${item.date}</small></td>
        <td>${item.episodes}</td>
        <td>${item.time}</td>
        <td>
          <button class="btn btn-sm btn-outline-neon edit-schedule" data-id="${item.id}"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-danger remove-schedule" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `
    )
    .join("");
}

function renderCatalogTable() {
  const tbody = document.getElementById("catalogTable");
  if (!db.watched.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4">Nenhum conteudo cadastrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = db.watched
    .map(
      (item) => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${item.image}" alt="${item.title}" width="56" height="40" style="object-fit:cover;border-radius:8px;" />
            <span>${item.title}</span>
          </div>
        </td>
        <td>${item.category}</td>
        <td>${Number(item.rating).toFixed(1)}</td>
        <td>
          <button class="btn btn-sm btn-outline-neon edit-catalog" data-id="${item.id}"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-danger remove-catalog" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `
    )
    .join("");
}

function renderRequests() {
  const container = document.getElementById("requestsList");
  if (!db.requests.length) {
    container.innerHTML = `<div class="admin-request-item">Sem pedidos no momento.</div>`;
    return;
  }

  container.innerHTML = db.requests
    .map(
      (req) => `
      <div class="admin-request-item d-flex justify-content-between align-items-center gap-3">
        <div>
          <h6 class="mb-1">${req.title}</h6>
          <small class="opacity-75">${new Date(req.createdAt).toLocaleString("pt-BR")}</small>
        </div>
        <button class="btn btn-sm btn-danger remove-request" data-id="${req.id}"><i class="fa-solid fa-trash"></i> Excluir</button>
      </div>
    `
    )
    .join("");
}

function refreshAll() {
  renderDashboard();
  fillHeroForm();
  fillLinksForm();
  renderScheduleTable();
  renderCatalogTable();
  renderRequests();
}

function setupNavigation() {
  document.querySelectorAll("#adminNav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#adminNav button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.dataset.target;
      document.querySelectorAll(".admin-panel").forEach((panel) => panel.classList.remove("active"));
      document.getElementById(target).classList.add("active");
    });
  });
}

function setupLogin() {
  const logged = localStorage.getItem(ADMIN_AUTH_KEY) === "1";
  setAdminVisibility(logged);

  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();

    if (user === "admin" && pass === "seacaos123") {
      localStorage.setItem(ADMIN_AUTH_KEY, "1");
      setAdminVisibility(true);
      showToast("Login realizado com sucesso.", "success");
    } else {
      showToast("Credenciais invalidas.", "danger");
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setAdminVisibility(false);
    showToast("Sessao encerrada.");
  });
}

function setupHeroAndLinksForms() {
  document.getElementById("heroForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    let image;
    try {
      image = await resolveImageInput("heroImageInput", "heroImageFileInput", db.hero.image);
    } catch (error) {
      showToast(error.message, "danger");
      return;
    }

    if (!image) {
      showToast("Informe uma URL da imagem ou selecione um arquivo local.", "danger");
      return;
    }

    db.hero = {
      title: document.getElementById("heroTitleInput").value.trim(),
      subtitle: document.getElementById("heroSubtitleInput").value.trim(),
      image
    };
    saveDB(db);
    renderDashboard();
    showToast("Hero atualizado.", "success");
  });

  document.getElementById("linksForm").addEventListener("submit", (event) => {
    event.preventDefault();
    db.social = {
      discord: document.getElementById("discordInput").value.trim(),
      twitch: document.getElementById("twitchInput").value.trim(),
      instagram: document.getElementById("instagramInput").value.trim(),
      twitter: document.getElementById("twitterInput").value.trim()
    };
    saveDB(db);
    renderDashboard();
    showToast("Links atualizados.", "success");
  });
}

function setupScheduleCRUD() {
  const modalEl = document.getElementById("scheduleEditModal");
  const modal = new bootstrap.Modal(modalEl);
  const scheduleForm = document.getElementById("scheduleForm");

  document.getElementById("addScheduleBtn").addEventListener("click", () => {
    document.getElementById("scheduleModalTitle").textContent = "Novo Item de Cronograma";
    scheduleForm.reset();
    document.getElementById("scheduleId").value = "";
    scheduleForm.dataset.currentImage = "";
    modal.show();
  });

  scheduleForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("scheduleId").value;
    const fallbackImage = scheduleForm.dataset.currentImage || "";

    let image;
    try {
      image = await resolveImageInput("scheduleImage", "scheduleImageFile", fallbackImage);
    } catch (error) {
      showToast(error.message, "danger");
      return;
    }

    if (!image) {
      showToast("Informe uma URL da imagem ou selecione um arquivo local.", "danger");
      return;
    }

    const payload = {
      id: id || crypto.randomUUID(),
      title: document.getElementById("scheduleTitle").value.trim(),
      image,
      day: document.getElementById("scheduleDay").value.trim(),
      date: document.getElementById("scheduleDate").value,
      episodes: document.getElementById("scheduleEpisodes").value.trim(),
      time: document.getElementById("scheduleTime").value
    };

    if (id) {
      db.schedule = db.schedule.map((item) => (item.id === id ? payload : item));
      showToast("Item do cronograma atualizado.", "success");
    } else {
      db.schedule.push(payload);
      showToast("Item adicionado ao cronograma.", "success");
    }

    saveDB(db);
    renderScheduleTable();
    renderDashboard();
    scheduleForm.dataset.currentImage = "";
    modal.hide();
  });

  document.getElementById("scheduleTable").addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit-schedule");
    const removeBtn = event.target.closest(".remove-schedule");

    if (editBtn) {
      const item = db.schedule.find((s) => s.id === editBtn.dataset.id);
      if (!item) return;
      document.getElementById("scheduleModalTitle").textContent = "Editar Item de Cronograma";
      document.getElementById("scheduleId").value = item.id;
      document.getElementById("scheduleTitle").value = item.title;
      document.getElementById("scheduleImage").value = item.image.startsWith("data:image") ? "" : item.image;
      document.getElementById("scheduleImageFile").value = "";
      scheduleForm.dataset.currentImage = item.image;
      document.getElementById("scheduleDay").value = item.day;
      document.getElementById("scheduleDate").value = item.date;
      document.getElementById("scheduleEpisodes").value = item.episodes;
      document.getElementById("scheduleTime").value = item.time;
      modal.show();
    }

    if (removeBtn) {
      const id = removeBtn.dataset.id;
      db.schedule = db.schedule.filter((s) => s.id !== id);
      saveDB(db);
      renderScheduleTable();
      renderDashboard();
      showToast("Item removido do cronograma.", "success");
    }
  });
}

function setupCatalogCRUD() {
  const modalEl = document.getElementById("catalogEditModal");
  const modal = new bootstrap.Modal(modalEl);
  const catalogForm = document.getElementById("catalogForm");

  document.getElementById("addCatalogBtn").addEventListener("click", () => {
    document.getElementById("catalogModalTitle").textContent = "Novo Conteudo Assistido";
    catalogForm.reset();
    document.getElementById("catalogId").value = "";
    catalogForm.dataset.currentImage = "";
    modal.show();
  });

  catalogForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("catalogId").value;
    const fallbackImage = catalogForm.dataset.currentImage || "";

    let image;
    try {
      image = await resolveImageInput("catalogImage", "catalogImageFile", fallbackImage);
    } catch (error) {
      showToast(error.message, "danger");
      return;
    }

    if (!image) {
      showToast("Informe uma URL da imagem ou selecione um arquivo local.", "danger");
      return;
    }

    const payload = {
      id: id || crypto.randomUUID(),
      title: document.getElementById("catalogTitle").value.trim(),
      image,
      category: document.getElementById("catalogCategory").value,
      rating: Number(document.getElementById("catalogRating").value)
    };

    if (id) {
      db.watched = db.watched.map((item) => (item.id === id ? payload : item));
      showToast("Conteudo atualizado.", "success");
    } else {
      db.watched.push(payload);
      showToast("Conteudo adicionado.", "success");
    }

    saveDB(db);
    renderCatalogTable();
    renderDashboard();
    catalogForm.dataset.currentImage = "";
    modal.hide();
  });

  document.getElementById("catalogTable").addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit-catalog");
    const removeBtn = event.target.closest(".remove-catalog");

    if (editBtn) {
      const item = db.watched.find((w) => w.id === editBtn.dataset.id);
      if (!item) return;
      document.getElementById("catalogModalTitle").textContent = "Editar Conteudo Assistido";
      document.getElementById("catalogId").value = item.id;
      document.getElementById("catalogTitle").value = item.title;
      document.getElementById("catalogImage").value = item.image.startsWith("data:image") ? "" : item.image;
      document.getElementById("catalogImageFile").value = "";
      catalogForm.dataset.currentImage = item.image;
      document.getElementById("catalogCategory").value = item.category;
      document.getElementById("catalogRating").value = item.rating;
      modal.show();
    }

    if (removeBtn) {
      const id = removeBtn.dataset.id;
      db.watched = db.watched.filter((w) => w.id !== id);
      saveDB(db);
      renderCatalogTable();
      renderDashboard();
      showToast("Conteudo removido.", "success");
    }
  });
}

function setupRequestsActions() {
  document.getElementById("requestsList").addEventListener("click", (event) => {
    const removeBtn = event.target.closest(".remove-request");
    if (!removeBtn) return;

    db.requests = db.requests.filter((req) => req.id !== removeBtn.dataset.id);
    saveDB(db);
    renderRequests();
    renderDashboard();
    showToast("Pedido removido.", "success");
  });
}

function init() {
  setupLogin();
  setupNavigation();
  setupHeroAndLinksForms();
  setupScheduleCRUD();
  setupCatalogCRUD();
  setupRequestsActions();

  const store = window.SeaCaosStore;
  if (!store) {
    refreshAll();
    document.getElementById("adminLoader").classList.add("hidden");
    return;
  }

  store.ready
    .then(() => {
      store.subscribe((nextDb) => {
        db = nextDb;
        refreshAll();
        document.getElementById("adminLoader").classList.add("hidden");
      });
    })
    .catch((error) => {
      console.error(error);
      document.getElementById("adminLoader").classList.add("hidden");
      showToast("Falha ao conectar com o Firebase.", "danger");
    });
}

document.addEventListener("DOMContentLoaded", init);
