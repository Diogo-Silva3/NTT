import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EquipmentCard from '@/components/EquipmentCard';
import AddEquipmentForm from '@/components/AddEquipmentForm';
import CameraCapture from '@/components/CameraCapture';
import PhotoViewer from '@/components/PhotoViewer';
import ReportModal from '@/components/ReportModal';
import {
  Plus,
  Search,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

import jsPDF from 'jspdf'; // Importar jsPDF
const PREDEFINED_LOCATIONS = [
   'Fábrica Jaboatão',
  'Fábrica Raposo',
  'Fábrica Mogi das Cruzes',
  'Fábrica Rio de Janeiro',
  'Fabrica Jaguariúna',
  'Fabrica Osasco',
  'Fabrica Juiz de Fora',
  'Fabrica Pouso Alegre',
  'QSR Jaguaré',
  'Fabrica Inhauma',
  'Fabrica Gravataí',
  'CV João Pessoa',
  'CV Igarassu',
  'CV Natal',
  'CV Guaralhos',
  'CV Santo André',
  'CV Sorocaba',
  'CV São Pedro da Aldeia',
  'CV Campo Grande',
  'CV São Gonçalo',
  'CV Mega Rio',
  'CV Caruaru',
  'CV Brasília',
  'CV Anhanguera',
];

const COMPANY_LOGO_URL = "";

// >>> Função de teste básico para adicionar imagem estática <<<
function testAddImageSimple() {
  const doc = new jsPDF();

  // Data URL de um pequeno quadrado vermelho (exemplo de imagem base64 simples)
  // Você pode substituir por outro Data URL de uma imagem pequena e conhecida se tiver um.
  const testImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/epJ33AAAAAASUVORK5CYII=';

  try {
    console.log("--- Iniciando Teste de Imagem Estática ---");
    console.log("Tentando adicionar imagem estática de teste...");
    // Adiciona o quadrado vermelho no canto superior esquerdo do PDF
    doc.addImage(testImageUrl, 'PNG', 10, 10, 20, 20); // addImage(imageData, format, x, y, width, height)
    doc.save('teste_imagem_simples.pdf');
    console.log("Teste de imagem estática concluído: PDF 'teste_imagem_simples.pdf' gerado.");
    console.log("--- Fim Teste de Imagem Estática ---");
  } catch (error) {
    console.error("--- Erro no Teste de Imagem Estática ---");
    console.error("Teste de imagem estática: Erro ao adicionar imagem:", error);
    console.error("Detalhes do erro do teste estático:", error);
    console.log("--- Fim Erro no Teste de Imagem Estática ---");
  }
}
const ChecklistPage = () => {
  const PHOTO_SIZES = {
    'Pequeno': { width: 400, height: 300 },
    'Médio': { width: 800, height: 600 },
    'Grande': { width: 1200, height: 900 },
  };


  // Function to resize base64 image using Canvas
  const resizeImage = (base64String, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) { // Check height limit after width adjustment
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Get resized base64 (JPEG with 70% quality)
      };
      img.onerror = reject;
      img.src = base64String;
    });
  };

  const { t } = useTranslation();
  const { user } = useAuth();
  const LOGO_PLACEHOLDER_TEXT = t('logoPlaceholder');

  const [equipments, setEquipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentEquipmentId, setCurrentEquipmentId] = useState(null);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [selectedPhotoSize, setSelectedPhotoSize] = useState('Médio'); // State for selected size
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [logoUrl, setLogoUrl] = useState(COMPANY_LOGO_URL);

  useEffect(() => {
    const savedEquipments = localStorage.getItem('equipments');
    if (savedEquipments) {
      const loadedEquipments = JSON.parse(savedEquipments); // Carrega todos os dados, incluindo a foto se existir
      setEquipments(loadedEquipments);
      console.log('Equipments loaded from localStorage:', loadedEquipments);
    } else {
      const sampleData = [
        {
          id: 1,
          name: 'TV Samsung 55"',
          type: 'TV',
          status: 'funcionando',
          location: PREDEFINED_LOCATIONS[0],
          notes: 'Instalada em 2023, funcionando perfeitamente',
          checked: false,
          lastCheck: new Date().toISOString(),
          userId: 'tech001'
        },
        {
          id: 2,
          name: 'Switch Cisco 24 portas',
          type: 'Switch',
          status: 'manutencao',
          location: PREDEFINED_LOCATIONS[1],
          notes: 'Necessita atualização de firmware',
          checked: true,
          lastCheck: new Date(Date.now() - 86400000).toISOString(),
          userId: 'admin001'
        }
      ];
      setEquipments(sampleData);
      // Salva os dados de exemplo no localStorage, incluindo a propriedade 'photo' se presente
      localStorage.setItem('equipments', JSON.stringify(sampleData));
    }

    if (COMPANY_LOGO_URL && COMPANY_LOGO_URL !== "YOUR_LOGO_URL_HERE") {
      setLogoUrl(COMPANY_LOGO_URL);
    }

    // >>> FIM CHAMADA DE TESTE <<<
  }, []);

  useEffect(() => {
    // Salva o estado atual dos equipamentos no localStorage, incluindo a propriedade 'photo'
    localStorage.setItem('equipments', JSON.stringify(equipments));
    console.log('Equipments saved:', equipments);
  }, [equipments]);

  // Remove the updateEquipmentName function as part of reverting name editing changes
  // const updateEquipmentName = (id, newName) => {
  //   setEquipments(prev =>
  //     prev.map(eq =>
  //       eq.id === id ? { ...eq, name: newName } : eq
  //     )
  //   );
  // };

  const addEquipment = (newEquipment) => {
    setEquipments(prev => [...prev, { ...newEquipment, userId: user?.id, id: Date.now() }]); //Ensure unique ID
  };

  const deleteEquipment = (id) => {
    setEquipments(prev => prev.filter(eq => eq.id !== id));
    toast({
      title: t('equipmentRemoved'),
      description: t('equipmentRemovedDesc'),
    });
  };

  const openCamera = (equipmentId) => {
    setCurrentEquipmentId(equipmentId);
    setShowCamera(true);
  };

  // Recebe a string Base64 da foto diretamente do CameraCapture
  const handlePhotoCapture = async (photoDataUrls) => { // Expect an array of photo data URLs
    if (currentEquipmentId) {
      // Get dimensions based on selectedPhotoSize
      const dimensions = PHOTO_SIZES[selectedPhotoSize] || PHOTO_SIZES['Médio']; // Default to Médio if not found

      try {
        const resizedPhotos = await Promise.all(photoDataUrls.map(async (photoDataUrl) => {
           console.log('Processing photo, original data URL:', photoDataUrl ? photoDataUrl.substring(0, 50) + '...' : 'null'); // Log first 50 chars
           return await resizeImage(photoDataUrl, dimensions.width, dimensions.height); // Resize each photo
        }));

        setEquipments(prev =>
          prev.map(eq =>
            eq.id === currentEquipmentId
              ? { ...eq, photos: eq.photos ? [...eq.photos, ...resizedPhotos] : [...resizedPhotos] } // Add resized photos to 'photos' array
              : eq
          )
        );
        toast({ title: t('photoSaved'), description: t('photoSavedDesc') }); // Add success toast
      } catch (error) {
        console.error("Error resizing or saving photo:", error);
        toast({ title: t('errorSavingPhoto'), description: t('errorProcessingImage'), variant: "destructive" });

      }

    }
    setShowCamera(false);
    setCurrentEquipmentId(null); // Reset currentEquipmentId
  };

  const viewPhoto = (photo) => {
    setCurrentPhoto(photo);
    setShowPhotoViewer(true);
  };
  
  const handleDeletePhoto = (equipmentId, photoIndex) => {
    setEquipments(prev =>
      prev.map(eq => {
        if (eq.id === equipmentId && eq.photos) {
          const newPhotos = eq.photos.filter((_, index) => index !== photoIndex);
          return { ...eq, photos: newPhotos };
        }
        return eq;
      })
    );
    toast({ title: t('photoRemoved'), description: t('photoRemovedDesc') });
  };

  const filteredEquipments = equipments.filter(equipment => {
    const nameMatch = equipment.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = equipment.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = equipment.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || typeMatch || locationMatch;

    const matchesStatus = filterStatus === 'all' || equipment.status === filterStatus;
    const matchesType = filterType === 'all' || equipment.type === filterType;
    const matchesLocation = filterLocation === 'all' || equipment.location === filterLocation;

    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });
  
  // Sort filtered equipments by lastCheck or id (most recent first)
  const sortedEquipments = filteredEquipments.sort((a, b) => {
    const dateA = a.lastCheck ? new Date(a.lastCheck).getTime() : a.id;
    const dateB = b.lastCheck ? new Date(b.lastCheck).getTime() : b.id;
    // Sort in descending order (most recent first)
    return dateB - dateA;
  });


  const stats = {
    total: equipments.length,
    functioning: equipments.filter(eq => eq.status === 'funcionando').length,
    maintenance: equipments.filter(eq => eq.status === 'manutencao').length,
    broken: equipments.filter(eq => eq.status === 'defeito').length
  };

  const uniqueTypes = [...new Set(equipments.map(eq => eq.type).filter(Boolean))];
  const uniqueLocations = [...new Set(equipments.map(eq => eq.location).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-md text-company-text-secondary text-center mb-10 max-w-3xl mx-auto"
      >
        {t('appDescription')} {user && <span className="font-semibold">{t('welcomeUser', {name: user.name})}</span>}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8"
      >
        {[
          { labelKey: 'total', value: stats.total, color: 'text-company-brand-accent' },
          { labelKey: 'functioning', value: stats.functioning, color: 'text-green-500' },
          { labelKey: 'maintenance', value: stats.maintenance, color: 'text-yellow-500' },
          { labelKey: 'broken', value: stats.broken, color: 'text-red-500' },
        ].map(stat => (
          <Card key={stat.labelKey} className="bg-company-card-bg border-company-border hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4 text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-company-text-secondary">{t(stat.labelKey)}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="bg-company-card-bg border-company-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-company-text-secondary h-4 w-4" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-company-input-bg border-company-border text-company-text-primary placeholder:text-company-text-secondary w-full focus:ring-company-brand focus:border-company-brand"
                />
              </div>

              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-company-input-bg border-company-border rounded-md text-company-text-primary text-sm focus:ring-company-brand focus:border-company-brand"
                >
                  <option value="all">{t('allStatuses')}</option>
                  <option value="funcionando">{t('functioning')}</option>
                  <option value="manutencao">{t('maintenance')}</option>
                  <option value="defeito">{t('broken')}</option>
                </select>

                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="px-3 py-2 bg-company-input-bg border-company-border rounded-md text-company-text-primary text-sm focus:ring-company-brand focus:border-company-brand"
                >
                  <option value="all">{t('allLocations')}</option>
                  {PREDEFINED_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                  {uniqueLocations.filter(loc => !PREDEFINED_LOCATIONS.includes(loc)).map(loc => (
                     <option key={loc} value={loc}>{loc} (Outra)</option>
                  ))}
                </select>
                
                 {/* Photo Size Selector */}
                 <select
                  value={selectedPhotoSize}
                  onChange={(e) => setSelectedPhotoSize(e.target.value)}
                  className="px-3 py-2 bg-company-input-bg border-company-border rounded-md text-company-text-primary text-sm focus:ring-company-brand focus:border-company-brand"
                >
                  {Object.keys(PHOTO_SIZES).map(size => (
                    <option key={size} value={size}>{t(`Tamanho foto.${size.toLowerCase()}`)}</option> // Use translation key
                  ))}
                </select>


                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-company-brand text-company-brand-foreground hover:bg-company-brand/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('add')}
                </Button>

                <Button
                  onClick={() => setShowReportModal(true)}
                  variant="outline"
                  className="border-company-brand-accent text-company-brand-accent hover:bg-company-brand-accent/10"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  {t('report')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredEquipments.map((equipment) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              onDelete={deleteEquipment}
              onTakePhoto={openCamera}
              onViewPhoto={viewPhoto}
              onDeletePhoto={handleDeletePhoto} // Pass the new handler
              // Remove onSaveName prop as part of reverting name editing changes
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredEquipments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4 text-company-brand">📱</div>
          <h3 className="text-xl font-semibold text-company-text-primary mb-2">
            {t('noEquipmentFound')}
          </h3>
          <p className="text-company-text-secondary mb-6">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterLocation !== 'all'
              ? t('adjustFilters')
              : t('addFirstEquipment')
            }
          </p>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-company-brand text-company-brand-foreground hover:bg-company-brand/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('addEquipmentButton')}
          </Button>
        </motion.div>
      )}

      <AddEquipmentForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={addEquipment}
        locations={PREDEFINED_LOCATIONS}
      />

      <CameraCapture
        isOpen={showCamera}
        onClose={() => {
          setShowCamera(false);
          setCurrentEquipmentId(null);
        }}
        onPhotoCapture={handlePhotoCapture}
      />

      <PhotoViewer
        photo={currentPhoto}
        isOpen={showPhotoViewer}
        onClose={() => {
          setShowPhotoViewer(false);
          setCurrentPhoto(null);
        }}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        equipments={equipments} // Passa o estado local com as fotos
        locations={PREDEFINED_LOCATIONS}
        logoUrl={logoUrl}
        logoPlaceholder={LOGO_PLACEHOLDER_TEXT}
      />
    </div>
  );
};

export default ChecklistPage;
