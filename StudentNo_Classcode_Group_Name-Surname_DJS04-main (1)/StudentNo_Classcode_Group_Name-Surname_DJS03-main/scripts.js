// importing necessary data from data.js file - UNCHANGED
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';


// CHANGED - ADDED
// Define the BookPreview class
// A static getter method used to specify which attributes of BookPreview should be monitored for changes
class BookPreview extends HTMLElement {
    static get observedAttributes() {
        return ['author', 'id', 'image', 'title'];
    }

    constructor() {
        super(); // is used to call the constructor of the parent class - HTMLElement
        this.attachShadow({ mode: 'open' });  // attaches a shadow DOM to the custom element
        // { mode: 'open' } indicates that the shadow DOM is open for manipulation from outside the component
    }

    connectedCallback() {  // one of the lifecycle callbacks provided by the Custom Elements API
        this.render();     // is a method defined within the BookPreview class responsible for rendering the content of the custom element
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {  // checks whether the new value of the attribute is different from the old value
            this.render();            //  ensures that the custom element reflects the updated state whenever one of its observed attributes changes
        }
    }
    
    // CHANGE - ADDED
    // render() method generates the HTML markup for a book preview based on the attributes of the custom element
    // Responsible for generating the HTML markup for rendering a book preview within a custom HTML element
    render() {
        const author = this.getAttribute('author');
        const id = this.getAttribute('id');
        const image = this.getAttribute('image');
        const title = this.getAttribute('title');

        // CHANGED - ADDED 
        // Creating template
        const template = document.createElement('template');
        // <style> block containing CSS styles specific to the book preview
        template.innerHTML = `
            <style>
                .preview {
                    border-width: 0;
                    width: 100%;
                    font-family: Roboto, sans-serif;
                    padding: 0.5rem 1rem;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    text-align: left;
                    border-radius: 8px;
                    border: 1px solid rgba(var(--color-dark), 0.15);
                    background: rgba(var(--color-light), 1);
                }

                @media (min-width: 60rem) {
                    .preview {
                        padding: 1rem;
                    }
                }

                .preview_hidden {
                    display: none;
                }

                .preview:hover {
                    background: rgba(var(--color-blue), 0.05);
                }

                .preview__image {
                    width: 48px;
                    height: 70px;
                    object-fit: cover;
                    background: grey;
                    border-radius: 2px;
                    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
                                0px 1px 1px 0px rgba(0, 0, 0, 0.1), 
                                0px 1px 3px 0px rgba(0, 0, 0, 0.1);
                }

                .preview__info {
                    padding: 1rem;
                }

                .preview__title {
                    margin: 0 0 0.5rem;
                    font-weight: bold;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;  
                    overflow: hidden;
                    color: rgba(var(--color-dark), 0.8);
                }

                .preview__author {
                    color: rgba(var(--color-dark), 0.4);
                }
            </style>
            <button class="preview" data-preview="${id}">
                <img class="preview__image" src="${image}" alt="${title}" />
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            </button>
        `;

        this.shadowRoot.innerHTML = ''; // clears the existing content of the shadow DOM of the custom element
        this.shadowRoot.appendChild(template.content.cloneNode(true)); // appends the content of the template to the shadow DOM of the custom element
    }
}

// Register the custom element

// CHANGED - ADDED
// Method provided by the Custom Elements API
customElements.define('book-preview', BookPreview);

// UNCHANGED
// Initializing Variables 
let page = 1;
let matches = books; // Initially, matches contain all books

// UNCHANGED
// Utility function to get a DOM element
// takes a CSS selector as input and returns the first element in the document that matches the selector
const getElement = (selector) => document.querySelector(selector);

// CHANGED - LESS CODE
// Function to create and append book previews using the Web Component  
// This function is responsible for creating and appending book previews to a specified container element
const createBookPreviews = (books, container) => {
    const fragment = document.createDocumentFragment();
    books.forEach(({ author, id, image, title }) => {
        const element = document.createElement('book-preview');
        element.setAttribute('author', author);
        element.setAttribute('id', id);
        element.setAttribute('image', image);
        element.setAttribute('title', title);
        fragment.appendChild(element);
    });
    container.appendChild(fragment);
};

// CHANGED - ADDED
// Initial rendering of book previews
// A slice of the matches array containing the first BOOKS_PER_PAGE books to be displayed
// Sets up the initial display of book previews on the web page
createBookPreviews(matches.slice(0, BOOKS_PER_PAGE), getElement('[data-list-items]'));

// CHANGED
// Function to create and append options to a select element 
const createOptions = (options, defaultOption, container) => {
    // document fragment (fragment) to hold the options before appending them to the container - Improves performance by reducing DOM manipulation
    const fragment = document.createDocumentFragment();
    // acts as a placeholder or initial instruction
    const firstOption = document.createElement('option');
    firstOption.value = 'any';
    firstOption.innerText = defaultOption;
    fragment.appendChild(firstOption);
    // For each entry, it creates an <option> element with a value equal to the key (id) and inner text equal to the value (name)
    Object.entries(options).forEach(([id, name]) => {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        fragment.appendChild(element);
    });
    container.appendChild(fragment);
};

// CHANGED - ADDED
// Populate genre and author dropdowns 
createOptions(genres, 'All Genres', getElement('[data-search-genres]'));
createOptions(authors, 'All Authors', getElement('[data-search-authors]'));

// CHANGED - MORE CODE
// Set theme based on user's preferred color scheme  
// Setting the theme of the web page based on the user's preferred color scheme
const applyTheme = (theme) => {
    const isNight = theme === 'night';
    document.documentElement.style.setProperty('--color-dark', isNight ? '255, 255, 255' : '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', isNight ? '10, 10, 20' : '255, 255, 255');
    getElement('[data-settings-theme]').value = isNight ? 'night' : 'day';                // added this line
};
// checks if the user's system prefers a dark color scheme, if not displays day theme
applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day');  // added this line


// Function to update the "Show more" button text and state
// function ensures that the button accurately reflects the state of the book list 
// and provides a better user experience by preventing unnecessary actions

// CHANGED - LESS CODE
// Update "Show more" button text and state 
const updateShowMoreButton = () => {
    //  calculates the remainingBooks by subtracting the number of books already displayed (page * BOOKS_PER_PAGE) from the total number of books (matches.length)
    const remainingBooks = matches.length - (page * BOOKS_PER_PAGE);
    // retrieves the button element
    const button = getElement('[data-list-button]');
    // sets the button's innerText to display the text "Show more" along with the number of remaining books
    button.innerText = `Show more (${remainingBooks})`;
    // disables the button if there are no remaining books
    button.disabled = remainingBooks <= 0;
    button.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining">(${remainingBooks > 0 ? remainingBooks : 0})</span>
    `;
};

updateShowMoreButton();

// UNCHANGED
// Event listener functions 
// Functions closeOverlay and openOverlay controls the visibility of overlay elements on a web page
// Function to close an overlay
const closeOverlay = (selector) => {
    getElement(selector).open = false;
};

// UNCHANGED
// Function to open an overlay and optionally focus on an element within it 
const openOverlay = (selector, focusSelector = null) => {
    getElement(selector).open = true;
    if (focusSelector) getElement(focusSelector).focus();
};

// UNCHANGED
// Function to apply search filters and return matching books 
// function filters the books array based on the provided filters object containing 
// search criteria for title, author, and genre

const applySearchFilters = (filters) => {
    // the filter method on the books array to iterate over each book and return a new array containing only the books that pass the filter conditions
    return books.filter((book) => {
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        return titleMatch && authorMatch && genreMatch;
    });
};

// Event listeners - struggled
getElement('[data-search-cancel]').addEventListener('click', () => closeOverlay('[data-search-overlay]'));
getElement('[data-settings-cancel]').addEventListener('click', () => closeOverlay('[data-settings-overlay]'));
getElement('[data-header-search]').addEventListener('click', () => openOverlay('[data-search-overlay]', '[data-search-title]'));
getElement('[data-header-settings]').addEventListener('click', () => openOverlay('[data-settings-overlay]'));
getElement('[data-list-close]').addEventListener('click', () => closeOverlay('[data-list-active]'));

getElement('[data-settings-form]').addEventListener('submit', (event) => {
    // Prevents the default form submission behavior
    event.preventDefault();
    // Extracts form data using FormData, specifically the theme property
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    applyTheme(theme);
    // Closes the settings overlay 
    closeOverlay('[data-settings-overlay]');
});

// UNCHANGED
// Handle search form submission to filter books and update the display 
getElement('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    matches = applySearchFilters(filters);
    page = 1;
    // Gets an element with the attribute [data-list-message] and toggles the CSS class list__message_show based on whether matches has any items
    getElement('[data-list-message]').classList.toggle('list__message_show', matches.length < 1);
    // Contains the book previews or a list of items that need to be updated
    getElement('[data-list-items]').innerHTML = '';
     // The first argument is a slice of the matches array, containing items from index 0 to BOOKS_PER_PAGE
     // Second argument is an element where the book previews will be inserted
    createBookPreviews(matches.slice(0, BOOKS_PER_PAGE), getElement('[data-list-items]'));
     // Updates the "show more" button if it exists
    updateShowMoreButton();
    // Scrolls the window to the top with a smooth animation when the search operation is performed
    // Provides a smooth user experience by scrolling back to the top of the page after the search is completed
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Indicates that the search operation has been completed and any search overlay should be closed
    closeOverlay('[data-search-overlay]');
});


// UNCHANGED
// Handle "Show more" button click to display more books 
// When the button is clicked, it retrieves the next set of books to display based on the current page, 
// updates the page count, and updates the "Show more" button accordingly

// Adds an event listener to an element with the attribute [data-list-button]
getElement('[data-list-button]').addEventListener('click', () => {
    // Represents the range of books to be displayed when the "Show more" button is clicked
    createBookPreviews(matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE), getElement('[data-list-items]'));
    // Increments the value of the variable page by 1
    page += 1;
    // Updates the text and state of the "Show more" button
    updateShowMoreButton();
});

// CHANGED 
// Event Path Extraction
getElement('[data-list-items]').addEventListener('click', (event) => {
    // Returns an array of elements that the event passed through (from the target element to the root).
    // Array.from() converts this path into a proper array for easier manipulation
    const pathArray = Array.from(event.composedPath());
    // Ensures that if node or node.dataset is null or undefined, it won't cause an error
    const active = pathArray.find((node) => node?.dataset?.preview);
    // This conditional checks if an active element was found
    if (active) {
        // Searches through the books array to find the book object whose id matches the preview attribute of the active element
        const book = books.find((book) => book.id === active.dataset.preview);
        //  If a corresponding book is found, it updates various UI elements with the book's details, displaying more information about the book in a modal or similar interface
        if (book) {
            getElement('[data-list-active]').open = true;
            getElement('[data-list-blur]').src = book.image;
            getElement('[data-list-image]').src = book.image;
            getElement('[data-list-title]').innerText = book.title;
            getElement('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
            getElement('[data-list-description]').innerText = book.description;
        }
    }
});