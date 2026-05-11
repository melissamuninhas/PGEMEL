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
      time: item?.time || "",
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : 0
    };
  }

  function normalizeWatchedItem(item) {
    return {
      id: item?.id || crypto.randomUUID(),
      title: item?.title || "",
      image: item?.image || "",
      rating: Number(item?.rating ?? 0),
      category: item?.category || "Filmes",
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : 0
    };
  }

  function normalizeRequestItem(item) {
    return {
      id: item?.id || crypto.randomUUID(),
      title: item?.title || "",
      createdAt: item?.createdAt || new Date().toISOString(),
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : 0
    };
  }

  function normalizeCollection(items, normalizeItem) {
    return items.map((item, index) => normalizeItem({ ...item, order: item?.order ?? index }));
  }

  function stripOrder(item) {
    const { order, ...rest } = item;
    return rest;
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
      schedule: Array.isArray(data.schedule) ? normalizeCollection(data.schedule, normalizeScheduleItem) : normalizeCollection(clone(DEFAULT_DB.schedule), normalizeScheduleItem),
      watched: Array.isArray(data.watched) ? normalizeCollection(data.watched, normalizeWatchedItem) : normalizeCollection(clone(DEFAULT_DB.watched), normalizeWatchedItem),
      requests: Array.isArray(data.requests) ? normalizeCollection(data.requests, normalizeRequestItem) : normalizeCollection(clone(DEFAULT_DB.requests), normalizeRequestItem)
    };
  }

  function buildCorePayload(data) {
    return {
      hero: data.hero,
      social: data.social,
      schemaVersion: 2
    };
  }

  function sortByOrder(items) {
    return [...items].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  }

  function listToMap(items) {
    const map = new Map();
    items.forEach((item) => map.set(item.id, item));
    return map;
  }

  async function commitOperationsInChunks(firestore, operations, chunkSize = 400) {
    for (let i = 0; i < operations.length; i += chunkSize) {
      const chunk = operations.slice(i, i + chunkSize);
      const batch = firestore.batch();

      chunk.forEach((operation) => {
        if (operation.type === "set") {
          batch.set(operation.ref, operation.data);
          return;
        }

        if (operation.type === "delete") {
          batch.delete(operation.ref);
        }
      });

      await batch.commit();
    }
  }

  function isItemChanged(previousItem, nextItem) {
    if (!previousItem) return true;
    return JSON.stringify(previousItem) !== JSON.stringify(nextItem);
  }

  async function syncCollectionDiff(firestore, collectionRef, previousItems, nextItems, normalizeItem) {
    const normalizedPrevious = sortByOrder(normalizeCollection(previousItems, normalizeItem));
    const normalizedNext = sortByOrder(normalizeCollection(nextItems, normalizeItem));

    const previousMap = listToMap(normalizedPrevious);
    const nextMap = listToMap(normalizedNext);
    const operations = [];

    normalizedNext.forEach((item) => {
      const previousItem = previousMap.get(item.id);
      if (!isItemChanged(previousItem, item)) {
        return;
      }

      operations.push({
        type: "set",
        ref: collectionRef.doc(item.id),
        data: item
      });
    });

    normalizedPrevious.forEach((item) => {
      if (nextMap.has(item.id)) {
        return;
      }

      operations.push({
        type: "delete",
        ref: collectionRef.doc(item.id)
      });
    });

    if (!operations.length) {
      return;
    }

    await commitOperationsInChunks(firestore, operations);
  }

  function snapshotToNormalizedList(snapshot, normalizeItem) {
    const items = snapshot.docs.map((doc) => normalizeItem({ id: doc.id, ...doc.data() }));
    return sortByOrder(items);
  }

  const listeners = new Set();
  let current = normalize(DEFAULT_DB);
  let mode = "firebase";
  let firestoreDoc = null;
  let firestoreDb = null;
  let scheduleCollection = null;
  let watchedCollection = null;
  let requestsCollection = null;
  let unsubscribeRemote = null;
  let unsubscribeSchedule = null;
  let unsubscribeWatched = null;
  let unsubscribeRequests = null;
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

      firestoreDb = window.firebase.firestore();
      firestoreDoc = firestoreDb.collection("seaCaos").doc("content");
      scheduleCollection = firestoreDoc.collection("scheduleItems");
      watchedCollection = firestoreDoc.collection("watchedItems");
      requestsCollection = firestoreDoc.collection("requestItems");

      const snapshot = await firestoreDoc.get();
      const rawCore = snapshot.exists ? (snapshot.data() || {}) : {};
      const normalizedLegacy = normalize(rawCore);

      let scheduleList = [];
      let watchedList = [];
      let requestsList = [];

      if (!snapshot.exists) {
        const seeded = normalize(DEFAULT_DB);
        await firestoreDoc.set(buildCorePayload(seeded));

        await Promise.all([
          syncCollectionDiff(firestoreDb, scheduleCollection, [], seeded.schedule, normalizeScheduleItem),
          syncCollectionDiff(firestoreDb, watchedCollection, [], seeded.watched, normalizeWatchedItem),
          syncCollectionDiff(firestoreDb, requestsCollection, [], seeded.requests, normalizeRequestItem)
        ]);

        scheduleList = seeded.schedule;
        watchedList = seeded.watched;
        requestsList = seeded.requests;
      } else {
        const [scheduleSnapshot, watchedSnapshot, requestsSnapshot] = await Promise.all([
          scheduleCollection.get(),
          watchedCollection.get(),
          requestsCollection.get()
        ]);

        const hasSubcollectionData = !scheduleSnapshot.empty || !watchedSnapshot.empty || !requestsSnapshot.empty;
        const legacyHasArrays = Array.isArray(rawCore.schedule) || Array.isArray(rawCore.watched) || Array.isArray(rawCore.requests);

        if (!hasSubcollectionData && legacyHasArrays) {
          await Promise.all([
            syncCollectionDiff(firestoreDb, scheduleCollection, [], normalizedLegacy.schedule, normalizeScheduleItem),
            syncCollectionDiff(firestoreDb, watchedCollection, [], normalizedLegacy.watched, normalizeWatchedItem),
            syncCollectionDiff(firestoreDb, requestsCollection, [], normalizedLegacy.requests, normalizeRequestItem)
          ]);

          await firestoreDoc.set(buildCorePayload(normalizedLegacy));
          scheduleList = normalizedLegacy.schedule;
          watchedList = normalizedLegacy.watched;
          requestsList = normalizedLegacy.requests;
        } else {
          scheduleList = snapshotToNormalizedList(scheduleSnapshot, normalizeScheduleItem);
          watchedList = snapshotToNormalizedList(watchedSnapshot, normalizeWatchedItem);
          requestsList = snapshotToNormalizedList(requestsSnapshot, normalizeRequestItem);
        }
      }

      current = normalize({
        hero: normalizedLegacy.hero,
        social: normalizedLegacy.social,
        schedule: scheduleList,
        watched: watchedList,
        requests: requestsList
      });

      unsubscribeRemote = firestoreDoc.onSnapshot((remoteSnapshot) => {
        const remoteData = remoteSnapshot.exists ? remoteSnapshot.data() : {};
        const normalizedCore = normalize({
          hero: remoteData?.hero,
          social: remoteData?.social,
          schedule: current.schedule,
          watched: current.watched,
          requests: current.requests
        });

        current = normalizedCore;
        notify();
      }, (error) => {
        console.error(error);
      });

      unsubscribeSchedule = scheduleCollection.onSnapshot((scheduleSnapshot) => {
        const schedule = snapshotToNormalizedList(scheduleSnapshot, normalizeScheduleItem);
        current = normalize({
          ...current,
          schedule
        });
        notify();
      }, (error) => {
        console.error(error);
      });

      unsubscribeWatched = watchedCollection.onSnapshot((watchedSnapshot) => {
        const watched = snapshotToNormalizedList(watchedSnapshot, normalizeWatchedItem);
        current = normalize({
          ...current,
          watched
        });
        notify();
      }, (error) => {
        console.error(error);
      });

      unsubscribeRequests = requestsCollection.onSnapshot((requestsSnapshot) => {
        const requests = snapshotToNormalizedList(requestsSnapshot, normalizeRequestItem);
        current = normalize({
          ...current,
          requests
        });
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

    const previous = normalize(current);
    const next = normalize(data);

    await firestoreDoc.set(buildCorePayload(next));

    await Promise.all([
      syncCollectionDiff(firestoreDb, scheduleCollection, previous.schedule, next.schedule, normalizeScheduleItem),
      syncCollectionDiff(firestoreDb, watchedCollection, previous.watched, next.watched, normalizeWatchedItem),
      syncCollectionDiff(firestoreDb, requestsCollection, previous.requests, next.requests, normalizeRequestItem)
    ]);

    current = next;

    notify();
    return normalize({
      ...clone(current),
      schedule: current.schedule.map(stripOrder),
      watched: current.watched.map(stripOrder),
      requests: current.requests.map(stripOrder)
    });
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(normalize({
      ...clone(current),
      schedule: current.schedule.map(stripOrder),
      watched: current.watched.map(stripOrder),
      requests: current.requests.map(stripOrder)
    }));
    return () => listeners.delete(listener);
  }

  function getCurrent() {
    return normalize({
      ...clone(current),
      schedule: current.schedule.map(stripOrder),
      watched: current.watched.map(stripOrder),
      requests: current.requests.map(stripOrder)
    });
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
      return () => {
        if (unsubscribeRemote) unsubscribeRemote();
        if (unsubscribeSchedule) unsubscribeSchedule();
        if (unsubscribeWatched) unsubscribeWatched();
        if (unsubscribeRequests) unsubscribeRequests();
      };
    },
    get error() {
      return lastError;
    }
  };
})();