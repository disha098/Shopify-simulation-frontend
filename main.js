// Shopify Store JavaScript - Interactive Features

// Global variables
let cart = [];
let cartCount = 0;
let currentQuantity = 1;
let isCartOpen = false;
let isModalOpen = false;

// Product data (simulating Shopify/Liquid data)
const products = {
    1: {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 299.99,
        originalPrice: 399.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center",
        category: "Electronics",
        rating: 4.9,
        reviews: 1247,
        description: "Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design for all-day listening.",
        features: [
            "Active Noise Cancellation",
            "30-Hour Battery Life",
            "Wireless & Wired Options",
            "Premium Build Quality"
        ],
        inStock: true,
        stock: 15
    },
    2: {
        id: 2,
        name: "Smart Watch Pro",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        category: "Electronics",
        rating: 4.2,
        reviews: 856,
        description: "Stay connected and track your fitness with our advanced smartwatch featuring health monitoring, GPS, and long-lasting battery.",
        features: [
            "Health Monitoring",
            "GPS Tracking",
            "Water Resistant",
            "7-Day Battery Life"
        ],
        inStock: true,
        stock: 8
    },
    3: {
        id: 3,
        name: "Premium Running Shoes",
        price: 149.99,
        originalPrice: 179.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        category: "Sports",
        rating: 4.8,
        reviews: 2341,
        description: "Engineered for performance and comfort, these running shoes provide excellent cushioning and support for all types of runners.",
        features: [
            "Advanced Cushioning",
            "Breathable Material",
            "Durable Outsole",
            "Lightweight Design"
        ],
        inStock: true,
        stock: 22
    },
    4: {
        id: 4,
        name: "Ultrabook Pro",
        price: 1299.99,
        originalPrice: 1499.99,
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop",
        category: "Electronics",
        rating: 4.9,
        reviews: 567,
        description: "Powerful and portable laptop with cutting-edge technology, perfect for professionals and creatives who demand the best performance.",
        features: [
            "Intel i7 Processor",
            "16GB RAM",
            "512GB SSD",
            "4K Display"
        ],
        inStock: true,
        stock: 5
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize event listeners
    initializeNavigation();
    initializeCart();
    initializeProductInteractions();
    initializeScrollEffects();
    initializeAnimations();
    
    // Load cart from localStorage
    loadCart();
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    
    console.log('Shopify Store initialized successfully');
}

// Navigation functionality
function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Cart functionality
function initializeCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.querySelector('.close-cart');
    
    // Open cart
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
    
    // Close cart
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (isCartOpen && !cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
            closeCart();
        }
    });
    
    // Prevent cart from closing when clicking inside
    if (cartSidebar) {
        cartSidebar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.add('open');
    isCartOpen = true;
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.remove('open');
    isCartOpen = false;
    document.body.style.overflow = '';
}

function addToCart(productId = 1, quantity = 1) {
    const product = products[productId];
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Update cart count
    cartCount += quantity;
    
    // Save to localStorage
    saveCart();
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    
    // Show success message
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Animate cart button
    animateCartButton();
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;
    
    const item = cart[itemIndex];
    cartCount -= item.quantity;
    cart.splice(itemIndex, 1);
    
    // Save to localStorage
    saveCart();
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    
    showNotification(`${item.name} removed from cart!`, 'info');
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    
    // Render cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const quantityDiff = newQuantity - item.quantity;
    item.quantity = newQuantity;
    cartCount += quantityDiff;
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function saveCart() {
    localStorage.setItem('shopify-cart', JSON.stringify(cart));
    localStorage.setItem('shopify-cart-count', cartCount.toString());
}

function loadCart() {
    const savedCart = localStorage.getItem('shopify-cart');
    const savedCount = localStorage.getItem('shopify-cart-count');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (savedCount) {
        cartCount = parseInt(savedCount);
    }
}

// Product interactions
function initializeProductInteractions() {
    // Quantity controls
    window.decreaseQuantity = function() {
        if (currentQuantity > 1) {
            currentQuantity--;
            updateQuantityDisplay();
        }
    };
    
    window.increaseQuantity = function() {
        if (currentQuantity < 10) { // Max quantity limit
            currentQuantity++;
            updateQuantityDisplay();
        }
    };
    
    // Product actions
    window.buyNow = function() {
        const productId = 1; // Featured product
        addToCart(productId, currentQuantity);
        
        // Simulate checkout process
        showNotification('Redirecting to checkout...', 'info');
        setTimeout(() => {
            showNotification('Checkout simulation complete!', 'success');
        }, 2000);
    };
    
    window.addToCart = function() {
        const productId = 1; // Featured product
        addToCart(productId, currentQuantity);
    };
    
    // Quick view modal
    window.quickView = function() {
        openModal();
    };
    
    window.closeModal = function() {
        closeModal();
    };
    
    // Product selection
    window.selectProduct = function(productId) {
        const product = products[productId];
        if (!product) return;
        
        // Update featured product display
        updateFeaturedProduct(product);
        showNotification(`Viewing ${product.name}`, 'info');
    };
}

function updateQuantityDisplay() {
    const quantityElement = document.getElementById('quantity');
    if (quantityElement) {
        quantityElement.textContent = currentQuantity;
    }
}

function updateFeaturedProduct(product) {
    // Update product image
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.src = product.image;
        productImage.alt = product.name;
    }
    
    // Update product info
    const productName = document.querySelector('.product-name');
    if (productName) {
        productName.textContent = product.name;
    }
    
    const currentPrice = document.getElementById('currentPrice');
    if (currentPrice) {
        currentPrice.textContent = `$${product.price.toFixed(2)}`;
    }
    
    const originalPrice = document.getElementById('originalPrice');
    if (originalPrice) {
        originalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
    }
    
    // Update rating
    const ratingText = document.querySelector('.rating-text');
    if (ratingText) {
        ratingText.textContent = `(${product.rating}) • ${product.reviews} reviews`;
    }
    
    // Update description
    const description = document.querySelector('.product-description');
    if (description) {
        description.textContent = product.description;
    }
    
    // Update features
    const featuresContainer = document.querySelector('.product-features');
    if (featuresContainer) {
        featuresContainer.innerHTML = product.features.map(feature => `
            <div class="feature">
                <i class="fas fa-check"></i>
                <span>${feature}</span>
            </div>
        `).join('');
    }
}

// Modal functionality
function openModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.classList.add('show');
        isModalOpen = true;
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.classList.remove('show');
        isModalOpen = false;
        document.body.style.overflow = '';
    }
}

// Scroll effects
function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.product-card, .product-item, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// Animations
function initializeAnimations() {
    // Add CSS classes for animations
    const style = document.createElement('style');
    style.textContent = `
        .product-card, .product-item, .section-header {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        .product-card.animate-in, .product-item.animate-in, .section-header.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .header.scrolled {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
        }
        
        .cart-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .cart-item-image {
            width: 60px;
            height: 60px;
            border-radius: var(--radius-md);
            overflow: hidden;
        }
        
        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .cart-item-info {
            flex: 1;
        }
        
        .cart-item-info h4 {
            font-size: var(--font-size-sm);
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .cart-item-price {
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .cart-item-quantity button {
            width: 24px;
            height: 24px;
            border: 1px solid var(--border-color);
            background: var(--white);
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
        
        .cart-item-quantity button:hover {
            background: var(--bg-secondary);
        }
        
        .remove-item {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: var(--radius-md);
            transition: all var(--transition-fast);
        }
        
        .remove-item:hover {
            background: var(--danger-color);
            color: var(--white);
        }
        
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--white);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 4000;
            transform: translateX(400px);
            transition: transform var(--transition-normal);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid var(--success-color);
        }
        
        .notification.error {
            border-left: 4px solid var(--danger-color);
        }
        
        .notification.info {
            border-left: 4px solid var(--primary-color);
        }
        
        .cart-btn.animate {
            animation: pulse 0.6s ease-in-out;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
}

// Utility functions
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function animateCartButton() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.classList.add('animate');
        setTimeout(() => {
            cartBtn.classList.remove('animate');
        }, 600);
    }
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Simulate API call
    showNotification('Subscribing to newsletter...', 'info');
    
    setTimeout(() => {
        showNotification('Successfully subscribed to newsletter!', 'success');
        event.target.reset();
    }, 1500);
}

// Checkout simulation
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    showNotification('Processing checkout...', 'info');
    
    setTimeout(() => {
        showNotification('Checkout completed successfully!', 'success');
        cart = [];
        cartCount = 0;
        saveCart();
        updateCartCount();
        updateCartDisplay();
        closeCart();
    }, 2000);
}

// Search functionality
function initializeSearch() {
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            showNotification('Search functionality coming soon!', 'info');
        });
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        if (isModalOpen) {
            closeModal();
        }
        if (isCartOpen) {
            closeCart();
        }
    }
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for global access
window.scrollToProducts = scrollToProducts;
window.buyNow = buyNow;
window.addToCart = addToCart;
window.quickView = quickView;
window.closeModal = closeModal;
window.selectProduct = selectProduct;
window.decreaseQuantity = decreaseQuantity;
window.increaseQuantity = increaseQuantity;
window.subscribeNewsletter = subscribeNewsletter;
window.checkout = checkout;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.closeCart = closeCart;
