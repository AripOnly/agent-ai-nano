async function run() {
  const response = await fetch("http://localhost:3000/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "carikan berita terkini" }),
  });

  const decoder = new TextDecoder();
  let buffer = "";

  for await (const chunk of response.body) {
    // 1. Gabungkan chunk biner ke buffer teks
    buffer += decoder.decode(chunk, { stream: true });

    // 2. SSE memisahkan antar-event menggunakan dua kali newline (\n\n)
    const lines = buffer.split("\n\n");

    // Simpan sisa teks yang belum utuh di baris paling akhir
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmedLine = line.trim();

      // 3. Pastikan hanya memproses baris yang diawali "data: "
      if (trimmedLine.startsWith("data: ")) {
        const jsonString = trimmedLine.slice(6); // Ambil teks setelah "data: "

        try {
          const event = JSON.parse(jsonString);
          console.log(event);
        } catch (err) {
          console.error("Gagal parse JSON:", jsonString);
        }
      }
    }
  }
}

run();
