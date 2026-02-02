const API_URL = "http://localhost:5003/api";
let cart = [];

// ✅ Function to add product
async function addProduct() {
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const quantity = document.getElementById("productQuantity").value;
    const seller = document.getElementById("sellerName").value;

    if (!name || !price || !quantity || !seller) {
        alert("❌ Please fill in all fields");
        return;
    }

    try {
        await fetch(`${API_URL}/add-product`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, quantity, seller }),
        });

        alert("✅ Product added successfully!");
    } catch (error) {
        console.error("❌ Error adding product:", error);
    }
}

// ✅ Function to fetch and display products
async function fetchProducts() {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach((product) => {
        productList.innerHTML += `
            <div>
                <h3>${product.name} - ₹${product.price}</h3>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            </div>
            <hr>
        `;
    });
}

// ✅ Function to add item to cart
function addToCart(name, price) {
    cart.push({ name, price });
    alert(`${name} added to cart!`);
}

// ✅ Function to display cart
function displayCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML = "";

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cart.forEach((item, index) => {
        cartItemsDiv.innerHTML += `
            <div>
                <h3>${item.commodity}</h3>
                <p>₹${item.price}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
            <hr>
        `;
    });
}
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}


// ✅ Checkout
function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const productId = cart[0].productId;

    localStorage.removeItem("cart");
    window.location.href = "place-order.html?id=" + productId;
}
