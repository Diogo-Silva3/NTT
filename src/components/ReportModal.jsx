import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, FileDown, Printer, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ReportModal = ({ isOpen, onClose, equipments, locations, logoUrl, logoPlaceholder, bimboLogoUrl }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const generatePDF = async () => {
    const doc = new jsPDF();
    let currentY = 15;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    // Adicionar logo no canto superior esquerdo usando o caminho local
    try {
      doc.addImage('/images/Logo.png', 'PNG', 10, 10, 30, 22.5); // Posição (x, y), tamanho (altura, largura)
    } catch (error) {
      console.error('Erro ao adicionar logo:', error);
    }

    // Adicionar segunda logo no canto superior direito
    try {
      doc.addImage('https://i.postimg.cc/L5xbDjPQ/logo-1.png', 'PNG', pageWidth - 40, 10, 30, 22.5); // Posição (x, y), tamanho (altura, largura)
    } catch (error) {
      console.error('Erro ao adicionar segunda logo:', error);
    }
    // Título do relatório
    doc.setFontSize(18);
    doc.setTextColor(50, 50, 50);
    // Ajustar posição do título para não sobrepor as logos
    doc.text('Relatório de Equipamentos de TI', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    // Data de geração
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Data de geração: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 7;

    // Filtros
    let filterInfo = [];
    if (startDate) filterInfo.push(`De: ${format(parseISO(startDate), 'dd/MM/yyyy', { locale: ptBR })}`);
    if (endDate) filterInfo.push(`Até: ${format(parseISO(endDate), 'dd/MM/yyyy', { locale: ptBR })}`);
    if (selectedLocation !== 'all') filterInfo.push(`Localidade: ${selectedLocation}`);
    if (filterInfo.length > 0) {
      doc.text(`Filtros: ${filterInfo.join(' | ')}`, 15, currentY);
      currentY += 10;
    } else {
      currentY += 3;
    }

    // Filtrar equipamentos conforme filtros
    let filteredEquipments = equipments;

    if (startDate) {
      const start = startOfDay(parseISO(startDate));
      filteredEquipments = filteredEquipments.filter(eq => parseISO(eq.lastCheck) >= start);
    }
    if (endDate) {
      const end = endOfDay(parseISO(endDate));
      filteredEquipments = filteredEquipments.filter(eq => parseISO(eq.lastCheck) <= end);
    }
    if (selectedLocation !== 'all') {
      filteredEquipments = filteredEquipments.filter(eq => eq.location === selectedLocation);
    }

    // Montar tabela
    const tableData = filteredEquipments.map(eq => ([
      eq.name,
      eq.type || '-',
      eq.status,
      eq.location,
      format(parseISO(eq.lastCheck), 'dd/MM/yyyy HH:mm', { locale: ptBR }),      'Sim', // Always display "Sim" for "Verificado"
      eq.notes || '-',
      (eq.photos && eq.photos.length > 0) ? 'Foto(s) incluída(s)' : 'Sem foto' // Revertido: volta a incluir a coluna Foto
    ]));

    doc.autoTable({
      startY: currentY,
      head: [['Nome', 'Tipo', 'Status', 'Localidade', 'Última Verificação', 'Verificado', 'Observações', 'Foto']], // Revertido: volta a incluir a coluna Foto no cabeçalho
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1.5, overflow: 'linebreak', textColor: [50, 50, 50] },
      headStyles: { fillColor: [0, 80, 157], textColor: [255, 255, 255], fontSize: 9 },
      alternateRowStyles: { fillColor: [230, 240, 255] },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 15 },
        2: { cellWidth: 18 },
        3: { cellWidth: 25 },
        4: { cellWidth: 22 },
        5: { cellWidth: 15 },
        6: { cellWidth: 'auto' },
        7: { cellWidth: 20 } // Revertido: volta a definir o estilo para a coluna Foto
      },
      didDrawPage: (data) => {
        currentY = data.cursor.y;
      }
    });

    currentY = doc.previousAutoTable.finalY + 10;

    // Adicionar fotos dos equipamentos
    for (const eq of filteredEquipments) {
      if (eq.photos && eq.photos.length > 0) {
        // Quebrar página se necessário
        if (currentY + 15 + 45 > pageHeight - 10) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text(`Fotos de: ${eq.name} (${eq.location})`, 15, currentY);
        currentY += 7;

        let photoX = 15;
        const photoHeight = 40;
        const photoSpacing = 5;
        const maxPhotosPerRow = Math.floor((pageWidth - 30) / (photoHeight + photoSpacing));

        for (let i = 0; i < eq.photos.length; i++) {
          if (photoX + photoHeight > pageWidth - 15 || (i > 0 && i % maxPhotosPerRow === 0)) {
            photoX = 15;
            currentY += photoHeight + photoSpacing;
            if (currentY + photoHeight > pageHeight - 10) {
              doc.addPage();
              currentY = 20;
            }
          }

          try {
            const photoData = eq.photos[i]; // Assuming photos are already base64 data URLs
            doc.addImage(photoData, 'PNG', photoX, currentY, photoHeight, photoHeight);
          } catch (error) {
            console.error(`Erro ao carregar foto do equipamento ${eq.name}:`, error);
            doc.setFontSize(8);
            doc.setTextColor(255, 0, 0);
            doc.text('Foto inválida', photoX, currentY + photoHeight / 2);
          }
          photoX += photoHeight + photoSpacing;
        }
        currentY += photoHeight + 10;
      }
    }

    doc.save(`relatorio_equipamentos_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
    toast({
      title: 'PDF gerado com sucesso!',
      description: 'Relatório criado e salvo no seu dispositivo.',
      duration: 3000,
    });
  };

  return (
    <>
      {isOpen && (
        <Card className="max-w-4xl mx-auto my-8 p-4">
          <CardHeader>
            <CardTitle>Gerar Relatório</CardTitle>
            <Button variant="ghost" onClick={onClose} className="float-right">
              <X size={18} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="flex flex-col">
                <label>Data Inicial</label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label>Data Final</label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
              <div className="flex flex-col flex-grow">
                <label>Localidade</label>
                <select
                  className="p-2 border rounded"
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                >
                  <option value="all">Todas</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={generatePDF} leftIcon={<FileDown size={16} />}>
                Baixar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ReportModal;
