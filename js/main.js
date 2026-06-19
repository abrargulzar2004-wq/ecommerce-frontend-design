// JavaScript functionality for eCommerce website

document.addEventListener('DOMContentLoaded', () => {
    console.log('eCommerce site initialized.');
    
    // --- Search Bar Behavior ---
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                alert(`Searching for: ${query}`);
                // In a real app, you would redirect: window.location = `products.html?q=${encodeURIComponent(query)}`;
            } else {
                searchInput.focus();
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // --- Dropdowns (Size/Color) ---
    const setupDropdown = (dropdownId, toggleId) => {
        const dropdown = document.getElementById(dropdownId);
        const toggle = document.getElementById(toggleId);
        
        if (dropdown && toggle) {
            const menu = dropdown.querySelector('.dropdown-menu');
            
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close others first
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    if (m !== menu) m.classList.remove('show');
                });
                menu.classList.toggle('show');
            });
        }
    };

    setupDropdown('colorDropdown', 'colorToggle');
    setupDropdown('sizeDropdown', 'sizeToggle');
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    });
});

// --- Global Functions for HTML onclick handlers ---

// Dropdown Selection
window.selectOption = function(type, value) {
    if (type === 'color') {
        document.getElementById('selectedColor').textContent = value;
    } else if (type === 'size') {
        document.getElementById('selectedSize').textContent = value;
    }
};

// Image Gallery Swapping
window.changeImage = function(element, newImageContent) {
    // Update main image text (mocking image change)
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.textContent = newImageContent;
    }
    
    // Update active thumbnail styling
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
};

// Quantity Selector
window.changeQty = function(change) {
    const qtyInput = document.getElementById('qtyInput');
    if (qtyInput) {
        let current = parseInt(qtyInput.value) || 1;
        let next = current + change;
        if (next < 1) next = 1;
        qtyInput.value = next;
    }
};
