// Toggle navbar untuk mobile
function toggleMenu() {
  const sidebar = document.getElementById('sidebarMenu');
  sidebar.classList.toggle('active');
}

// Event listener burger button
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burgerBtn');
  if (burger) {
    burger.addEventListener('click', toggleMenu);
  }
});

// Logout user
function logout() {
  fetch('/logout', { method: 'POST' })
    .then(() => window.location.href = '/index.html');
}

// Load info akun (email + username)
function loadAccountInfo(containerId) {
  fetch('/account')
    .then(res => res.json())
    .then(user => {
      const info = `
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Saldo:</strong> Rp ${Number(user.saldo).toLocaleString()}</p>
      `;
      document.getElementById(containerId).innerHTML = info;
    });
}

// Format number as rupiah
function formatRupiah(number) {
  return 'Rp ' + Number(number).toLocaleString();
}

// Tambah item ke keranjang
function addToCart(itemId) {
  fetch('/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId })
  }).then(() => alert('Ditambahkan ke keranjang!'));
}

// Langsung beli item
function buyNow(itemId) {
  fetch('/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId })
  }).then(() => window.location.href = 'cart.html');
}

// Proses checkout
function checkout() {
  fetch('/checkout', {
    method: 'POST'
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(`Checkout sukses! Total: Rp ${Number(data.total).toLocaleString()}`);
        window.location.reload();
      } else {
        alert(data.message || 'Checkout gagal');
      }
    });
}