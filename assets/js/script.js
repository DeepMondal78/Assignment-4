let menuBtn = document.querySelector("#menuicon");
let navbar = document.querySelector(".navbar");
menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active-navbar");
});

let itemList = document.querySelector(".item-list");
let totalPrice = document.querySelector("#total-price");
let cardList = document.querySelector(".card-list");
let noCartItems = document.querySelector(".no-cart-items");

let cart = [];
const services = [
    { name: "Dry Cleaning", price: 200 },
    { name: "Wash & Fold", price: 100 },
    { name: "Ironing", price: 300 },
    { name: "Stain Removal", price: 500 },
    { name: "Leather & Suede Cleaning", price: 999 },
    { name: "Wedding Dress Cleaning", price: 2800 }
];

let serviceHTML = "";
services.forEach((item, index) => {
    serviceHTML += `
        <div class="service">
            <div class="d-flex">
                <p>${item.name}</p>
                <p>₹${item.price}</p>
            </div>
            <button class="add-btn" data-added="false" onclick="addToCart(${index})">
                Add Item <i class="ri-shopping-cart-2-line"></i>
            </button>
        </div>
    `;
});
itemList.innerHTML = serviceHTML;

function addToCart(index) {
    let buttons = document.querySelectorAll(".add-btn");
    let currentBtn = buttons[index];

    if (currentBtn.dataset.added === "false") {
        cart.push(services[index]);
        currentBtn.dataset.added = "true";
        currentBtn.style.backgroundColor = "#fab1a4";
        currentBtn.style.color = "#ec3d1e";
        currentBtn.innerHTML = `Remove Item <i class="ri-delete-bin-5-line"></i>`;
    } else {
        cart = cart.filter(item => item.name !== services[index].name);
        currentBtn.dataset.added = "false";
        currentBtn.style.backgroundColor = "#c4e4f8";
        currentBtn.style.color = "var(--text-bg-color)";
        currentBtn.innerHTML = `Add Item <i class="ri-shopping-cart-2-line"></i>`;
    }

    updateCart();
}

function updateCart() {
    let total = 0;
    let rows = "";

    if (cart.length === 0) {
        noCartItems.style.display = "flex";
    } else {
        noCartItems.style.display = "none";
        cart.forEach((item, index) => {
            total += item.price;
            rows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>₹${item.price}</td>
                </tr>
            `;
        });
    }

    cardList.innerHTML = rows;
    totalPrice.textContent = total;
}

let form = document.querySelector("#book-form");
let userName = document.querySelector("#username");
let userEmail = document.querySelector("#email");
let userPhoneNumber = document.querySelector("#number");

let loadingSms = document.querySelector("#loading-sms");
let bookSms = document.querySelector("#book-sms");
let errorProductSms = document.querySelector("#error-product");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let nameVal = userName.value.trim();
    let emailVal = userEmail.value.trim();
    let phoneVal = userPhoneNumber.value.trim();

    let isValid = true;

    if (!nameVal) {
        userName.value = "";
        userName.classList.add("input-error", "shake");
        isValid = false;
    } else {
        userName.classList.remove("input-error");
    }

    if (!emailVal) {
        userEmail.value = "";
        userEmail.classList.add("input-error", "shake");
        isValid = false;
    } else {
        userEmail.classList.remove("input-error");
    }

    if (!phoneVal) {
        userPhoneNumber.value = "";
        userPhoneNumber.classList.add("input-error", "shake");
        isValid = false;
    } else {
        userPhoneNumber.classList.remove("input-error");
    }

    if (cart.length === 0) {
        isValid = false;
    }

    setTimeout(() => {
        document.querySelectorAll(".shake").forEach(el => {
            el.classList.remove("shake");
        });
    }, 300);

    if (!isValid) return;


    loadingSms.style.display = "block";

    let orderDetails = cart
        .map((item, i) => `${i + 1}. ${item.name} - ₹${item.price}`)
        .join("\n");

    const formData = {
        user_name: nameVal,
        user_email: emailVal,
        user_phone: phoneVal,
        message: `
        Customer Name: ${nameVal}
        Email: ${emailVal}
        Phone: ${phoneVal}
        Order Details:
        ${orderDetails}
        Total Amount: ₹${totalPrice.textContent}`
    };

    emailjs
        .send("service_qtu59oa", "template_5el6dur", formData, "JUB8iHNPHwXkF1FuS")
        .then(() => {
            loadingSms.style.display = "none";
            bookSms.textContent = "Booking successful...! Email sent ✓";

            form.reset();
            cart = [];
            updateCart();

            document.querySelectorAll(".add-btn").forEach(btn => {
                btn.dataset.added = "false";
                btn.style.backgroundColor = "#c4e4f8";
                btn.style.color = "var(--text-bg-color)";
                btn.innerHTML = `Add Item <i class="ri-shopping-cart-2-line"></i>`;
            });
        })
        .catch(() => {
            loadingSms.style.display = "none";
            bookSms.textContent = "Something went wrong. Please try again later.";
        });
});
