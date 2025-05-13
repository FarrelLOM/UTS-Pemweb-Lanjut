document.addEventListener('DOMContentLoaded', () => {
    fetch('/products')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('product-list');
        if (data.length === 0) {
          container.innerHTML = '<p>Belum ada produk tersedia.</p>';
          return;
        }
  
        data.forEach(p => {
          const div = document.createElement('div');
          div.className = 'item';
          div.innerHTML = `
            <h4>${p.name}</h4>
            <p>Rp${p.price.toLocaleString()}</p>
          `;
          container.appendChild(div);
        });
      })
      .catch(err => {
        console.error("Gagal mengambil data produk:", err);
      });
  });s  