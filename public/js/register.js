document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
  
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