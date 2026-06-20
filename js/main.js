// ==========================================
// ECOMMERCE JAVASCRIPT LOGIC & STATE
// ==========================================

// --- State Management ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// --- Global Catalog Data ---
const catalog = [
    { id: '1', name: 'Premium Cotton T-Shirt', price: 10.30, category: 'Clothing', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80' },
    { id: '2', name: 'Brown Winter Coat', price: 120.50, category: 'Clothing', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80' },
    { id: '3', name: 'Canvas Travel Bag', price: 34.00, category: 'Accessories', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80' },
    { id: '4', name: 'Leather Men\'s Wallet', price: 99.00, category: 'Accessories', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80' },
    { id: '5', name: 'Professional DSLR Camera', price: 1299.99, category: 'Electronics', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80' },
    { id: '6', name: 'Wireless Headphones', price: 299.00, category: 'Electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
    { id: '7', name: 'Smart Watch Series 7', price: 399.00, category: 'Electronics', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
    { id: '8', name: 'Minimalist Desk Lamp', price: 45.00, category: 'Home', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80' },
    { id: '9', name: 'Modern Sofa Chair', price: 150.00, category: 'Home', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300&q=80' },
    { id: '10', name: 'Ceramic Kitchen Dishes', price: 25.00, category: 'Home', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&q=80' },
    { id: '11', name: 'Ultra-thin Laptop 16GB', price: 1499.00, category: 'Electronics', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80' },
    { id: '12', name: 'Classic Sunglasses', price: 85.00, category: 'Accessories', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80' },
    { id: '13', name: 'Vibrant Yellow Sneakers', price: 110.00, category: 'Clothing', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80' },
    { id: '14', name: 'Colorful Urban Backpack', price: 45.00, category: 'Accessories', img: 'https://images.unsplash.com/photo-1491472253230-a044054ca35f?w=300&q=80' },
    { id: '15', name: 'Classic Leather Watch', price: 199.00, category: 'Accessories', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&q=80' },
    { id: '16', name: 'Bright Morning Coffee Mug', price: 15.00, category: 'Home', img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&q=80' }
];

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // --- Custom Dropdowns ---
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const parent = this.parentElement;
            document.querySelectorAll('.custom-dropdown').forEach(d => {
                if(d !== parent) d.classList.remove('active');
            });
            parent.classList.toggle('active');
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-dropdown').forEach(d => {
            d.classList.remove('active');
        });
    });

    // --- Detail Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Initialize cart page if on cart
    if(window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
    
    // Initialize checkout page if on checkout
    if(window.location.pathname.includes('checkout.html')) {
        renderCheckoutSummary();
    }
});

// --- Core Actions ---

function addToCart(productId) {
    const product = catalog.find(p => p.id === productId);
    if (!product) {
        // Fallback for hardcoded HTML elements
        const card = document.querySelector(`.product-card[data-id="${productId}"]`);
        if (card) {
            cart.push({
                id: productId,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                img: card.dataset.img,
                qty: 1
            });
        }
    } else {
        // Find if already exists
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast('Added to cart successfully!');
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    badges.forEach(b => b.innerText = count);
}

function showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `✓ ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function toggleWishlist(e, element) {
    e.preventDefault();
    if(element.style.color === 'var(--danger)') {
        element.style.color = '';
        showToast('Removed from wishlist');
    } else {
        element.style.color = 'var(--danger)';
        showToast('Added to wishlist!');
    }
}

// --- Detail Page Handlers ---

function selectOption(type, value) {
    if (type === 'color') document.getElementById('selectedColor').innerText = value;
    else if (type === 'size') document.getElementById('selectedSize').innerText = value;
}

function changeProductImage(element, src) {
    const mainImg = document.getElementById('mainImgNode');
    if (mainImg) mainImg.src = src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

function changeQty(amount) {
    const input = document.getElementById('qtyInput');
    if (input) {
        let val = parseInt(input.value);
        if (isNaN(val)) val = 1;
        val += amount;
        if (val < 1) val = 1;
        input.value = val;
    }
}

// --- Dynamic Rendering (Products Page) ---

function renderProductsGrid() {
    const container = document.getElementById('productGridContainer');
    if(!container) return;
    
    container.innerHTML = '';
    
    // Filtering logic
    const categoryInputs = document.querySelectorAll('#categoryFilters input:checked');
    const activeCategories = Array.from(categoryInputs).map(i => i.value);
    
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    
    let filtered = catalog.filter(p => {
        const inCategory = activeCategories.length === 0 || activeCategories.includes(p.category);
        const inPrice = p.price >= minPrice && p.price <= maxPrice;
        return inCategory && inPrice;
    });
    
    // Sorting logic
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        if(sortSelect.value === 'low-high') filtered.sort((a,b) => a.price - b.price);
        if(sortSelect.value === 'high-low') filtered.sort((a,b) => b.price - a.price);
    }
    
    document.getElementById('productCountLabel').innerText = `${filtered.length} items`;
    
    if(filtered.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:50px;">No products found.</p>';
        return;
    }
    
    filtered.forEach(p => {
        container.innerHTML += `
            <div class="product-card" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}">
                <a href="product-detail.html" class="product-image">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="wishlist-btn" onclick="toggleWishlist(event, this)">♡</div>
                </a>
                <div class="product-info">
                    <div class="product-price">$${p.price.toFixed(2)}</div>
                    <a href="product-detail.html" class="product-title">${p.name}</a>
                    <button class="add-to-cart-btn" onclick="addToCart('${p.id}')">Add to Cart</button>
                </div>
            </div>
        `;
    });
}

window.applyFilters = function() {
    renderProductsGrid();
};

// --- Dynamic Rendering (Cart Page) ---

function renderCartPage() {
    const cartItemsContainer = document.getElementById('cartItemsList');
    if(!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty. <a href="products.html" style="color:var(--accent-color);">Continue shopping</a></p>';
    } else {
        cart.forEach((item, index) => {
            subtotal += item.price * item.qty;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-img">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-options">Qty: ${item.qty}</div>
                        <div class="cart-item-actions">
                            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                            <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    document.getElementById('cartCountTitle').innerText = `Your Cart (${cart.length} items)`;
    
    const tax = subtotal > 0 ? 15.00 : 0;
    const shipping = subtotal > 0 ? 10.00 : 0;
    const total = subtotal + tax + shipping;
    
    document.getElementById('subtotalPrice').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxPrice').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('shippingPrice').innerText = `$${shipping.toFixed(2)}`;
    document.getElementById('totalPrice').innerText = `$${total.toFixed(2)}`;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCartPage();
    showToast('Item removed');
}

// --- Dynamic Rendering (Checkout Page) ---
function renderCheckoutSummary() {
    const container = document.getElementById('checkoutSummaryBox');
    if(!container) return;
    
    let subtotal = 0;
    cart.forEach(item => { subtotal += item.price * item.qty; });
    
    const tax = subtotal > 0 ? 15.00 : 0;
    const shipping = subtotal > 0 ? 10.00 : 0;
    const total = subtotal + tax + shipping;
    
    const itemCount = cart.reduce((acc, item) => acc + item.qty, 0);
    
    container.innerHTML = `
        <h2 class="section-title">Order Summary</h2>
        <div style="margin-bottom:15px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="color:var(--text-light)">${itemCount} Items</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="color:var(--text-light)">Shipping</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="color:var(--text-light)">Tax</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:15px; padding-top:15px; border-top:1px solid var(--border-color); font-weight:700; font-size:20px;">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
        <button type="submit" class="place-order-btn" onclick="clearCart()">Place Order</button>
    `;
}

window.clearCart = function() {
    localStorage.removeItem('cart');
    cart = [];
}
