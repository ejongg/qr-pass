import { Button, Loader, Modal } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { Scan } from 'tabler-icons-react';

const QrScanModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handler = (result: any, error: any) => {
    if (error) {
      return;
    }
    if (!scanned && result) {
      setScanned(true);

      const video = document.querySelector('video') as any;
      const tracks = video.srcObject.getVideoTracks();
      tracks[0].stop();

      showNotification({
        title: 'Success',
        color: 'green',
        message: 'Emmanuel confirmed event attendance',
      });

      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          setScanned(false);
          setIsOpen(true);
        }}
        variant="subtle"
        leftIcon={<Scan />}
      >
        Scan QR
      </Button>
      <Modal opened={isOpen} onClose={() => setIsOpen(false)} title="QR Scan">
        {!scanned && <QrReader scanDelay={3000} constraints={{ facingMode: 'environment' }} onResult={handler} />}
      </Modal>
    </>
  );
};

export default QrScanModal;
