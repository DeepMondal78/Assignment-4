// Smooth Scroll Hero Button
document.getElementById("book-service-btn").addEventListener("click", function () {
  document.getElementById("services").scrollIntoView({ behavior: "smooth" });
});

// Cart Functionality
const cartItems = document.getElementById("cart-items");
const totalAmount = document.getElementById("total-amount");

let cart = [];
let total = 0;

// All service buttons
const serviceItems = document.querySelectorAll(".service-list li");

serviceItems.forEach((item) => {
  const addBtn = item.querySelector(".add-btn");
  const removeBtn = item.querySelector(".remove-btn");
  const serviceName = item.querySelector("span").innerText;

  // Price extract from text → last word (e.g. "$10")
  const price = parseInt(serviceName.split("$")[1]);

  // Add Item
  addBtn.addEventListener("click", () => {
    cart.push({ name: serviceName, price: price });
    updateCart();
  });

  // Remove Item (remove first matching)
  removeBtn.addEventListener("click", () => {
    const index = cart.findIndex((service) => service.name === serviceName);
    if (index !== -1) {
      cart.splice(index, 1);
      updateCart();
    }
  });
});

// Update Cart Display
function updateCart() {
  cartItems.innerHTML = "";
  total = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerText = `${item.name}`;
    cartItems.appendChild(li);
    total += item.price;
  });

  totalAmount.innerText = total;
}

// Booking Form + Email.js
const bookForm = document.getElementById("book-form");
const confirmationMsg = document.getElementById("confirmation-message");

bookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Collect user input
  const formData = {
    fullName: bookForm.fullName.value,
    email: bookForm.email.value,
    phone: bookForm.phone.value,
    services: cart.map((c) => c.name).join(", "),
    total: total,
  };

  // --- EmailJS Integration ---
  // Replace with your EmailJS keys:
  //   service_id, template_id, public_key
  emailjs
    .send("your_service_id", "your_template_id", formData, "your_public_key")
    .then(
      function () {
        confirmationMsg.innerText =
          "✅ Thank you for booking! We will get back to you soon.";
        confirmationMsg.style.color = "green";
        bookForm.reset();
        cart = [];
        updateCart();
      },
      function (error) {
        confirmationMsg.innerText = "❌ Failed to send email. Try again.";
        confirmationMsg.style.color = "red";
        console.error("EmailJS error:", error);
      }
    );
});


const newsletterForm = document.getElementById("newsletter-form");

newsletterForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = newsletterForm.subscriberName.value;
  const email = newsletterForm.subscriberEmail.value;

  alert(`✅ Thank you, ${name}! You've subscribed with ${email}.`);

  newsletterForm.reset();
});


