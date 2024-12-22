document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cardsContainer');
    const orderTableBody = document.getElementById('orderTableBody');
    const totalPriceEl = document.getElementById('totalPrice');
    let order = JSON.parse(localStorage.getItem('order')) || [];

    // Fetch Data from JSON File menu.json
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            renderCards(data);
        });

    // Render Cards
    function renderCards(data) {
        cardsContainer.innerHTML = data.map(item => `
            <div class="card" data-id="${item.id}">
                <div class="imageCon">
                    <img src="${item.image}" alt="product">
                </div>
                <div class="titleCon">
                    <p class="foodName">${item.name}</p>
                    <p class="price">₱<span>${item.price}</span>.00</p>
                </div>
                <div class="btnCon">
                    <button class="addBtn">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to buttons
        document.querySelectorAll('.addBtn').forEach(button => {
            button.addEventListener('click', addToOrder);
        });
    }

    // Add to Order
    function addToOrder(e) {
        const card = e.target.closest('.card');
        const id = parseInt(card.getAttribute('data-id'));
        const name = card.querySelector('.foodName').textContent;
        const price = parseInt(card.querySelector('.price span').textContent);

        // Check if item is already in the order
        const existingItem = order.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            order.push({ id, name, price, quantity: 1 });
        }

        updateOrderTable();
    }

    // Update Order Table
    function updateOrderTable() {
        orderTableBody.innerHTML = order.map(item => `
            <tr>
                <td>${item.name}</td>
                <td class="table-btn">
                    <button class="qtyBtn decrement" data-id="${item.id}"><i class="bi bi-dash-square"></i></button>
                    <span class="qtyValue">${item.quantity}</span>
                    <button class="qtyBtn increment" data-id="${item.id}"><i class="bi bi-plus-square"></i></button>
                </td>
                <td>₱${item.price * item.quantity}</td>
                <td>
                    <button class="deleteBtn" data-id="${item.id}"><i class="bi bi-x-lg"></i></button>
                </td>
            </tr>
        `).join('');

        // Add event listeners to table buttons
        document.querySelectorAll('.increment').forEach(button => {
            button.addEventListener('click', incrementQty);
        });
        document.querySelectorAll('.decrement').forEach(button => {
            button.addEventListener('click', decrementQty);
        });
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', deleteItem);
        });

        calculateTotal();
    }

    // Increment Quantity
    function incrementQty(e) {
        const id = parseInt(e.target.closest('button').getAttribute('data-id'));
        const item = order.find(item => item.id === id);
        item.quantity += 1;
        updateOrderTable();
    }

    // Decrement Quantity
    function decrementQty(e) {
        const id = parseInt(e.target.closest('button').getAttribute('data-id'));
        const item = order.find(item => item.id === id);
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateOrderTable();
        }
    }

    // Delete Item
    function deleteItem(e) {
        const id = parseInt(e.target.closest('button').getAttribute('data-id'));
        order = order.filter(item => item.id !== id);
        updateOrderTable();
    }

    // Calculate Total
    function calculateTotal() {
        const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalPriceEl.textContent = total;
        saveOrder();
    }

    // Save Order to LocalStorage
    function saveOrder() {
        localStorage.setItem('order', JSON.stringify(order));
    }

    // Order Now
    document.getElementById('btnOrderNow').addEventListener('click', () => {
        alert('Order Saved! Please wait to finish your meal..');
        localStorage.setItem('receipt', JSON.stringify(order));
        order = [];
        updateOrderTable();
    });
});