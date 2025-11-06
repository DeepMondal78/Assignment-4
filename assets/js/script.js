let togglebtn = document.querySelector("#toggle-btn");
let navbar = document.querySelector(".nav-center");
togglebtn.addEventListener('click', () => {
    navbar.classList.toggle("active-navbar");
});

let itemList = document.querySelector(".item-list");
let totalPrice = document.querySelector("#total-price");
let cardList = document.querySelector(".card-list");
let cart = [];

const services = [
    { name: "dry cleaning", price: 200 },
    { name: "wash & fold", price: 100 },
    { name: "ironing", price: 300 },
    { name: "stain removal", price: 500 },
    { name: "leather & suede cleaning", price: 999 },
    { name: "wedding dress cleaning", price: 2800 }
];

let clutter = '';
services.forEach((item, index) => {
    clutter += `<div class="service">
        <div class="d-flex">
            <p>${item.name}</p>
            <p>₹${item.price}</p>
        </div>
        <button class="add-btn" data-added="false" onclick="addToCart(${index})">
            Add Item <i class="ri-shopping-cart-2-line"></i>
        </button>
    </div>`;
    itemList.innerHTML = clutter;
});

function addToCart(index) {
    let buttons = document.querySelectorAll(".add-btn");
    let clickButton = buttons[index];
    let isAddButton = clickButton.dataset.added === "true";

    if (!isAddButton) {
        cart.push(services[index]);
        clickButton.dataset.added = "true";
        clickButton.style.backgroundColor = "#fab1a4ff";
        clickButton.style.color = "#ec3d1eff";
        clickButton.innerHTML = `Remove Item <i class="ri-delete-bin-5-line"></i>`;
    } else {
        cart = cart.filter((item) => item.name !== services[index].name);
        clickButton.dataset.added = "false";
        clickButton.style.backgroundColor = "#c4e4f8";
        clickButton.style.color = "var(--text-bg-color)";
        clickButton.innerHTML = `Add Item <i class="ri-shopping-cart-2-line"></i>`;
    }
    updateCart();
}

let noCartItems = document.querySelector(".no-cart-items");
function updateCart() {
    let clutter = '';
    let total = 0;

    if (cart.length === 0) {
        noCartItems.style.display = "flex";
    } else {
        noCartItems.style.display = "none";
        cart.forEach((val, index) => {
            const { name, price } = val;
            total += price;
            clutter += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${name}</td>
                    <td>${price}</td>
                </tr>
            `;
        });
    }
    totalPrice.innerHTML = `${total}`;
    cardList.innerHTML = clutter;
}

let form = document.querySelector("#book-form");
let userName = document.querySelector("#username");
let userEmail = document.querySelector("#email");
let userPhoneNumber = document.querySelector("#number");
let loadingSms = document.querySelector("#loading-sms");
let bookSms = document.querySelector("#book-sms");
let errorProductSms = document.querySelector("#error-product");

// form submit logic
form.addEventListener("submit", (e) => {
    e.preventDefault();

    let userNameValue = userName.value.trim();
    let userEmailValue = userEmail.value.trim();
    let numberValue = userPhoneNumber.value.trim();

    let userNameErrorSms = document.querySelector('#user-error-sms');
    let userEmailErrorSms = document.querySelector("#email-error-sms");
    let userPhoneNumberError = document.querySelector("#number-error-sms");
    let isValid = true;

    if (!userNameValue) {
        userNameErrorSms.textContent = "please enter your user name...";
        isValid = false;
    } else {
        userNameErrorSms.textContent = "";
    }

    if (!userEmailValue) {
        userEmailErrorSms.textContent = "please enter your email id here...";
        isValid = false;
    } else {
        userEmailErrorSms.textContent = "";
    }

    if (!numberValue) {
        userPhoneNumberError.textContent = "please enter your phone number here...";
        isValid = false;
    } else {
        userPhoneNumberError.textContent = "";
    }

    if (cart.length === 0) {
        errorProductSms.textContent = "please add at least one product...";
        isValid = false;
    } else {
        errorProductSms.textContent = "";
    }

    if (isValid) {
        loadingSms.style.display = "block";

       
        const formData = {
            user_name: userNameValue,
            user_email: userEmailValue,
            message: `Hello ${userNameValue}, your laundry booking is confirmed! Total amount: ₹${totalPrice.textContent}. We’ll contact you soon.`
        };

        emailjs.send("service_qtu59oa", "template_5el6dur", formData, "JUB8iHNPHwXkF1FuS")
            .then(() => {
                loadingSms.style.display = "none";
                bookSms.textContent = "Email has been sent successfully ✅";
                form.reset();
                cart = [];
                cardList.innerHTML = "";
                totalPrice.innerHTML = "";
                let allButtons = document.querySelectorAll(".add-btn");
                allButtons.forEach((button) => {
                    button.dataset.added = "false";
                    button.style.backgroundColor = "#c4e4f8";
                    button.style.color = "var(--text-bg-color)";
                    button.innerHTML = `Add Item <i class="ri-shopping-cart-2-line"></i>`;
                });
            })
            .catch((error) => {
                console.log("Error:", error);
                loadingSms.style.display = "none";
                bookSms.textContent = "Something went wrong, please try again later.";
            });
    }
});
