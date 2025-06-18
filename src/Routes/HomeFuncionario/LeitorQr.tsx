import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface LeitorQrProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

const LeitorQr: React.FC<LeitorQrProps> = ({ onScan, onClose }) => {
  const qrCodeRef = useRef<Html5Qrcode | null>(null);
  const [scannerAtivo, setScannerAtivo] = useState(false);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    qrCodeRef.current = html5QrCode;

    Html5Qrcode.getCameras().then(cameras => {
      if (cameras && cameras.length) {
        const cameraId = cameras[0].id;
        html5QrCode.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScan(decodedText);
            html5QrCode.stop().then(() => {
              setScannerAtivo(false);
            }).catch(() => {});
          },
          (error) => {
            // erros comuns ignorados
          }
        ).then(() => {
          setScannerAtivo(true);
        }).catch((err) => {
          console.error('Erro ao iniciar scanner:', err);
          setScannerAtivo(false);
        });
      }
    }).catch(err => {
      console.error('Erro ao acessar câmeras:', err);
      setScannerAtivo(false);
    });

    return () => {
      if (scannerAtivo && qrCodeRef.current) {
        qrCodeRef.current.stop().then(() => {
          qrCodeRef.current?.clear();
          setScannerAtivo(false);
        }).catch(() => {});
      }
    };
  }, []);

  const handleFechar = () => {
    if (scannerAtivo && qrCodeRef.current) {
      qrCodeRef.current.stop().then(() => {
        qrCodeRef.current?.clear();
        setScannerAtivo(false);
        onClose();
      }).catch(() => {
        onClose();
      });
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-[500px]">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#8b0000]">LER QR-CODE</h2>
        <div id="reader" className="w-full" />
        <button
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl"
          onClick={handleFechar}
        >
          Fechar Leitor
        </button>
      </div>
    </div>
  );
};

export default LeitorQr;
