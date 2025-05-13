document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reportForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const res = await fetch('/report', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        alert('Laporan berhasil dikirim!');
        form.reset();
      } else {
        alert('Gagal mengirim laporan.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan.');
    }
  });
});
