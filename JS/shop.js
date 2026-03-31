// Shop page product slider for top category products
document.addEventListener("DOMContentLoaded", () => {

  const slider = document.querySelector('.slider-wrapper');
  const leftBtn = document.querySelector('.slide-btn.left');
  const rightBtn = document.querySelector('.slide-btn.right');

  // DEBUG (check console)
  console.log("Slider:", slider);
  console.log("Left:", leftBtn);
  console.log("Right:", rightBtn);

  // If elements not found, stop here
  if (!slider || !leftBtn || !rightBtn) {
    console.log("❌ Slider elements not found on this page");
    return;
  }

  rightBtn.addEventListener('click', () => {
    slider.scrollBy({
      left: 400,
      behavior: 'smooth'
    });
  });

  leftBtn.addEventListener('click', () => {
    slider.scrollBy({
      left: -400,
      behavior: 'smooth'
    });
  });

});

// ========================================
// Shop page product filtering and sorting
document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // ELEMENTS
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortOption = document.getElementById("sortOption");

  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");

  const categoryChecks = document.querySelectorAll(".categoryCheck");
  const fragranceChecks = document.querySelectorAll(".fragranceCheck");

  const productsContainer = document.querySelector(".products");
  const noResults = document.getElementById("noResults");

  let products = Array.from(document.querySelectorAll(".product-card"));


//   = ===========================
// Category auto slider 
// ==========================
// ==========================
// INFINITE CATEGORY SLIDER WITH BUTTONS
// ==========================
const categorySlider = document.querySelector(".slider-wrapper");
const catLeft = document.querySelector(".slide-btn.left");
const catRight = document.querySelector(".slide-btn.right");

if (categorySlider && catLeft && catRight) {

  const scrollAmount = 120; // width of each category
  let autoScrollCat;

  // Clone items for infinite scroll
  const categories = Array.from(categorySlider.children);
  categories.forEach(cat => {
    const clone = cat.cloneNode(true);
    categorySlider.appendChild(clone);
  });

  // Manual Buttons
  catRight.addEventListener("click", () => {
    categorySlider.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  catLeft.addEventListener("click", () => {
    categorySlider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  // Auto Scroll Function
  function startCatAutoScroll() {
    if (window.innerWidth <= 600) return; // mobile: no auto-scroll

    autoScrollCat = setInterval(() => {
      categorySlider.scrollBy({ left: 1, behavior: "auto" });

      // seamless reset
      if (categorySlider.scrollLeft >= categorySlider.scrollWidth / 2) {
        categorySlider.scrollLeft = 0;
      }
    }, 20);
  }
  function stopCatAutoScroll() {
    clearInterval(autoScrollCat);
  }
  // Start auto-scroll
  startCatAutoScroll();
  // Pause on hover
  categorySlider.addEventListener("mouseenter", stopCatAutoScroll);
  categorySlider.addEventListener("mouseleave", startCatAutoScroll);
  // Re-check on resize
  window.addEventListener("resize", () => {
    stopCatAutoScroll();
    startCatAutoScroll();
  });
}

  // =========================
  // LOAD FROM URL
  function loadFromURL() {
    const params = new URLSearchParams(window.location.search);

    searchInput.value = params.get("search") || "";
    categoryFilter.value = params.get("category") || "all";
    priceRange.value = params.get("price") || 50;
    sortOption.value = params.get("sort") || "default";

    priceValue.textContent = priceRange.value;

    const catChecks = params.get("catChecks");
    if (catChecks) {
      catChecks.split(",").forEach(val => {
        const el = document.querySelector(`.categoryCheck[value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    const fragChecks = params.get("fragChecks");
    if (fragChecks) {
      fragChecks.split(",").forEach(val => {
        const el = document.querySelector(`.fragranceCheck[value="${val}"]`);
        if (el) el.checked = true;
      });
    }
  }

  // =========================
  // UPDATE URL
  function updateURL() {
    const params = new URLSearchParams();

    params.set("search", searchInput.value);
    params.set("category", categoryFilter.value);
    params.set("price", priceRange.value);
    params.set("sort", sortOption.value);

    const selectedCategories = Array.from(categoryChecks)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const selectedFragrances = Array.from(fragranceChecks)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    params.set("catChecks", selectedCategories.join(","));
    params.set("fragChecks", selectedFragrances.join(","));

    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }

  function filterProducts() {

  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;
  const maxPrice = parseInt(priceRange.value);

  const selectedCategories = Array.from(categoryChecks)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const selectedFragrances = Array.from(fragranceChecks)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  // 🔹 FILTER
  let filtered = products.filter(product => {

    const name = product.dataset.name.toLowerCase();
    const category = product.dataset.category;
    const fragrance = product.dataset.fragrance;
    const price = parseInt(product.dataset.price);

    return (
      name.includes(searchValue) &&
      (categoryValue === "all" || category === categoryValue) &&
      price <= maxPrice &&
      (selectedCategories.length === 0 || selectedCategories.includes(category)) &&
      (selectedFragrances.length === 0 || selectedFragrances.includes(fragrance))
    );
  });

  // 🔹 SORT
  if (sortOption.value === "low") {
    filtered.sort((a, b) => a.dataset.price - b.dataset.price);
  } else if (sortOption.value === "high") {
    filtered.sort((a, b) => b.dataset.price - a.dataset.price);
  }

  // 🔹 RENDER (safe method)
  filtered.forEach(product => {
    product.style.display = "block";
  });

  products.forEach(product => {
    if (!filtered.includes(product)) {
      product.style.display = "none";
    }
  });

  // 🔹 NO RESULTS MESSAGE
  noResults.style.display = filtered.length === 0 ? "block" : "none";
}

  // =========================
  // HANDLE CHANGE (ONLY ONE EVENT HANDLER)
  function handleChange() {
    filterProducts();
    updateURL();
  }

  // =========================
  // EVENTS
  searchInput.addEventListener("input", handleChange);
  categoryFilter.addEventListener("change", handleChange);
  sortOption.addEventListener("change", handleChange);

  priceRange.addEventListener("input", () => {
    priceValue.textContent = priceRange.value;
    handleChange();
  });

  categoryChecks.forEach(cb => cb.addEventListener("change", handleChange));
  fragranceChecks.forEach(cb => cb.addEventListener("change", handleChange));

  // =========================
  // INIT
  loadFromURL();
  filterProducts();

});
// ========================================
// ⚙️ MOBILE SIDEBAR TOGGLE FIX
const openBtn = document.getElementById("openFilter");
const closeBtn = document.getElementById("closeFilter");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// safety check (prevents errors)
if (openBtn && closeBtn && sidebar && overlay) {

  // OPEN
  openBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  // CLOSE BUTTON
  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

  // CLICK OUTSIDE (overlay)
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

}
// Search input
// ✅ Price range
// ✅ Dynamic category checkboxes
// ✅ Dynamic fragrance checkboxes
// ✅ Dynamic category dropdown
// ✅ Sorting (low → high, high → low)
// ✅ “No results found” message
// ✅ Save filters in URL and load from URL
// ✅ Works with any new products/categories/fragrances
document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // ELEMENTS
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortOption = document.getElementById("sortOption");

  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");

  const productsContainer = document.querySelector(".products");
  const noResults = document.getElementById("noResults");

  // Products array
  let products = Array.from(document.querySelectorAll(".product-card"));

  // =========================
  // DYNAMIC FILTER GENERATION
  function generateFilters() {
    const categoryContainer = document.getElementById("categoryFilters");
    const fragranceContainer = document.getElementById("fragranceFilters");

    const categories = new Set();
    const fragrances = new Set();

    products.forEach(product => {
      categories.add(product.dataset.category);
      fragrances.add(product.dataset.fragrance);
    });

    // -------------------------
    // Category checkboxes
    if(categoryContainer){
      categoryContainer.innerHTML = "";
      categories.forEach(cat => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" class="categoryCheck" value="${cat}"> ${cat}`;
        categoryContainer.appendChild(label);
      });
    }

    // -------------------------
    // Fragrance checkboxes
    if(fragranceContainer){
      fragranceContainer.innerHTML = "";
      fragrances.forEach(frag => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" class="fragranceCheck" value="${frag}"> ${frag}`;
        fragranceContainer.appendChild(label);
      });
    }

    // -------------------------
    // Category dropdown
    categoryFilter.querySelectorAll("option:not([value='all'])").forEach(opt => opt.remove());
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });

    // Re-attach checkbox events
    attachCheckboxEvents();
  }

  // =========================
  function attachCheckboxEvents() {
    document.querySelectorAll(".categoryCheck").forEach(cb => cb.addEventListener("change", handleChange));
    document.querySelectorAll(".fragranceCheck").forEach(cb => cb.addEventListener("change", handleChange));
  }

  // =========================
 // FILTER + SORT FUNCTION
function filterProducts() {
  const searchValue = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const maxPrice = parseInt(priceRange.value);

  const selectedCategories = Array.from(document.querySelectorAll(".categoryCheck:checked")).map(cb => cb.value);
  const selectedFragrances = Array.from(document.querySelectorAll(".fragranceCheck:checked")).map(cb => cb.value);

  let filtered = products.filter(product => {
    const name = product.dataset.name.toLowerCase();
    const category = product.dataset.category;
    const fragrance = product.dataset.fragrance;
    const price = parseInt(product.dataset.price);

    return (
      name.includes(searchValue) &&
      (selectedCategory === "all" || category === selectedCategory) &&
      price <= maxPrice &&
      (selectedCategories.length === 0 || selectedCategories.includes(category)) &&
      (selectedFragrances.length === 0 || selectedFragrances.includes(fragrance))
    );
  });

  // SORT
  if (sortOption.value === "low") {
    filtered.sort((a, b) => a.dataset.price - b.dataset.price);
  } else if (sortOption.value === "high") {
    filtered.sort((a, b) => b.dataset.price - a.dataset.price);
  }

  // RENDER PRODUCTS
  productsContainer.innerHTML = "";
  filtered.forEach(product => productsContainer.appendChild(product));

  // NO RESULTS MESSAGE
  const noResultsMessages = [
    "No products found 😔",
    "Try adjusting your filters 🔄",
    "No matches for this price 💸",
    "No products under this category 😢",
    "Oops! Nothing matches your selection 😕"
  ];

  if (filtered.length === 0) {
    const productsContainer = document.querySelector(".products"); // products grid
const noResults = document.getElementById("noResults"); // separate message element
    const randomMessage = noResultsMessages[Math.floor(Math.random() * noResultsMessages.length)];
    noResults.textContent = randomMessage; // ✅ Set text directly
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
  }
}

  // =========================
  // SAVE FILTERS TO URL
  function updateURL() {
    const params = new URLSearchParams();

    params.set("search", searchInput.value);
    params.set("category", categoryFilter.value);
    params.set("price", priceRange.value);
    params.set("sort", sortOption.value);

    const catChecks = Array.from(document.querySelectorAll(".categoryCheck:checked")).map(cb => cb.value);
    const fragChecks = Array.from(document.querySelectorAll(".fragranceCheck:checked")).map(cb => cb.value);

    params.set("catChecks", catChecks.join(","));
    params.set("fragChecks", fragChecks.join(","));

    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }

  // =========================
  // LOAD FILTERS FROM URL
  function loadFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.get("search")) searchInput.value = params.get("search");
    if (params.get("category")) categoryFilter.value = params.get("category");
    if (params.get("price")) priceRange.value = params.get("price");
    if (params.get("sort")) sortOption.value = params.get("sort");

    const catChecks = params.get("catChecks");
    if (catChecks) catChecks.split(",").forEach(val => {
      const cb = document.querySelector(`.categoryCheck[value="${val}"]`);
      if(cb) cb.checked = true;
    });

    const fragChecks = params.get("fragChecks");
    if (fragChecks) fragChecks.split(",").forEach(val => {
      const cb = document.querySelector(`.fragranceCheck[value="${val}"]`);
      if(cb) cb.checked = true;
    });
  }

  // =========================
  // HANDLE ANY CHANGE
  function handleChange() {
    filterProducts();
    updateURL();
  }

  // =========================
  // PRICE RANGE TEXT
  priceRange.addEventListener("input", () => {
    priceValue.textContent = priceRange.value;
    handleChange();
  });

  // =========================
  // SEARCH / SORT / DROPDOWN
  searchInput.addEventListener("input", handleChange);
  sortOption.addEventListener("change", handleChange);
  categoryFilter.addEventListener("change", handleChange);

  // =========================
  // INITIALIZE
  generateFilters();
  loadFromURL();
  filterProducts();

});
// ========================================
// Fun no results messages
const noResultsMessages = [
  "Oops! No products match your search 😔",
  "Hmm… nothing here. Try adjusting your filters!",
  "No candles found! Maybe try a different scent?",
  "We couldn’t find any matches 😢",
  "Looks like your search is empty! 🌿",
  "Your perfect candle isn’t here… yet!",
  "No products found. Try broadening your search."
];

function filterProducts() {
  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;
  const maxPrice = parseInt(priceRange.value);

  const selectedCategories = Array.from(categoryChecks)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const selectedFragrances = Array.from(fragranceChecks)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  let filtered = products.filter(product => {
    const name = product.dataset.name.toLowerCase();
    const category = product.dataset.category;
    const fragrance = product.dataset.fragrance;
    const price = parseInt(product.dataset.price);

    return (
      name.includes(searchValue) &&
      (categoryValue === "all" || category === categoryValue) &&
      price <= maxPrice &&
      (selectedCategories.length === 0 || selectedCategories.includes(category)) &&
      (selectedFragrances.length === 0 || selectedFragrances.includes(fragrance))
    );
  });

  // SORT
  if (sortOption.value === "low") {
    filtered.sort((a, b) => a.dataset.price - b.dataset.price);
  } else if (sortOption.value === "high") {
    filtered.sort((a, b) => b.dataset.price - a.dataset.price);
  }

  // RENDER PRODUCTS
  productsContainer.innerHTML = "";
  filtered.forEach(product => productsContainer.appendChild(product));

  // SHOW / HIDE NO RESULTS MESSAGE
  if (filtered.length === 0) {
    const randomMessage = noResultsMessages[Math.floor(Math.random() * noResultsMessages.length)];
    noResults.querySelector(".no-results-text").textContent = randomMessage;
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
  }
}

// ========================================
//Featured Products Slider
// ==========================
// ==========================
// FEATURED SLIDER (FULL)
// ==========================

const featuredSlider = document.getElementById("featuredSlider");
const featLeft = document.getElementById("featLeft");
const featRight = document.getElementById("featRight");

if (featuredSlider && featLeft && featRight) {

  const scrollAmount = 250;
  let autoScrollInterval;

  // 👉 Manual buttons
  featRight.addEventListener("click", () => {
    featuredSlider.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  });

  featLeft.addEventListener("click", () => {
    featuredSlider.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  });

  // 👉 Auto Scroll Function
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {

      // If reached end → go back to start
      if (
        featuredSlider.scrollLeft + featuredSlider.clientWidth >=
        featuredSlider.scrollWidth - 5
      ) {
        featuredSlider.scrollTo({
          left: 0,
          behavior: "smooth"
        });
      } else {
        featuredSlider.scrollBy({
          left: scrollAmount,
          behavior: "smooth"
        });
      }

    }, 3000);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  // 👉 Start auto scroll
  startAutoScroll();

  // 👉 Pause on hover (premium UX)
  featuredSlider.addEventListener("mouseenter", stopAutoScroll);
  featuredSlider.addEventListener("mouseleave", startAutoScroll);

}

// auto scroll every 5 seconds


// ==========================
// FLASH SALE COUNTDOWN
// ==========================

// Set sale end time (change date as needed)
const endTime = new Date().getTime() + (6 * 60 * 60 * 1000); // 6 hours

const countdownEl = document.getElementById("countdown");

const timer = setInterval(() => {
  const now = new Date().getTime();
  const distance = endTime - now;

  if (distance <= 0) {
    clearInterval(timer);
    countdownEl.innerHTML = "Expired";
    return;
  }

  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  countdownEl.innerHTML =
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`;

}, 1000);

