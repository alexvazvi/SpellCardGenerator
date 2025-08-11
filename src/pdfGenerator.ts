import jsPDF from 'jspdf';
import type { Spell } from './types';
import dndLogo from './assets/dnd-logo.png';

// Helper to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// This is the main exported function
export async function generateSpellPdf(
  spells: Spell[], 
  onProgress: (message: string) => void
): Promise<void> {

  onProgress('Iniciando generador de PDF...');
  await new Promise(res => setTimeout(res, 50));

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // --- Add Fonts ---
  try {
    onProgress('Cargando fuentes...');
    const response = await fetch('/fonts/Cinzel-Bold.ttf');
    if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
    const fontBuffer = await response.arrayBuffer();
    const cinzelBoldBase64 = arrayBufferToBase64(fontBuffer);
    pdf.addFileToVFS('Cinzel-Bold.ttf', cinzelBoldBase64);
    pdf.addFont('Cinzel-Bold.ttf', 'Cinzel-Bold', 'normal');
  } catch (error) {
      console.error("Error al cargar la fuente:", error);
      alert("FALLO: No se pudo cargar el archivo de la fuente desde 'public/fonts'. Asegúrate de que 'Cinzel-Bold.ttf' se encuentra ahí.");
      onProgress('Error!');
      return;
  }
  
  pdf.setFont('Helvetica', 'normal');

  const cardWidth = 63;
  const cardHeight = 88;
  const marginX = (210 - 3 * cardWidth - 4) / 2;
  const marginY = (297 - 3 * cardHeight - 4) / 2;
  const cardsPerPage = 9;

  for (let i = 0; i < spells.length; i++) {
    const spell = spells[i];
    const pageIndex = Math.floor(i / cardsPerPage);
    if (pageIndex > 0 && i % cardsPerPage === 0) pdf.addPage();

    onProgress(`Dibujando carta ${i + 1} de ${spells.length}...`);
    await new Promise(res => setTimeout(res, 0));

    const cardIndexInPage = i % cardsPerPage;
    const col = cardIndexInPage % 3;
    const row = Math.floor(cardIndexInPage / 3);
    const x = marginX + col * (cardWidth + 2);
    const y = marginY + row * (cardHeight + 2);

    drawCard(pdf, spell, x, y, cardWidth, cardHeight);
  }
  
  const totalPages = Math.ceil(spells.length / cardsPerPage);
  for (let i = 0; i < totalPages; i++) {
    pdf.addPage();
    onProgress(`Añadiendo reverso de página ${i + 1} de ${totalPages}...`);
    await new Promise(res => setTimeout(res, 0));

    for (let j = 0; j < cardsPerPage; j++) {
      if (i * cardsPerPage + j >= spells.length) break;
      const col = j % 3;
      const row = Math.floor(j / 3);
      const x = marginX + col * (cardWidth + 2);
      const y = marginY + row * (cardHeight + 2);
      drawCardBack(pdf, x, y, cardWidth, cardHeight);
    }
  }

  onProgress('Guardando PDF...');
  pdf.save('spell-cards-generated.pdf');
}

// The rest of the file (drawCard and drawCardBack) remains the same
function drawCard(pdf: jsPDF, spell: Spell, x: number, y: number, cardWidth: number, cardHeight: number): void {
  const cornerRadius = 3; 
  
  pdf.setFillColor(253, 245, 230);
  pdf.roundedRect(x, y, cardWidth, cardHeight, cornerRadius, cornerRadius, 'F');
  pdf.setDrawColor(184, 145, 110);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(x, y, cardWidth, cardHeight, cornerRadius, cornerRadius, 'S');
  pdf.setDrawColor(226, 196, 141);
  pdf.setLineWidth(0.2);
  pdf.roundedRect(x + 1, y + 1, cardWidth - 2, cardHeight - 2, cornerRadius-0.5, cornerRadius-0.5, 'S');

  pdf.setFont('Cinzel-Bold', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(226, 196, 141);
  pdf.text(spell.name, x + cardWidth / 2 + 0.2, y + 8.2, { align: 'center' });
  pdf.setTextColor(124, 92, 43);
  pdf.text(spell.name, x + cardWidth / 2, y + 8, { align: 'center' });

  pdf.setFont('Helvetica', 'italic');
  pdf.setFontSize(7);
  pdf.setTextColor(168, 138, 92);
  pdf.text(`${spell.school} · Nivel ${spell.level}`, x + cardWidth / 2, y + 12.5, { align: 'center' });
  
  pdf.setDrawColor(226, 196, 141);
  pdf.setLineWidth(0.5);
  pdf.line(x + 4, y + 15, x + cardWidth - 4, y + 15);
  
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(44, 34, 30);
  
  let detailY = y + 19;
  const detailSpacing = 4.5;
  
  pdf.setFont('Helvetica', 'bold');
  pdf.text('Lanzamiento:', x + 4, detailY);
  pdf.setFont('Helvetica', 'normal');
  pdf.text(spell.castingTime, x + 22, detailY);
  
  detailY += detailSpacing;
  pdf.setFont('Helvetica', 'bold');
  pdf.text('Alcance:', x + 4, detailY);
  pdf.setFont('Helvetica', 'normal');
  pdf.text(spell.range, x + 22, detailY);

  detailY += detailSpacing;
  pdf.setFont('Helvetica', 'bold');
  pdf.text('Componentes:', x + 4, detailY);
  pdf.setFont('Helvetica', 'normal');
  pdf.text(spell.components, x + 22, detailY);

  detailY += detailSpacing;
  pdf.setFont('Helvetica', 'bold');
  pdf.text('Duración:', x + 4, detailY);
  pdf.setFont('Helvetica', 'normal');
  pdf.text(spell.duration, x + 22, detailY);
  
  pdf.line(x + 4, detailY + 2.5, x + cardWidth - 4, detailY + 2.5);

  const descriptionY = detailY + 6;
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setLineHeightFactor(1.2);
  const descriptionLines = pdf.splitTextToSize(spell.description, cardWidth - 8);
  pdf.text(descriptionLines, x + 4, descriptionY);
  
  pdf.setFont('Cinzel-Bold', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor(168, 138, 92);
  pdf.text('D&D 5e Conjuro', x + cardWidth / 2, y + cardHeight - 4, { align: 'center' });
}

function drawCardBack(pdf: jsPDF, x: number, y: number, cardWidth: number, cardHeight: number): void {
  const cornerRadius = 3;
  
  pdf.setFillColor(253, 245, 230);
  pdf.roundedRect(x, y, cardWidth, cardHeight, cornerRadius, cornerRadius, 'F');
  pdf.setDrawColor(184, 145, 110);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(x, y, cardWidth, cardHeight, cornerRadius, cornerRadius, 'S');
  pdf.setDrawColor(226, 196, 141);
  pdf.setLineWidth(0.2);
  pdf.roundedRect(x + 1, y + 1, cardWidth - 2, cardHeight - 2, cornerRadius-0.5, cornerRadius-0.5, 'S');
  
  const logoWidth = cardWidth * 0.85;
  const logoHeight = logoWidth * 0.45;
  const logoX = x + (cardWidth - logoWidth) / 2;
  const logoY = y + (cardHeight - logoHeight) / 2;
  pdf.addImage(dndLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);
}
