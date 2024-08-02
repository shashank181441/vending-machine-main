const checkout = () => {
  alert("checkout");
};

async function fetchProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function fetchCategories() {
  try {
    const response = await fetch('https://dummyjson.com/products/categories');
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

let category = "";
let myProducts = [];
let products = [];

async function renderProducts() {
  const productContainer = document.getElementById("product-container");

  // Clear existing products
  productContainer.innerHTML = "";

  products.forEach((product) => {
    // Create a wrapper for each product
    const productCard = document.createElement("div");
    // productCard.onclick = () => console.log(product);
    productCard.className = "group";

    // Create the image container
    const imgContainer = document.createElement("div");
    imgContainer.className =
      "aspect-h-1 aspect-w-1 w-full h-64 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7";
    const img = document.createElement("img");
    img.src = product.thumbnail;
    img.alt = `Image of ${product.title}`;
    img.className =
      "h-full w-full object-cover object-center group-hover:opacity-75";
    imgContainer.appendChild(img);

    // Create the text and button section
    const textContainer = document.createElement("div");
    textContainer.className = "w-full justify-between items-center";
    const title = document.createElement("h3");
    title.className =
      "mt-4 text-sm text-gray-700 text-xl font-sans font-semibold text-left";
    title.textContent = product.title;
    const priceAndQuantity = document.createElement("div");
    priceAndQuantity.className = "flex justify-between";
    const price = document.createElement("p");
    price.className = "mt-1 text-lg font-medium text-gray-900 font-mono";
    price.textContent = `Rs. ${product.price}`;
    const quantity = document.createElement("h5");
    quantity.className = "text-sm font-light mt-2 font-mono";
    quantity.textContent = `Qty: ${product.stock}`;
    priceAndQuantity.append(price, quantity);

    textContainer.append(title, priceAndQuantity);

    // Create the button
    const button = document.createElement("button");
    button.className =
      "w-full rounded-full bg-orange-400 mt-4 p-2 flex items-center justify-center space-x-2";
    button.innerHTML =
      '<img src="assets/Cart.png" alt="Cart" class="w-5 h-5"/><span class="mx-8 font-semibold">Add to Cart</span>'; // Emoji and text
    button.onclick = () => addtoCart(product); // Pass the product ID to the function

    // Append all elements to the product card
    productCard.append(imgContainer, textContainer, button);
    productContainer.appendChild(productCard);
  });
}

async function renderCategories() {
  const categories = await fetchCategories();
  const categoryButtonsContainer = document.getElementById("category-buttons");

  // Clear existing category buttons
  categoryButtonsContainer.innerHTML = "";

  // Create an "All Products" button
  const allButton = document.createElement("button");
  let isActive = category === ''
  allButton.className = `category-button  ${!isActive ? "bg-gray-200" : "bg-orange-400"} rounded-full font-semibold py-2 px-4`;
  allButton.setAttribute("data-category", "");
  allButton.textContent = "All Products";
  allButton.onclick = () => sortByCat("");
  categoryButtonsContainer.appendChild(allButton);

  categories.forEach((cat) => {
    const button = document.createElement("button");
    const isActive = category === cat.slug; // Compare the slug with the active category
    button.className = `category-button ${isActive ? "bg-orange-400" : "bg-gray-200"} rounded-full font-semibold py-2 px-4`;
    button.setAttribute("data-category", cat.slug); // Use slug for comparison
    button.textContent = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
    button.onclick = () => sortByCat(cat.slug);
    categoryButtonsContainer.appendChild(button);
  });
  
}

async function initialize() {
  myProducts = await fetchProducts();
  products = myProducts;
  renderProducts();
  renderCategories();
  updateActiveButton(category); // Ensure the initial state is set
}

document.addEventListener("DOMContentLoaded", initialize);

function addtoCart(product) {
  console.log(product);

  // Play the "ting" sound
  const tingSound = document.getElementById('add-to-cart-sound');

  // Add-to-cart logic here
  fetch('https://dummyjson.com/carts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 1,
      products: [
        {
          id: product.id,
          quantity: 1,
        }
      ]
    })
  })
  .then(res => res.json())
  .then(console.log)
  // .then(alert(`${product.title} added to cart.`))
  .then(() => {
    
  tingSound.play();
  })
  .catch(error => console.error(error));
}

function sortByCat(mycategory) {
  // console.log(mycategory);
  category = mycategory;
  products = filterProducts(myProducts, category);
  renderProducts();

  // Update button styles
  updateActiveButton(category);
}

function filterProducts(products, category) {
  return category === ""
    ? products
    : products.filter((product) => product.category === category);
}

function updateActiveButton(activeCategory) {
  // Get all buttons
  const buttons = document.querySelectorAll(".category-button");

  buttons.forEach((button) => {
    // Get the category from the button's data attribute
    const buttonCategorySlug = button.getAttribute("data-category");

    // Update the button's background color based on the active category
    if (buttonCategorySlug === activeCategory) {
      button.classList.add("bg-orange-400");
      button.classList.remove("bg-gray-200");
    } else {
      button.classList.add("bg-gray-200");
      button.classList.remove("bg-orange-400");
    }
  });
}


const notification = `<div aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
<div class="flex w-full flex-col items-center space-y-4 sm:items-end">

  <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-gray-900">${"hello"} added to cart. </p>
        </div>
        <div class="ml-4 flex flex-shrink-0">
          <button type="button"
          class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</div>`;

// document.getElementById("toast").innerHTML = notification