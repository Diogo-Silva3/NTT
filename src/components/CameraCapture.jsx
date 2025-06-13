import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const CameraCapture = ({ onPhotoCapture, isOpen, onClose }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [usedPhotos, setUsedPhotos] = useState([]);
  const [captureWidth, setCaptureWidth] = useState(null);
  const [captureHeight, setCaptureHeight] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        toast({
          title: "Câmera ativada!",
          description: "Pronto para capturar fotos dos equipamentos.",
        });
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      toast({
        title: "Erro na câmera",
        description: "Não foi possível acessar a câmera. Verifique as permissões.",
        variant: "destructive",
      });
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    let targetWidth = captureWidth;
    let targetHeight = captureHeight;

    if (targetWidth && !targetHeight) {
      targetHeight = (videoHeight / videoWidth) * targetWidth;
    } else if (!targetWidth && targetHeight) {
      targetWidth = (videoWidth / videoHeight) * targetHeight;
    } else if (!targetWidth && !targetHeight) {
      targetWidth = videoWidth;
      targetHeight = videoHeight;
    } else {
      const aspectRatio = videoWidth / videoHeight;
      if (Math.abs(targetWidth / targetHeight - aspectRatio) > 0.01) {
        console.warn("Ajustando altura para manter proporção.");
        targetHeight = targetWidth / aspectRatio;
      }
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedPhotos(prev => [...prev, photoDataUrl]);

    toast({
      title: "Foto capturada!",
      description: "Foto salva com sucesso.",
    });
  }, [captureWidth, captureHeight]);

  const savePhoto = useCallback((photo) => {
    setUsedPhotos(prev => {
      if (!prev.includes(photo)) {
        toast({
          title: "Foto marcada como usada!",
          description: "A foto será enviada ao finalizar.",
        });
        return [...prev, photo];
      }
      return prev;
    });
  }, []);

  const downloadPhoto = useCallback((photo) => {
    if (!photo) return;

    const link = document.createElement('a');
    link.href = photo;
    link.download = `equipamento-${Date.now()}.jpg`;
    link.click();

    toast({
      title: "Download iniciado!",
      description: "A foto está sendo baixada.",
    });
  }, []);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
    if (isStreaming) {
      stopCamera();
      setTimeout(startCamera, 100);
    }
  }, [isStreaming, startCamera, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedPhotos(prev => prev.slice(0, -1));
  }, []);

  useEffect(() => {
    if (isOpen && !isStreaming) {
      startCamera();
    }

    return () => {
      if (!isOpen) {
        stopCamera();
        setCapturedPhotos([]);
        setUsedPhotos([]);
      }
    };
  }, [isOpen, isStreaming, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 overflow-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl bg-black/70 rounded-lg p-4"
        >
          <Card className="glass-effect border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  Capturar Fotos
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="relative mb-6">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 md:h-80 object-cover camera-preview rounded"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {isStreaming && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                      <Button
                        onClick={capturePhoto}
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Capturar
                      </Button>

                      <Button
                        onClick={switchCamera}
                        variant="outline"
                        size="lg"
                        className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Galeria de fotos capturadas */}
                {capturedPhotos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Fotos Capturadas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {capturedPhotos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="relative border border-gray-700 rounded overflow-hidden"
                        >
                          <img
                            src={photo}
                            alt={`Foto capturada ${idx + 1}`}
                            className="w-full h-40 object-cover"
                          />
                          <div className="flex justify-between items-center bg-black bg-opacity-60 p-1">
                            <Button
                              onClick={() => savePhoto(photo)}
                              size="sm"
                              className={`${
                                usedPhotos.includes(photo)
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-700 text-gray-300'
                              }`}
                            >
                              {usedPhotos.includes(photo) ? 'Usada' : 'Usar'}
                            </Button>
                            <Button
                              onClick={() => downloadPhoto(photo)}
                              variant="outline"
                              size="sm"
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botão finalizar se tiver fotos usadas */}
                {usedPhotos.length > 0 && (
                  <div className="flex justify-center pt-6">
                    <Button
                      onClick={() => {
                        if (onPhotoCapture) onPhotoCapture(usedPhotos);
                        toast({
                          title: "Fotos enviadas!",
                          description: "As fotos usadas foram enviadas com sucesso.",
                        });
                        onClose();
                      }}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Finalizar
                    </Button>
                  </div>
                )}

                {/* Botão para apagar a última foto */}
                {capturedPhotos.length > 0 && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={retakePhoto}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Apagar última foto
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CameraCapture;
