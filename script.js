// Cart object to store selected books
let cart = {};

// DOM elements
let booksGrid;
let cartCounter;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeElements();
    loadBooks();
    initializeBackToTop();
    initializeCartCounter();
});

// Initialize DOM elements
function initializeElements() {
    booksGrid = document.querySelector('.books-grid');
    cartCounter = document.getElementById('cartCounter');
}

// Load books from JSON and render them
async function loadBooks() {
    try {
        const response = await fetch('books.json');
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
        // Fallback to static books if JSON fails
        const fallbackBooks = [
            { id: 1, title: "El Quijote", author: "Miguel de Cervantes", editorial: "Editorial Planeta", price: 24.99 },
            { id: 2, title: "Cien Años de Soledad", author: "Gabriel García Márquez", editorial: "Editorial Sudamericana", price: 19.99 },
            { id: 3, title: "Don Juan Tenorio", author: "José Zorrilla", editorial: "Editorial Espasa", price: 15.99 },
            { id: 4, title: "La Casa de Bernarda Alba", author: "Federico García Lorca", editorial: "Editorial Cátedra", price: 12.99 },
            { id: 5, title: "Pedro Páramo", author: "Juan Rulfo", editorial: "Editorial RM", price: 18.99 },
            { id: 6, title: "Rayuela", author: "Julio Cortázar", editorial: "Editorial Alfaguara", price: 22.99 }
        ];
        renderBooks(fallbackBooks);
    }
}

// Render books in the grid
function renderBooks(books) {
    booksGrid.innerHTML = '';

    books.forEach(book => {
        const bookCard = createBookCard(book);
        booksGrid.appendChild(bookCard);
    });
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
                <p class="book-price">€${book.price.toFixed(2)}</p>
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