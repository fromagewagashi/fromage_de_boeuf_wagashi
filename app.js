

// app.js
// Gestion centralisée du panier / navigation produit → product.html

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  // afficher la somme des quantités (si item.quantity existe)
  const qty = cart.reduce((s, it) => s + (Number(it.quantity) || 1), 0);
  el.textContent = String(qty);
}

// Ouvrir la page produit (index.html appelle cette fonction)
function goToProduct(name, price, image, description) {
  const product = {
    name: String(name || ''),
    price: Number(price) || 0,
    image: image || '',
    description: description || '',
    quantity: 1
  };
  localStorage.setItem('selectedProduct', JSON.stringify(product));
  window.location.href = 'product.html';
}

// Ajouter un item au panier (gère aggregation par nom+image)
function addToCart(item) {
  const it = {
    name: String(item.name || ''),
    price: Number(item.price) || 0,
    image: item.image || '',
    description: item.description || '',
    quantity: Number(item.quantity) || 1
  };

  const index = cart.findIndex(c => c.name === it.name && c.image === it.image);
  if (index > -1) {
    cart[index].quantity = (Number(cart[index].quantity) || 1) + it.quantity;
  } else {
    cart.push(it);
  }
  saveCart();
}

// Utilitaire simple pour appeler addToCart depuis attributs HTML
function addToCartFromParams(name, price, image, description, qty = 1) {
  addToCart({name, price, image, description, quantity: qty});
  alert(name + " ajouté au panier");
}

// Vider le panier
function clearCart() {
  cart = [];
  saveCart();
}

// Pour usage immédiat (ex : bouton "Commander maintenant" depuis product.html)
function buyNow(item) {
  // Remplace le panier par cet item, puis redirige vers checkout
  cart = [Object.assign({}, {
    name: item.name,
    price: Number(item.price) || 0,
    image: item.image || '',
    description: item.description || '',
    quantity: Number(item.quantity) || 1
  })];
  saveCart();
  window.location.href = 'checkout.html';
}

// Au chargement des pages : mettre à jour compteur (s'il y a)
document.addEventListener('DOMContentLoaded', updateCartCount);





























// 6 avis dynamiques
const reviews = [
  { name: "Abibou Garba", date: "2024-12-13", avatar: "A",
    text: "Qualité des produits 👍🏽\nLivraison 👍🏽\nDès que c’est fini on recommande" },
  { name: "Fatou T.", date: "2025-01-08", avatar: "F",
    text: "Livraison rapide et produit bien emballé 👌🏽\nTrès satisfaite !" },
  { name: "Youssouf B.", date: "2025-02-02", avatar: "Y",
    text: "Top qualité. Je recommande vivement 💯" },
  { name: "Clarisse A.", date: "2025-03-14", avatar: "C",
    text: "Franchement super bon, naturel et savoureux 😍" },
  { name: "Dramane S.", date: "2025-04-05", avatar: "D",
    text: "Service client disponible et agréable. Très bonne expérience." },
  { name: "Aïcha Z.", date: "2025-05-19", avatar: "A",
    text: "J’ai commandé plusieurs fois, jamais déçue 💕" }
];

const container = document.getElementById('reviews-container');

// On crée une seule carte et on met à jour son contenu
let currentIndex = 0;
const card = document.createElement('div');
card.className = 'review-card';
container.appendChild(card);

function tplHeaderLeft(r) {
  // Si plus tard tu veux une image d'avatar:
  // return `<img src="image/ton-avatar.jpg" class="avatar-img" alt="${r.name}">`;
  return `<div class="avatar">${r.avatar}</div>`;
}

function updateReview(index) {
  const r = reviews[index];
  card.innerHTML = `
    <div class="review-header">
      <div class="avatar">${r.avatar}</div>
      <div>
        <h3>${r.name}</h3>
        <p class="date">${r.date}</p>
      </div>
      <img src="image/google logo.png" class="g-icon" />
    </div>
    <div class="review-stars">★★★★★ <span class="verified">✔</span></div>
    <div class="review-text"><p>${r.text.replace(/\n/g, "<br>")}</p></div>
    <a class="read-more" href="#">Lire la suite</a>
  `;
}


// Animation: fade-out puis fade-in toutes les 4s
function showNextReview() {
  card.classList.remove('show');      // fade-out
  setTimeout(() => {
    updateReview(currentIndex);       // changer le contenu quand invisible
    card.classList.add('show');       // fade-in
    currentIndex = (currentIndex + 1) % reviews.length;
  }, 1000); // 1s = durée du fade-out (voir CSS)
}

// Init
updateReview(currentIndex);
card.classList.add('show');
currentIndex++;

// Boucle toutes les 4 secondes
setInterval(showNextReview, 4000);
