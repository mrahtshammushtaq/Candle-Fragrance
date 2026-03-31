console.log("script.js loaded");
console.log("shop.js loaded");
function toggleMenu() {
  document.querySelector(".menu").classList.toggle("active");
}
const elements = document.querySelectorAll(".fade-up");

window.addEventListener("scroll", () => {
  elements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    if (position < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
});
// Product filtering category showcase
const buttons = document.querySelectorAll(".filter-btn");
const products = document.querySelectorAll(".product-card");

if (buttons.length > 0) {

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      products.forEach(product => {

        if (filter === "all") {
          product.style.display = "block";
        } else {
          if (product.classList.contains(filter)) {
            product.style.display = "block";
          } else {
            product.style.display = "none";
          }
        }

      });

    });
  });

}
// Prodcut Scrollong Animation
const container = document.querySelector(".scroll-container");

if (container) {

  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    container.classList.add("active");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();

    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;

    container.scrollLeft = scrollLeft - walk;
  });

}

// LOAD CART FROM LOCAL STORAGE
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// SAVE CART
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ADD TO CART
function addToCart(name, price, image) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }

  updateCart();
  openCart();
}

// UPDATE CART UI
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  // SAFETY CHECK (prevents errors)
  if (!cartItems || !cartTotal || !cartCount) return;

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" />

        <div class="cart-details">
          <h4>${item.name}</h4>
          <p>$${item.price}</p>

          <div class="cart-controls">
            <button onclick="changeQty(${index}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
            <button onclick="removeItem(${index})">X</button>
          </div>
        </div>
      </div>
    `;
  });

  cartTotal.textContent = total;
  cartCount.textContent = count;

  saveCart(); // ⭐ SAVE EVERY TIME
}

// CHANGE QUANTITY
function changeQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
}

// REMOVE ITEM
function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

// OPEN CART
function openCart() {
  document.getElementById("cartSidebar").classList.add("active");
  document.getElementById("cartOverlay").classList.add("active");
}

// CLOSE CART
function closeCart() {
  document.getElementById("cartSidebar").classList.remove("active");
  document.getElementById("cartOverlay").classList.remove("active");
}

// LOAD CART ON PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
  updateCart();
});

// Javascript accordion for FAQ section
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});
faqItems.forEach(item => {
  item.addEventListener("click", () => {

    faqItems.forEach(i => i.classList.remove("active"));

    item.classList.add("active");
  });
  
});

// ==========================
// Add to Cart Functionality
document.addEventListener("click", function(e) {

  if (e.target.classList.contains("add-to-cart")) {

    console.log("Button clicked"); // debug

    const product = e.target.closest(".product-card");

    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);
    const image = product.querySelector("img").src;

    console.log(name, price, image); // debug

    addToCart(name, price, image);
  }

});