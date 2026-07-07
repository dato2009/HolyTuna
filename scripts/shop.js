let cart = [];
let productplace = document.querySelector('.products');
let cartplace = document.querySelector('.cart');
const checkoutbtn = document.querySelector(".Check-out-btn");
const searchInput = document.querySelector('#shop-search');

let items = [];
let activeFilter = "all";
let searchQuery = ""; 
let currentPopupItem = null; 

updateCheckoutButtonVisibility();

fetch('/scripts/shopitems.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(stuff => {
            items.push(stuff);
        });
        createFilters();
        renderProducts();
    });

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
});

function renderProducts() {
    productplace.innerHTML = "";

    let filteredItems = activeFilter === "all" 
        ? items 
        : items.filter(item => item.type.includes(activeFilter));

    if (searchQuery !== "") {
        filteredItems = filteredItems.filter(item => {
            const matchName = item.name.toLowerCase().includes(searchQuery);
            const matchDesc = item.description ? item.description.toLowerCase().includes(searchQuery) : false;
            return matchName || matchDesc;
        });
    }

    if (filteredItems.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = `No gear found matching "${searchQuery}"`;
        productplace.appendChild(noResults);
        return;
    }

    filteredItems.forEach(item => {
        displayItem(item);
    });
    
    highlightActiveFilterButton();
}

function createFilters() {
    const filterPlace = document.querySelector(".Filters");
    filterPlace.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Filters";
    filterPlace.appendChild(title);

    const allBtn = document.createElement("button");
    allBtn.textContent = "All Categories";
    allBtn.setAttribute("data-filter", "all");
    allBtn.addEventListener("click", () => {
        activeFilter = "all";
        renderProducts();
    });
    filterPlace.appendChild(allBtn);

    let allTypes = [];
    items.forEach(item => {
        item.type.forEach(type => {
            if (!allTypes.includes(type)) {
                allTypes.push(type);
            }
        });
    });

    allTypes.forEach(type => {
        const btn = document.createElement("button");
        btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        btn.setAttribute("data-filter", type);
        btn.addEventListener("click", () => {
            activeFilter = type;
            renderProducts();
        });
        filterPlace.appendChild(btn);
    });
}

function highlightActiveFilterButton() {
    const buttons = document.querySelectorAll(".Filters button");
    buttons.forEach(btn => {
        if(btn.getAttribute("data-filter") === activeFilter) {
            btn.classList.add("active-filter");
        } else {
            btn.classList.remove("active-filter");
        }
    });
}

function displayItem(item) {
    let itemDiv = document.createElement('div');
    itemDiv.classList.add('box');
    itemDiv.setAttribute('id', item.name);

    const itemName = document.createElement('h3');
    const itemPrice = document.createElement('p');
    const itemCount = document.createElement('p');
    const button = document.createElement('button');

    itemCount.setAttribute("class", "stock");

    itemName.textContent = item.name;
    itemPrice.textContent = "Price: $" + item.price;
    itemCount.textContent = "Available Stock: " + item.count;

    button.textContent = "Add to Cart";

    if (item.count <= 0) {
        button.disabled = true;
        button.textContent = "Out of Stock";
    }

    itemDiv.appendChild(itemName);
    itemDiv.appendChild(itemPrice);
    itemDiv.appendChild(itemCount);
    itemDiv.appendChild(button);

    productplace.appendChild(itemDiv);

    itemDiv.addEventListener('click', (e) => {
        if (e.target === button) return; 

        currentPopupItem = item; 
        
        const panel = document.getElementById('buyPanel');
        const popupImg = document.getElementById('popupImage');
        const popupName = document.getElementById('popupName');
        const popupPrice = document.getElementById('popupPrice');
        const popupBtn = document.getElementById('popupAddToCart');

        popupImg.src = item.image;
        popupName.textContent = item.name;
        popupPrice.textContent = "$" + item.price;

        if (item.count <= 0) {
            popupBtn.disabled = true;
            popupBtn.querySelector('h4').textContent = "OUT OF STOCK";
        } else {
            popupBtn.disabled = false;
            popupBtn.querySelector('h4').textContent = "ADD TO CART";
        }

        panel.style.display = 'flex';
    });

    // Standard Direct Layout Add Button Logic
    button.addEventListener('click', () => {
        if (item.count > 0) {
            addToCart(item);
            item.count--;
            itemCount.textContent = "Available Stock: " + item.count;

            if (item.count === 0) {
                button.disabled = true;
                button.textContent = "Out of Stock";
            }
        }
    });
}

function addToCart(item) {
    let cartItem = cart.find(c => c.name === item.name);

    if (!cartItem) {
        cartItem = {
            ...item,
            bought: 1
        };
        cart.push(cartItem);
    } else {
        cartItem.bought++;
    }
    renderCart();
}

function removeFromCart(itemName) {
    let cartItemIndex = cart.findIndex(c => c.name === itemName);

    if (cartItemIndex !== -1) {
        const cartItem = cart[cartItemIndex];
        const originalItem = items.find(i => i.name === cartItem.name);

        cartItem.bought--;
        originalItem.count++;

        if (cartItem.bought === 0) {
            cart.splice(cartItemIndex, 1);
        }

        renderProducts();
        renderCart();
    }
}

function increaseCartItem(itemName) {
    const cartItem = cart.find(c => c.name === itemName);
    const originalItem = items.find(i => i.name === itemName);

    if (originalItem.count > 0) {
        cartItem.bought++;
        originalItem.count--;

        renderProducts();
        renderCart();
    }
}

function renderCart() {
    cartplace.innerHTML = "";
    updateCheckoutButtonVisibility();

    if (cart.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Your gear list is empty.";
        emptyMsg.style.color = "var(--text-muted)";
        cartplace.appendChild(emptyMsg);
    }

    let total = 0;

    cart.forEach(c => {
        const cartDiv = document.createElement('div');
        cartDiv.setAttribute("class", "cart-item");

        const infoContainer = document.createElement('div');
        const name = document.createElement('h3');
        name.textContent = c.name;
        
        const bought = document.createElement('p');
        bought.textContent = "Qty: " + c.bought + " × $" + c.price;
        
        infoContainer.appendChild(name);
        infoContainer.appendChild(bought);

        const controlsDiv = document.createElement("div");
        controlsDiv.classList.add("cart-controls");

        const removeBtn = document.createElement('button');
        removeBtn.textContent = "-";
        removeBtn.addEventListener('click', () => {
            removeFromCart(c.name);
        });

        const addBtn = document.createElement('button');
        addBtn.textContent = "+";
        addBtn.addEventListener('click', () => {
            increaseCartItem(c.name);
        });

        controlsDiv.appendChild(removeBtn);
        controlsDiv.appendChild(addBtn);

        cartDiv.appendChild(infoContainer);
        cartDiv.appendChild(controlsDiv);
        cartplace.appendChild(cartDiv);

        total += c.price * c.bought;
    });

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('cart-total');
    totalDiv.innerHTML = `<span>Total:</span> <span>$${total}</span>`;
    cartplace.appendChild(totalDiv);
}

function updateCheckoutButtonVisibility() {
    if(cart.length > 0){
        checkoutbtn.style.display = "block";
    } else {
        checkoutbtn.style.display = "none";
    }
}

// Global Modal Panel UI Control Operations
document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('buyPanel').style.display = 'none';
    currentPopupItem = null;
});

document.getElementById('popupAddToCart').addEventListener('click', function() {
    if (currentPopupItem && currentPopupItem.count > 0) {
        addToCart(currentPopupItem);
        currentPopupItem.count--;

        renderProducts(); 

        if (currentPopupItem.count === 0) {
            this.disabled = true;
            this.querySelector('h4').textContent = "OUT OF STOCK";
        }
    }
});

// Dynamic Popups & Dropdowns Framework Elements
function createPopup() {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = "⚡ Join the club: Follow us on Instagram for deals!";
    document.body.appendChild(popup);

    setTimeout(() => { popup.remove(); }, 4000);
}
setInterval(createPopup, 45000);

function showWelcome() {
    const box = document.createElement("div");
    box.className = "welcome";
    box.textContent = "Marketplace Loaded";
    document.body.appendChild(box);

    setTimeout(() => { box.remove(); }, 2000);
}
showWelcome();

function dropdown(name) {
    var target = document.getElementById(name);
    var dropdowns = document.getElementsByClassName("dropdown-content");

    for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown !== target && openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
    target.classList.toggle("show");
} 

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}