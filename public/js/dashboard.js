document.addEventListener('DOMContentLoaded', () => {
    fetch('/energy')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          document.querySelector('.container').innerHTML += '<p>Belum ada data produksi energi.</p>';
          return;
        }
  
        const labels = data.map(e => new Date(e.timestamp).toLocaleDateString());
        const values = data.map(e => e.energy_kwh);
  
        const ctx = document.getElementById('energyChart').getContext('2d');
  
        new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Energi (kWh)',
              data: values,
              borderColor: '#2ecc71',
              backgroundColor: 'rgba(46, 204, 113, 0.1)',
              borderWidth: 2,
              fill: true
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'kWh' }
              }
            }
          }
        });
      })
      .catch(err => {
        console.error("Gagal memuat data dashboard:", err);
      });
  });  