// Smooth scroll to services
document.getElementById('book-service-btn').addEventListener('click', function () {
  document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
});

// Cart logic
const cartItemsTbody = document.getElementById('cart-items');
const totalAmountEl = document.getElementById('total-amount');
const addButtons = document.querySelectorAll('.add-btn');

let cart = [];

function formatPrice(n) {
  return parseFloat(n).toFixed(2);
}

function renderCart() {
  cartItemsTbody.innerHTML = '';
  if (cart.length === 0) {
    const tr = document.createElement('tr');
    tr.className = 'empty';
    tr.innerHTML = '<td colspan="4" style="padding:24px;color:#999;text-align:center">No Items Added — add to items the cart form the services bar</td>';
    cartItemsTbody.appendChild(tr);
    totalAmountEl.innerText = '0';
    return;
  }
  let total = 0;
  cart.forEach((it, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx + 1}</td><td style="text-align:left;padding-left:8px">${it.name}</td><td>₹${formatPrice(it.price)}</td><td><button data-idx="${idx}" class="remove-from-cart" style="padding:6px 8px;border-radius:6px;border:none;cursor:pointer">Remove</button></td>`;
    cartItemsTbody.appendChild(tr);
    total += it.price;
  });
  totalAmountEl.innerText = formatPrice(total);

  // attach remove handlers
  document.querySelectorAll('.remove-from-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = parseInt(this.dataset.idx, 10);
      cart.splice(idx, 1);
      renderCart();
    });
  });
}

addButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    const li = this.closest('li');
    const name = li.querySelector('.name').innerText.trim();
    const price = parseFloat(li.dataset.price) || 0;
    cart.push({ name, price });
    renderCart();
  });
});

// Booking form
const bookForm = document.getElementById('book-form');
const confirmation = document.getElementById('confirmation-message');
bookForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (cart.length === 0) {
    confirmation.style.color = 'red';
    confirmation.innerText = 'Please add at least one service to cart before booking.';
    return;
  }
  // simulate booking
  confirmation.style.color = 'green';
  confirmation.innerText = '✅ Thank you for booking! We will get back to you soon.';
  bookForm.reset();
  cart = [];
  renderCart();
});

// Newsletter
document.getElementById('news-btn').addEventListener('click', function () {
  const n = document.getElementById('news-name').value.trim();
  const e = document.getElementById('news-email').value.trim();
  if (!n || !e) { alert('Please fill both fields'); return }
  alert(`✅ Thank you, ${n}! You've subscribed with ${e}.`);
  document.getElementById('news-name').value = '';
  document.getElementById('news-email').value = '';
});

// initial render
renderCart();