document.addEventListener('DOMContentLoaded', () => {
  const jenis = document.getElementById('jenis');
  const formEnergi = document.getElementById('formEnergi');
  const formAlat = document.getElementById('formAlat');

  jenis.addEventListener('change', () => {
    if (jenis.value === 'energi') {
      formEnergi.style.display = 'block';
      formAlat.style.display = 'none';
    } else {
      formEnergi.style.display = 'none';
      formAlat.style.display = 'block';
    }
  });

  document.getElementById('addItemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const jenisValue = formData.get('jenis');

    fetch('/add-item', {
      method: 'POST',
      body: formData
    }).then(res => {
      if (res.ok) {
        alert('Produk berhasil dijual!');
      } else {
        alert('Gagal menjual produk.');
      }
    });
  });
});