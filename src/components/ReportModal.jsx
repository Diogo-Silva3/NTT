import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, FileDown } from 'lucide-react';
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
    const marginLeft = 15;

    // Adiciona logos
    try {
      doc.addImage('/images/Logo.png', 'PNG', 10, 10, 30, 22.5);
      doc.addImage('https://i.postimg.cc/L5xbDjPQ/logo-1.png', 'PNG', pageWidth - 40, 10, 30, 22.5);
    } catch (error) {
      console.error('Erro ao adicionar logos:', error);
    }

    // Título principal
    currentY = 30;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('CHECK LIST', pageWidth / 2, currentY, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    currentY += 15;

    // Data de geração (rótulo em negrito)
    const generationDate = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    doc.setFont(undefined, 'bold');
    doc.text('Data de geração: ', marginLeft, currentY);
    doc.setFont(undefined, 'normal');
    doc.text(generationDate, marginLeft + doc.getTextWidth('Data de geração: '), currentY);
    currentY += 7;

    // Filtros (formato específico solicitado)
    let filterInfo = [];
    if (startDate) filterInfo.push(format(parseISO(startDate), 'dd/MM/yyyy', { locale: ptBR }));
    if (endDate) filterInfo.push(`Até: ${format(parseISO(endDate), 'dd/MM/yyyy', { locale: ptBR })}`);
    if (selectedLocation !== 'all') filterInfo.push(`Localidade: ${selectedLocation}`);

    if (filterInfo.length > 0) {
      doc.setFont(undefined, 'bold');
      doc.text('Filtros : ', marginLeft, currentY); // Espaço após "Filtros" como solicitado
      doc.setFont(undefined, 'normal');
      
      let xPos = marginLeft + doc.getTextWidth('Filtros : ');
      
      filterInfo.forEach((filter, index) => {
        // Verifica se é o primeiro item (data sem rótulo)
        if (index === 0 && startDate) {
          doc.text(filter, xPos, currentY);
          xPos += doc.getTextWidth(filter);
        } else {
          // Para os demais itens (com rótulos)
          const [label, ...valueParts] = filter.split(':');
          const value = valueParts.join(':').trim();
          
          if (label) {
            doc.setFont(undefined, 'bold');
            doc.text(`${label}:`, xPos, currentY);
            xPos += doc.getTextWidth(`${label}:`);
            
            doc.setFont(undefined, 'normal');
            doc.text(` ${value}`, xPos, currentY); // Espaço após os :
            xPos += doc.getTextWidth(` ${value}`);
          }
        }
        
        if (index < filterInfo.length - 1) {
          doc.text(' | ', xPos, currentY);
          xPos += doc.getTextWidth(' | ');
        }
      });
      
      currentY += 10;
    } else {
      currentY += 3;
    }

    // Filtra equipamentos
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

    // Prepara dados da tabela
    const tableData = filteredEquipments.map(eq => ([
      eq.name,
      eq.type || '-',
      eq.status,
      eq.location,
      format(parseISO(eq.lastCheck), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      'Sim',
      eq.notes || '-',
      (eq.photos && eq.photos.length > 0) ? 'Foto(s) incluída(s)' : 'Sem foto'
    ]));

    // Adiciona tabela
    doc.autoTable({
      startY: currentY,
      head: [['Nome', 'Tipo', 'Status', 'Localidade', 'Última Verificação', 'Verificado', 'Observações', 'Foto']],
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
        7: { cellWidth: 20 }
      },
      didDrawPage: (data) => {
        currentY = data.cursor.y;
      }
    });

    currentY = doc.previousAutoTable.finalY + 10;

    // Adiciona fotos dos equipamentos
    for (const eq of filteredEquipments) {
      if (eq.photos && eq.photos.length > 0) {
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
            const photoData = eq.photos[i];
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

    // Salva o PDF
    doc.save(`CHECK LIST_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
    toast({
      title: 'PDF gerado com sucesso!',
      description: 'Relatório criado e salvo no seu dispositivo.',
      duration: 3000,
    });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Card className="w-full max-w-4xl mx-auto p-4 relative">
            <CardHeader>
              <CardTitle>Gerar CheckList</CardTitle>
              <Button variant="ghost" onClick={onClose} className="absolute top-4 right-4">
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
                <Button variant="primary" onClick={generatePDF}>
                  <FileDown size={16} className="mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ReportModal;