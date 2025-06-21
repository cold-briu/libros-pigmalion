// Cart object to store selected books
let cart = {};

// Pagination variables
let allBooks = [];
let currentPage = 0;
const booksPerPage = 5;

// Snow effect variables
let snowContainer;
let snowflakes = [];
const snowCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

// DOM elements
let booksGrid;
let cartCounter;
let cartModal;
let cartItems;
let cartEmpty;
let cartTotal;
let checkoutBtn;
let closeModal;
let loadMoreBtn;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeElements();
    loadBooks();
    initializeBackToTop();
    initializeCartCounter();
    initializeModal();
    initializeCTAButton();
    initializeSnowEffect();
});

// Initialize DOM elements
function initializeElements() {
    booksGrid = document.querySelector('.books-grid');
    cartCounter = document.getElementById('cartCounter');
    cartModal = document.getElementById('cartModal');
    cartItems = document.getElementById('cartItems');
    cartEmpty = document.getElementById('cartEmpty');
    cartTotal = document.getElementById('cartTotal');
    checkoutBtn = document.getElementById('checkoutBtn');
    closeModal = document.getElementById('closeModal');
    loadMoreBtn = document.getElementById('loadMoreBtn');
    snowContainer = document.getElementById('snowContainer');
}

// Load books from JSON and render them
async function loadBooks() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzSuRLZkqqvlXPNxy9NlorqvXinmR4WoU7PFbqwrc-Te0YMJltl-Kcnnt2HfNUAAeUvig/exec');
        const booksData = await response.json();

        // Transform the data to match our expected format
        const books = booksData.map((book, index) => ({
            id: index + 1, // Generate sequential IDs
            title: book.TITULO,
            author: book.AUTOR,
            editorial: book.EDITORIAL,
            price: book.PRECIO
        }));

        allBooks = books;
        renderBooks();
    } catch (error) {
        console.error('Error loading books:', error);
        // Fallback to static books if JSON fails
        const fallbackBooks = [
            { id: 1, title: "El Quijote", author: "Miguel de Cervantes", editorial: "Editorial Planeta", price: 24999 },
            { id: 2, title: "Cien Años de Soledad", author: "Gabriel García Márquez", editorial: "Editorial Sudamericana", price: 19999 },
            { id: 3, title: "Don Juan Tenorio", author: "José Zorrilla", editorial: "Editorial Espasa", price: 15999 },
            { id: 4, title: "La Casa de Bernarda Alba", author: "Federico García Lorca", editorial: "Editorial Cátedra", price: 12999 },
            { id: 5, title: "Pedro Páramo", author: "Juan Rulfo", editorial: "Editorial RM", price: 18999 },
            { id: 6, title: "Rayuela", author: "Julio Cortázar", editorial: "Editorial Alfaguara", price: 22999 }
        ];
        allBooks = fallbackBooks;
        renderBooks();
    }
}

// Render books in the grid with pagination
function renderBooks() {
    // Only clear the grid on initial load (currentPage === 0)
    if (currentPage === 0) {
        booksGrid.innerHTML = '';
    }

    // Calculate which books to show
    const startIndex = currentPage * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToShow = allBooks.slice(startIndex, endIndex);

    // Append the books for current page (don't clear previous ones)
    booksToShow.forEach(book => {
        const bookCard = createBookCard(book);
        booksGrid.appendChild(bookCard);
    });

    // Show/hide load more button
    if (loadMoreBtn) {
        if (endIndex >= allBooks.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
}

// Create a book card element
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.bookId = book.id;

    const isInCart = cart[book.id];

    card.innerHTML = `
        <div class="book-image">
            <div class="image-placeholder"></div>
        </div>
        <div class="book-content">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-editorial">${book.editorial}</p>
                <p class="book-price">$${book.price.toFixed(0)}</p>
            </div>
            <button class="add-to-cart-btn ${isInCart ? 'in-cart' : ''}" data-book-id="${book.id}">
                ${isInCart ? 'Quitar del Carrito' : 'Añadir al Carrito'}
            </button>
        </div>
    `;

    // Add event listener to the button
    const button = card.querySelector('.add-to-cart-btn');
    button.addEventListener('click', () => toggleCartItem(book, button));

    return card;
}

// Toggle book in cart
function toggleCartItem(book, button) {
    const bookId = book.id;

    if (cart[bookId]) {
        // Remove from cart
        delete cart[bookId];
        button.textContent = 'Añadir al Carrito';
        button.classList.remove('in-cart');
    } else {
        // Add to cart
        cart[bookId] = {
            id: book.id,
            title: book.title,
            author: book.author,
            editorial: book.editorial,
            price: book.price
        };
        button.textContent = 'Quitar del Carrito';
        button.classList.add('in-cart');
    }

    updateCartCounter();
}

// Update cart counter display
function updateCartCounter() {
    const cartCount = Object.keys(cart).length;

    if (cartCount > 0) {
        cartCounter.classList.add('show');
        cartCounter.querySelector('.cart-count').textContent = cartCount;
    } else {
        cartCounter.classList.remove('show');
    }
}

// Initialize back to top functionality
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Smooth scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize cart counter
function initializeCartCounter() {
    // Cart counter is already in HTML, just initialize the display
    updateCartCounter();
}

// Initialize modal functionality
function initializeModal() {
    // Open modal when cart counter is clicked
    cartCounter.addEventListener('click', openModal);

    // Close modal when close button is clicked
    closeModal.addEventListener('click', closeModalFunction);

    // Close modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeModalFunction();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartModal.classList.contains('show')) {
            closeModalFunction();
        }
    });

    // Handle checkout button
    checkoutBtn.addEventListener('click', handleCheckout);

    // Handle load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMore);
    }
}

// Open modal
function openModal() {
    cartModal.classList.add('show');
    renderCartItems();
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close modal
function closeModalFunction() {
    cartModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
}

// Render cart items in modal
function renderCartItems() {
    const cartItemsArray = Object.values(cart);

    if (cartItemsArray.length === 0) {
        cartItems.classList.remove('show');
        cartEmpty.classList.add('show');
        checkoutBtn.disabled = true;
        cartTotal.textContent = '$0';
        return;
    }

    cartEmpty.classList.remove('show');
    cartItems.classList.add('show');
    checkoutBtn.disabled = false;

    // Calculate total
    const total = cartItemsArray.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `$${total.toFixed(0)}`;

    // Render cart items
    cartItems.innerHTML = cartItemsArray.map(item => `
        <div class="cart-item" data-book-id="${item.id}">
            <div class="cart-item-image"></div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-author">${item.author}</p>
                <p class="cart-item-editorial">${item.editorial}</p>
                <p class="cart-item-price">$${item.price.toFixed(0)}</p>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Quitar del carrito">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
}

// Remove item from cart (called from modal)
function removeFromCart(bookId) {
    if (cart[bookId]) {
        delete cart[bookId];

        // Update the corresponding book card button
        const bookCard = document.querySelector(`[data-book-id="${bookId}"]`);
        if (bookCard) {
            const button = bookCard.querySelector('.add-to-cart-btn');
            button.textContent = 'Añadir al Carrito';
            button.classList.remove('in-cart');
        }

        updateCartCounter();
        renderCartItems();
    }
}

// Handle checkout
function handleCheckout() {
    const cartItemsArray = Object.values(cart);
    if (cartItemsArray.length === 0) return;

    const total = cartItemsArray.reduce((sum, item) => sum + item.price, 0);

    // Create WhatsApp message
    const message = createWhatsAppMessage(cartItemsArray, total);

    // Create WhatsApp link
    const whatsappLink = createWhatsAppLink(message);

    // Open WhatsApp in new tab
    window.open(whatsappLink, '_blank');

    // Clear cart after checkout
    cart = {};
    updateCartCounter();
    renderCartItems();
    closeModalFunction();

    // Update all book card buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.textContent = 'Añadir al Carrito';
        button.classList.remove('in-cart');
    });
}

// Create WhatsApp message with cart summary
function createWhatsAppMessage(cartItems, total) {
    const itemsList = cartItems.map(item =>
        `• ${item.title} - ${item.author} ($${item.price.toFixed(0)})`
    ).join('\n');

    return `¡Hola! Me gustaría hacer un pedido de libros:\n\n${itemsList}\n\nTotal: $${total.toFixed(0)}\n\n¿Podrías ayudarme con este pedido?`;
}

// Create WhatsApp wa.me link
function createWhatsAppLink(message) {
    const phoneNumber = '573117496444'; // +57 3117496444 without special characters
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// Initialize CTA button
function initializeCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Scroll to gallery section
            const gallerySection = document.querySelector('.gallery');
            if (gallerySection) {
                gallerySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Initialize snow effect
function initializeSnowEffect() {
    if (!snowContainer) return;

    // Create initial snowflakes
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createSnowflake();
        }, i * 200);
    }

    // Continue creating snowflakes periodically
    setInterval(() => {
        if (snowflakes.length < 20) {
            createSnowflake();
        }
    }, 1000);
}

// Create a single snowflake
function createSnowflake() {
    if (!snowContainer) return;

    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';

    // Random character from the array
    const randomChar = snowCharacters[Math.floor(Math.random() * snowCharacters.length)];
    snowflake.textContent = randomChar;

    // Random position and animation duration
    const startX = Math.random() * window.innerWidth;
    const animationDuration = 8 + Math.random() * 12; // 8-20 seconds
    const startDelay = Math.random() * 2; // 0-2 seconds delay

    snowflake.style.left = startX + 'px';
    snowflake.style.animationDuration = animationDuration + 's';
    snowflake.style.animationDelay = startDelay + 's';

    // Add to container
    snowContainer.appendChild(snowflake);
    snowflakes.push(snowflake);

    // Remove snowflake after animation completes
    setTimeout(() => {
        if (snowflake.parentNode) {
            snowflake.parentNode.removeChild(snowflake);
            const index = snowflakes.indexOf(snowflake);
            if (index > -1) {
                snowflakes.splice(index, 1);
            }
        }
    }, (animationDuration + startDelay) * 1000);
}

// Load more books
function loadMore() {
    // Store current scroll position
    const currentScrollPosition = window.pageYOffset;

    currentPage++;
    renderBooks();

    // Smooth scroll to the last book rendered while maintaining scroll position
    setTimeout(() => {
        const books = booksGrid.querySelectorAll('.book-card');
        if (books.length > 0) {
            const lastBook = books[books.length - 1];
            const offsetTop = lastBook.offsetTop - 100; // 100px offset from top

            // Only scroll if the new content is below current position
            if (offsetTop > currentScrollPosition) {
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }, 100); // Small delay to ensure DOM is updated
} 