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
    document.getElementById("cartItems").innerText = JSON.stringify(cart, null, 2);
}

// ✅ Checkout
function checkout() {
    alert("✅ Order placed!");
}
