
(() => {
  // =========================
  // MENU SIDEBAR
  // =========================
  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("menuToggle");

  if (sidebar && toggle) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 850 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        sidebar.classList.remove("open");
      }
    });
  }

  // =========================
  // PENCARIAN HOOKELAB
  // =========================
  const search = document.getElementById("siteSearch");
  const searchBox = search?.closest(".search, .home-search");

  if (!search || !searchBox) return;

  
const pages = [
  {
    title: "Beranda",
    description: "Halaman utama HookeLab",
    url: "index.html",
    keywords: "home dashboard utama"
  },
  {
    title: "Identitas",
    description: "Identitas laboratorium virtual dan penyusun",
    url: "identitas.html",
    keywords: "identitas profil penyusun tim pengembang"
  },
  {
    title: "Petunjuk Praktikum",
    description: "Petunjuk penggunaan laboratorium virtual",
    url: "petunjuk.html",
    keywords: "panduan cara penggunaan langkah praktikum"
  },
  {
    title: "Eksperimen",
    description: "Eksperimen Hukum Hooke",
    url: "modul.html",
    keywords: "eksperimen"
  },
  {
    title: "Tantangan Pegas",
    description: "Tantangan untuk menguji pemahaman Hukum Hooke",
    url: "tantangan.html",
    keywords: "tantangan soal latihan pegas misteri gaya massa konstanta"
  },
  {
    title: "LKPD Digital",
    description: "Lembar kerja peserta didik untuk kegiatan eksperimen",
    url: "lkpd.html",
    keywords: "lembar kerja pengamatan tabel data grafik analisis kesimpulan"
  }
];


  // Membuat wadah hasil pencarian
  const resultsBox = document.createElement("div");
  resultsBox.className = "search-results";
  resultsBox.hidden = true;
  resultsBox.setAttribute("role", "listbox");
  searchBox.appendChild(resultsBox);

  let activeIndex = -1;
  let currentResults = [];

  function closeResults() {
    resultsBox.hidden = true;
    activeIndex = -1;
    search.removeAttribute("aria-expanded");
  }

  function openPage(page) {
    if (page) window.location.href = page.url;
  }

  function showResults() {
    const query = search.value.trim().toLowerCase();

    resultsBox.replaceChildren();
    activeIndex = -1;

    if (!query) {
      closeResults();
      return;
    }

    currentResults = pages.filter((page) => {
      const searchableText =
        `${page.title} ${page.description} ${page.keywords}`.toLowerCase();

      return query.split(/\s+/).every((word) =>
        searchableText.includes(word)
      );
    });

    if (currentResults.length === 0) {
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "Materi tidak ditemukan. Coba kata kunci lain.";
      resultsBox.appendChild(empty);
      resultsBox.hidden = false;
      search.setAttribute("aria-expanded", "true");
      return;
    }

    currentResults.forEach((page, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "search-result";
      item.setAttribute("role", "option");

      const title = document.createElement("strong");
      title.textContent = page.title;

      const description = document.createElement("small");
      description.textContent = page.description;

      item.append(title, description);

      item.addEventListener("mouseenter", () => {
        activeIndex = index;
        updateActiveResult();
      });

      item.addEventListener("click", () => openPage(page));

      resultsBox.appendChild(item);
    });

    resultsBox.hidden = false;
    search.setAttribute("aria-expanded", "true");
  }

  function updateActiveResult() {
    const items = resultsBox.querySelectorAll(".search-result");

    items.forEach((item, index) => {
      item.classList.toggle("selected", index === activeIndex);
      item.setAttribute(
        "aria-selected",
        index === activeIndex ? "true" : "false"
      );
    });

    if (activeIndex >= 0 && items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }

  search.addEventListener("input", showResults);

  search.addEventListener("keydown", (e) => {
    const items = resultsBox.querySelectorAll(".search-result");

    if (e.key === "ArrowDown" && !resultsBox.hidden && items.length) {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      updateActiveResult();
    } else if (
      e.key === "ArrowUp" &&
      !resultsBox.hidden &&
      items.length
    ) {
      e.preventDefault();
      activeIndex = activeIndex <= 0
        ? items.length - 1
        : activeIndex - 1;
      updateActiveResult();
    } else if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0 && currentResults[activeIndex]) {
        openPage(currentResults[activeIndex]);
      } else if (currentResults.length) {
        openPage(currentResults[0]);
      } else if (search.value.trim()) {
        showResults();
      }
    } else if (e.key === "Escape") {
      closeResults();
    }
  });

  document.addEventListener("click", (e) => {
    if (!searchBox.contains(e.target)) {
      closeResults();
    }
  });

  // Pintasan Ctrl + K
  document.addEventListener("keydown", (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "k"
    ) {
      e.preventDefault();
      search.focus();
      search.select();
    }
  });
})();
