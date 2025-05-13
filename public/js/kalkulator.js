document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calcForm');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const kapasitas = parseFloat(document.getElementById('kapasitas').value); // kW
      const jam = parseFloat(document.getElementById('jam').value); // jam/hari
      const harga = parseFloat(document.getElementById('harga').value); // Rp/kWh
  
      if (isNaN(kapasitas) || isNaN(jam) || isNaN(harga)) {
        alert("Harap isi semua kolom dengan benar.");
        return;
      }
  
      const produksi = kapasitas * jam * 30; // total kWh per bulan
      const pendapatan = produksi * harga;
  
      document.getElementById('hasil').innerHTML = `
        <p><strong>Produksi Energi:</strong> ${produksi.toFixed(2)} kWh/bulan</p>
        <p><strong>Potensi Pendapatan:</strong> Rp ${pendapatan.toLocaleString()}</p>
      `;
    });
  });  