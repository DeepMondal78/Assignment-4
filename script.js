// =====================
// Initialize EmailJS
// =====================
(function () {
    emailjs.init("JUB8iHNPHwXkF1FuS"); 
})();

document.addEventListener('DOMContentLoaded', () => {
    const scrollToBookingButton = document.querySelector('.scroll-to-booking');
    const bookingSection = document.getElementById('services');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountSpan = document.getElementById('total-amount');
    const serviceList = document.querySelector('.service-list');
    const bookingForm = document.getElementById('booking-form');
    const confirmationMessage = document.getElementById('confirmation-message');
    const bookNowButton = document.getElementById('bookNowButton');
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterConfirmationMessage = document.getElementById('newsletter-confirmation-message');

    let cart = [];
    let total = 0;

    // Scroll to Booking Services Section
    if (scrollToBookingButton && bookingSection) {
        scrollToBookingButton.addEventListener('click', () => {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Function to update cart display
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.textContent = 'No items added.';
        } else {
            cart.forEach((item, index) => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <span>${index + 1}</span>
                    <span>${item.name}</span>
                    <span>₹${item.price.toFixed(2)}</span>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }
        totalAmountSpan.textContent = total.toFixed(2);
    }

    // Add/Remove Item Logic
    if (serviceList) {
        serviceList.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('button');
            if (!clickedButton) return;

            const serviceItem = clickedButton.closest('.service-item');
            const name = serviceItem.dataset.name;
            const price = parseFloat(serviceItem.dataset.price);

            if (clickedButton.classList.contains('add-item')) {
                // Add item to cart
                cart.push({ name, price });
                total += price;
                
                // Change button to 'Remove Item'
                clickedButton.innerHTML = 'Remove Item <i class="fas fa-minus-circle"></i>';
                clickedButton.classList.remove('add-item');
                clickedButton.classList.add('remove-item');
                
            } else if (clickedButton.classList.contains('remove-item')) {
                // Remove item from cart
                const itemIndexInCart = cart.findIndex(item => item.name === name);
                if (itemIndexInCart !== -1) {
                    cart.splice(itemIndexInCart, 1);
                    total -= price;

                    // Change button back to 'Add Item'
                    clickedButton.innerHTML = 'Add Item<i class="fas fa-plus-circle"></i>';
                    clickedButton.classList.remove('remove-item');
                    clickedButton.classList.add('add-item');
                }
            }
            updateCartDisplay();
        });
    }

    // Email Confirmation using EmailJS
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (event) {
            event.preventDefault();

            if (cart.length === 0) {
                displayConfirmationMessage(confirmationMessage, 'Please add services to your cart before booking.', 'error');
                return;
            }

            bookNowButton.disabled = true;
            bookNowButton.textContent = 'Booking...';

            const serviceDetails = cart.map(item => `${item.name} (${item.price.toFixed(2)})`).join(', ');

            const templateParams = {
                from_name: document.getElementById('fullName').value,
                from_email: document.getElementById('email').value,
                phone_number: document.getElementById('phoneNumber').value,
                service_details: serviceDetails,
                total_amount: total.toFixed(2),
                to_email: document.getElementById('email').value
            };

            emailjs.send('service_qtu59oa', 'template_5el6dur', templateParams)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                    displayConfirmationMessage(confirmationMessage, 'Thank you For Booking the Service! We will get back to you soon!', 'success');
                    bookingForm.reset();
                    cart = [];
                    total = 0;
                    updateCartDisplay();

                    // Revert all buttons to "Add Item" (plus icon) after successful booking
                    document.querySelectorAll('.service-item button').forEach(button => {
                        button.classList.remove('remove-item');
                        button.classList.add('add-item');
                        button.innerHTML = 'Add Item<i class="fas fa-plus-circle"></i>';
                    });
                }, function (error) {
                    console.log('FAILED...', error);
                    displayConfirmationMessage(confirmationMessage, 'Failed to book service. Please try again.', 'error');
                })
                .finally(() => {
                    bookNowButton.disabled = false;
                    bookNowButton.textContent = 'Book Now';
                });
        });
    }

    // Newsletter Subscription
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const newsletterTemplateParams = {
                full_name: document.getElementById('newsletterFullName').value,
                email: document.getElementById('newsletterEmail').value,
            };

            emailjs.send('service_qtu59oa', 'template_vqo9x3j', newsletterTemplateParams)
                .then(function (response) {
                    console.log('NEWSLETTER SUCCESS!', response.status, response.text);
                    displayConfirmationMessage(newsletterConfirmationMessage, 'Thank you for subscribing to our newsletter!', 'success');
                    newsletterForm.reset();
                }, function (error) {
                    console.log('NEWSLETTER FAILED...', error);
                    displayConfirmationMessage(newsletterConfirmationMessage, 'Failed to subscribe. Please try again later.', 'error');
                });
        });
    }

    // Helper function to display confirmation messages
    function displayConfirmationMessage(element, message, type) {
        element.textContent = message;
        element.className = 'confirmation-message ' + type;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }

    updateCartDisplay();
});
