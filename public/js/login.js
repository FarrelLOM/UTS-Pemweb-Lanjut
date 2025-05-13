document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
  
      if (!email || !password) {
        alert("Email dan password wajib diisi!");
        return;
      }
  
      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert('Login berhasil!');
          window.location.href = '/shop.html';
        } else {
          alert(data.message || 'Login gagal');
        }
      } catch (err) {
        console.error('Error saat login:', err);
        alert('Terjadi kesalahan saat login.');
      }
    });
  });  