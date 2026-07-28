export function timestamp() {
  const d = new Date();

  // Mengambil komponen waktu dan menambahkan angka 0 di depan jika di bawah 10
  const tahun = d.getFullYear();
  const bulan = String(d.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0 (Januari = 0)
  const hari = String(d.getDate()).padStart(2, "0");

  const jam = String(d.getHours()).padStart(2, "0");
  const menit = String(d.getMinutes()).padStart(2, "0");
  const detik = String(d.getSeconds()).padStart(2, "0");

  // Menggabungkan menjadi format yang diinginkan
  return `${tahun}-${bulan}-${hari} ${jam}:${menit}:${detik}`;
}
