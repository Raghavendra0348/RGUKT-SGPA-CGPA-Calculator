export async function exportPDF(config, grades, score, mode) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text('RGUKT Grade Report', 18, 22);
  doc.setFontSize(12);
  doc.text(config.title, 18, 34);
  doc.text(`${mode.toUpperCase()}: ${score.toFixed(3)} / 10`, 18, 46);
  let y = 65;
  const rows = mode === 'sgpa' ? config.subjects.map((subject, i) => `${subject.name}  |  ${subject.credits} credits  |  ${grades[i] || 'EX'}`) : grades.map((value, i) => `Semester ${i + 1}: ${value || 'Not entered'}`);
  for (const row of rows) {
    const lines = doc.splitTextToSize(row, 172);
    if (y + lines.length * 7 > 275) { doc.addPage(); y = 22; }
    doc.text(lines, 18, y); y += lines.length * 7 + 3;
  }
  doc.setFontSize(9);
  doc.text(`Generated ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date())}. Verify with official RGUKT regulations.`, 18, 286);
  doc.save(`RGUKT-${mode}-report.pdf`);
}

export function exportImage(config, grades, score, mode) {
  const rows = mode === 'sgpa' ? config.subjects.map((s, i) => `${s.name} · ${s.credits} credits · ${grades[i] || 'EX'}`) : grades.map((value, i) => `Semester ${i + 1}: ${value || 'Not entered'}`);
  const canvas = document.createElement('canvas');
  canvas.width = 1000; canvas.height = 340 + rows.length * 56;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f4f8fa'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#16344b'; ctx.font = 'bold 36px sans-serif'; ctx.fillText('RGUKT Grade Report', 48, 65);
  ctx.font = '22px sans-serif'; ctx.fillText(config.title, 48, 110);
  ctx.font = 'bold 52px sans-serif'; ctx.fillText(`${mode.toUpperCase()} ${score.toFixed(3)} / 10`, 48, 192);
  ctx.font = '22px sans-serif'; rows.forEach((row, i) => ctx.fillText(row, 48, 260 + i * 56, 904));
  ctx.font = '16px sans-serif'; ctx.fillText('Verify with official RGUKT academic regulations.', 48, canvas.height - 35);
  const link = document.createElement('a'); link.download = `RGUKT-${mode}-report.png`; link.href = canvas.toDataURL(); link.click();
}
