// Sample product data
const products = [
  { id: 1, name: "Watermelon", category: "Fruits", price: 8, description: "Juicy and sweet watermelon, perfect for summer", image: "images/1.jpg" },
  { id: 2, name: "Organic Apple", category: "Fruits", price: 5, description: "Fresh, crisp organic apples from local orchards", image: "images/2.jpg" },
  { id: 3, name: "Whole Wheat Bread", category: "Bakery", price: 8, description: "Nutritious whole wheat bread, perfect for sandwiches", image: "images/3.jpg" },
  { id: 4, name: "Cheddar Cheese", category: "Dairy", price: 15, description: "Sharp cheddar cheese, aged to perfection", image: "images/4.jpg" },
  { id: 5, name: "Green Tea", category: "Beverages", price: 12, description: "Premium green tea leaves for a soothing experience", image: "images/5.jpg" },
  { id: 6, name: "Almond Milk", category: "Dairy", price: 9, description: "Smooth and creamy almond milk, a dairy-free alternative", image: "images/6.jpg" },
  { id: 7, name: "Banana", category: "Fruits", price: 2, description: "Sweet and ripe bananas, perfect for snacking", image: "images/7.jpg" },
  { id: 8, name: "Sourdough Bread", category: "Bakery", price: 7, description: "Artisan sourdough bread with a tangy flavor", image: "images/8.jpg" },
  { id: 9, name: "Orange Juice", category: "Beverages", price: 6, description: "Freshly squeezed orange juice, full of vitamin C", image: "images/9.jpg" },
  { id: 10, name: "Greek Yogurt", category: "Dairy", price: 11, description: "Thick and creamy Greek yogurt, perfect for breakfast", image: "images/10.jpg" },
];


let cart = [];


const productsContainer = document.getElementById('productsContainer');
const categoryFilters = document.getElementById('categoryFilters');
const priceSort = document.getElementById('priceSort');
const searchInput = document.getElementById('searchInput');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const themeToggle = document.getElementById('darkModeSwitch');




function displayProducts(productsToShow) {
  productsContainer.innerHTML = '';
  productsToShow.forEach(product => {
    const productCard = `
          <div class="col">
              <div class="card h-100">
                  <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                  <div class="card-body">
                      <h5 class="card-title">${product.name}</h5>
                      <p class="card-text">${product.description}</p>
                      <p class="card-text"><strong>Price: $${product.price}</strong></p>
                      <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                  </div>
              </div>
          </div>
      `;
    productsContainer.innerHTML += productCard;
  });


  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
  });
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function createCategoryFilters() {
  const categories = [...new Set(products.map(product => product.category))];
  categories.forEach(category => {
    const checkbox = `
          <div class="form-check">
              <input class="form-check-input category-filter" type="checkbox" value="${category}" id="${category}">
              <label class="form-check-label" for="${category}">${category}</label>
          </div>
      `;
    categoryFilters.innerHTML += checkbox;
  });

  document.querySelectorAll('.category-filter').forEach(filter => {
    filter.addEventListener('change', filterProducts);
  });
}


function filterProducts() {
  const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(filter => filter.value);
  const searchTerm = searchInput.value.toLowerCase();
  const sortOrder = priceSort.value;

  let filteredProducts = products;

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter(product => selectedCategories.includes(product.category));
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  filteredProducts.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  displayProducts(filteredProducts);
}


function addToCart(event) {
  const productId = parseInt(event.target.getAttribute('data-id'));
  const product = products.find(p => p.id === productId);

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartCount();
  saveCart();
}


function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.innerText = totalItems;
}




function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}


function displayCartItems() {
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItemHTML = `
          <div class="cart-item">
              <h5>${item.name}</h5>
              <p>Price: $${item.price}</p>
              <p>
                  Quantity: 
                  <button class="btn btn-sm btn-secondary decrease-quantity" data-id="${item.id}">-</button>
                  <span class="quantity">${item.quantity}</span>
                  <button class="btn btn-sm btn-secondary increase-quantity" data-id="${item.id}">+</button>
              </p>
              <p>Total: $${itemTotal.toFixed(2)}</p>
              <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">Remove</button>
          </div>
      `;
    cartItems.innerHTML += cartItemHTML;
  });

  cartTotal.textContent = total.toFixed(2);


  document.querySelectorAll('.decrease-quantity').forEach(btn => btn.addEventListener('click', decreaseQuantity));
  document.querySelectorAll('.increase-quantity').forEach(btn => btn.addEventListener('click', increaseQuantity));
  document.querySelectorAll('.remove-item').forEach(btn => btn.addEventListener('click', removeItem));
}


function decreaseQuantity(event) {
  const productId = parseInt(event.target.getAttribute('data-id'));
  const item = cart.find(item => item.id === productId);
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter(item => item.id !== productId);
  }
  updateCartCount();
  saveCart();
  displayCartItems();
}

function increaseQuantity(event) {
  const productId = parseInt(event.target.getAttribute('data-id'));
  const item = cart.find(item => item.id === productId);
  item.quantity += 1;
  updateCartCount();
  saveCart();
  displayCartItems();
}


function removeItem(event) {
  const productId = parseInt(event.target.getAttribute('data-id'));
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  saveCart();
  displayCartItems();
}


function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}


priceSort.addEventListener('change', filterProducts);
searchInput.addEventListener('input', filterProducts);
cartBtn.addEventListener('click', () => {
  displayCartItems();
  new bootstrap.Modal(document.getElementById('cartModal')).show();
});
checkoutBtn.addEventListener('click', () => {
  alert('Thank you for your purchase!');
  cart = [];
  saveCart();
  updateCartCount();
  new bootstrap.Modal(document.getElementById('cartModal')).hide();
});
themeToggle.addEventListener('click', toggleTheme);


if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}


function init() {
  displayProducts(products);
  createCategoryFilters();
  loadCart();
  updateCartCount();
}


init();