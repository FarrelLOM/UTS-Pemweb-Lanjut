document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const verivyBtn = document.getElementById('verivyBtn');

  // ✅ Verifikasi email sebelum submit
  verivyBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    if (!email) return alert("Masukkan email terlebih dahulu!");

    try {
      const res = await fetch('/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (data.exists) {
        alert('❌ Email sudah terdaftar!');
      } else {
        alert('✅ Email tersedia!');
      }
    } catch (err) {
      alert('Gagal memverifikasi email');
      console.error(err);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !email || !password) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registrasi berhasil! Silakan login.');
        window.location.href = '/index.html';
      } else {
        alert(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      console.error('Error saat registrasi:', err);
      alert('Terjadi kesalahan saat registrasi.');
    }
  });
});