// ================= MOBILE NAV TOGGLE =================
const toggleBtn = document.querySelector("#toggle-btn");
const navbar = document.querySelector(".nav-center");

toggleBtn.addEventListener("click", () => {
    navbar.classList.toggle("active-navbar");
});

// ================= SERVICES DATA =================
const services = [
    { name: "Dry Cleaning", price: 200 },
    { name: "Wash & Fold", price: 100 },
    { name: "Ironing", price: 300 },
    { name: "Stain Removal", price: 500 },
    { name: "Leather & Suede Cleaning", price: 999 },
    { name: "Wedding Dress Cleaning", price: 2800 },
];

const itemList = document.querySelector(".item-list");
const cardList = document.querySelector(".card-list");
const totalPrice = document.querySelector("#total-price");
const noCartItems = document.querySelector(".no-cart-items");

let cart = [];

// ================= RENDER SERVICES =================
function renderServices() {
    let html = "";

    services.forEach((service, index) => {
        html += `
      <div class="service">
        <div class="d-flex">
          <p>${service.name}</p>
          <p>₹${service.price}</p>
        </div>
        <button class="add-btn" data-index="${index}" data-added="false">
          Add Item <i class="ri-shopping-cart-2-line"></i>
        </button>
      </div>
    `;
    });

    itemList.innerHTML = html;
}

renderServices();

// ================= ADD TO CART =================
itemList.addEventListener("click", (e) => {
    if (!e.target.closest(".add-btn")) return;

    const btn = e.target.closest(".add-btn");
    const index = btn.dataset.index;
    const service = services[index];

    if (btn.dataset.added === "false") {
        cart.push(service);
        btn.dataset.added = "true";
        btn.innerHTML = `Remove Item <i class="ri-delete-bin-5-line"></i>`;
        btn.style.backgroundColor = "#fab1a4";
        btn.style.color = "#ec3d1e";
    } else {
        cart = cart.filter((item) => item.name !== service.name);
        btn.dataset.added = "false";
        btn.innerHTML = `Add Item <i class="ri-shopping-cart-2-line"></i>`;
        btn.style.backgroundColor = "#c4e4f8";
        btn.style.color = "var(--text-bg-color)";
    }

    updateCart();
});

// ================= UPDATE CART =================
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

// ================= FORM SUBMIT =================
const form = document.querySelector("#book-form");
const loadingSms = document.querySelector("#loading-sms");
const bookSms = document.querySelector("#book-sms");
const errorProductSms = document.querySelector("#error-product");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.querySelector("#username").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#number").value.trim();

    let isValid = true;

    // name validation
    if (!name) {
        document.querySelector("#user-error-sms").textContent =
            "please enter name";
        isValid = false;
    } else {
        document.querySelector("#user-error-sms").textContent = "";
    }

    // email validation
    if (!email) {
        document.querySelector("#email-error-sms").textContent =
            "please enter email";
        isValid = false;
    } else {
        document.querySelector("#email-error-sms").textContent = "";
    }

    // phone validation
    if (!phone) {
        document.querySelector("#number-error-sms").textContent =
            "please enter phone";
        isValid = false;
    } else {
        document.querySelector("#number-error-sms").textContent = "";
    }

    // cart check
    if (cart.length === 0) {
        errorProductSms.textContent = "Please add at least one service.";
        isValid = false;
    } else {
        errorProductSms.textContent = "";
    }

    if (!isValid) return;

    loadingSms.style.display = "block";
    bookSms.textContent = "";

    const orderDetails = cart
        .map((item, i) => `${i + 1}. ${item.name} - ₹${item.price}`)
        .join("\n");

    const templateParams = {
        user_name: name,
        user_email: email,
        user_phone: phone,
        message: `
        Customer Name: ${name}
        Email: ${email}
        Phone: ${phone}

        Order:
        ${orderDetails}

        Total: ₹${totalPrice.textContent}
    `,
    };

    emailjs
        .send("service_qtu59oa", "template_5el6dur", templateParams)
        .then(() => {
            loadingSms.style.display = "none";
            bookSms.textContent = "Booking sent successfully!";
            bookSms.style.color = "green";

            form.reset();
            cart = [];
            updateCart();

            document.querySelectorAll(".add-btn").forEach((btn) => {
                btn.dataset.added = "false";
                btn.innerHTML = `Add Item <i class="ri-shopping-cart-2-line"></i>`;
                btn.style.backgroundColor = "#c4e4f8";
                btn.style.color = "var(--text-bg-color)";
            });
        })
        .catch((error) => {
            loadingSms.style.display = "none";
            bookSms.textContent = "Mail failed. Check console.";
            bookSms.style.color = "red";
            console.log("EMAIL ERROR:", error);
        });
});