(function () {

  const DEFAULT_DB = {
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

  const firebaseConfig = window.SEA_CAOS_FIREBASE_CONFIG || {
  apiKey: "AIzaSyC7oURMj-a5TjlVT2KRRNUBYLh90yRNs_Q",
  authDomain: "seacaos-af164.firebaseapp.com",
  projectId: "seacaos-af164",
  storageBucket: "seacaos-af164.firebasestorage.app",
  messagingSenderId: "893177812894",
  appId: "1:893177812894:web:eaf622df22844a0e53288f"
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const isConfigured = Object.values(firebaseConfig).every((value) => typeof value === "string" && value.trim() && !value.includes("YOUR_"));

  function normalizeScheduleItem(item) {
    return {
      id: item?.id || crypto.randomUUID(),
      day: item?.day || "",
      date: item?.date || "",
      image: item?.image || "",
      title: item?.title || "",
      episodes: item?.episodes || "",
      time: item?.time || ""
    };
  }

  function normalizeWatchedItem(item) {
    return {
      id: item?.id || crypto.randomUUID(),
      title: item?.title || "",
      image: item?.image || "",
      rating: Number(item?.rating ?? 0),
      category: item?.category || "Filmes"
    };
  }

  function normalizeRequestItem(item) {
    return {
      id: item?.id || crypto.randomUUID(),
      title: item?.title || "",
      createdAt: item?.createdAt || new Date().toISOString()
    };
  }

  function normalize(data = {}) {
    return {
      hero: {
        ...clone(DEFAULT_DB.hero),
        ...(data.hero || {})
      },
      social: {
        ...clone(DEFAULT_DB.social),
        ...(data.social || {})
      },
      schedule: Array.isArray(data.schedule) ? data.schedule.map(normalizeScheduleItem) : clone(DEFAULT_DB.schedule),
      watched: Array.isArray(data.watched) ? data.watched.map(normalizeWatchedItem) : clone(DEFAULT_DB.watched),
      requests: Array.isArray(data.requests) ? data.requests.map(normalizeRequestItem) : clone(DEFAULT_DB.requests)
    };
  }

  const listeners = new Set();
  let current = normalize(DEFAULT_DB);
  let mode = "firebase";
  let firestoreDoc = null;
  let unsubscribeRemote = null;
  let readyResolve;
  let readyReject;
  let lastError = null;

  const ready = new Promise((resolve, reject) => {
    readyResolve = resolve;
    readyReject = reject;
  });

  function notify() {
    const snapshot = clone(current);
    listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (error) {
        console.error(error);
      }
    });
  }

  async function initFirebase() {
    try {
      if (!isConfigured) {
        throw new Error("Firebase config ausente ou incompleta em firebase.js.");
      }

      if (!window.firebase || !window.firebase.firestore) {
        throw new Error("Firebase SDK nao carregado.");
      }

      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
      }

      const firestore = window.firebase.firestore();
      firestoreDoc = firestore.collection("seaCaos").doc("content");

      const snapshot = await firestoreDoc.get();
      if (!snapshot.exists) {
        current = normalize(DEFAULT_DB);
        await firestoreDoc.set(current);
      } else {
        current = normalize(snapshot.data());
      }

      unsubscribeRemote = firestoreDoc.onSnapshot((remoteSnapshot) => {
        if (!remoteSnapshot.exists) {
          return;
        }

        current = normalize(remoteSnapshot.data());
        notify();
      }, (error) => {
        console.error(error);
      });

      readyResolve(current);
      notify();
    } catch (error) {
      lastError = error;
      console.error("Firebase indisponivel.", error);
      readyReject(error);
    }
  }

  async function save(data) {
    if (!firestoreDoc) {
      throw new Error("Firebase nao inicializado. Verifique a configuracao e as regras do Firestore.");
    }

    current = normalize(data);
    await firestoreDoc.set(current);

    notify();
    return clone(current);
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(clone(current));
    return () => listeners.delete(listener);
  }

  function getCurrent() {
    return clone(current);
  }

  initFirebase();

  window.SeaCaosStore = {
    ready,
    subscribe,
    getCurrent,
    save,
    normalize,
    defaults: clone(DEFAULT_DB),
    get mode() {
      return mode;
    },
    get remoteUnsubscribe() {
      return unsubscribeRemote;
    },
    get error() {
      return lastError;
    }
  };
})();