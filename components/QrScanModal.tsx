import { Button, Loader, Modal } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Html5QrcodeResult, QrcodeSuccessCallback } from 'html5-qrcode/esm/core';
import { useState, useRef } from 'react';
import { Scan } from 'tabler-icons-react';
import QrReader from './QrReader';

const QrScanModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scanned, setScanned] = useState(false);

  const onSuccess = (result: QrcodeSuccessCallback) => {
    console.log(result);
    setScanned(true);
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
        <>
          {!scanned && <QrReader onSuccess={onSuccess} />}
          {scanned && (
            <Button onClick={() => setScanned(false)} variant="subtle">
              Scan again
            </Button>
          )}
        </>
      </Modal>
    </>
  );
};

export default QrScanModal;
