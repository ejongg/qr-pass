import { Alert, Button, Group, Loader, Modal, Text, Title } from '@mantine/core';
import { QrcodeSuccessCallback } from 'html5-qrcode/esm/core';
import { useState } from 'react';
import { Scan } from 'tabler-icons-react';
import { Student } from '../api-interface';
import QrReader from './QrReader';

const QrScanModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [success, setSuccess] = useState<Student | null>(null);

  const onSuccess = (result: QrcodeSuccessCallback) => {
    setScanned(true);

    (async () => {
      const res = await fetch('/api/registrations/mark-attendance', {
        method: 'POST',
        body: JSON.stringify({
          qrcode: result,
        }),
      });

      if (res.status === 200) {
        const body = await res.json();
        setSuccess(body);
      }
    })();
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
      <Modal
        closeOnClickOutside={false}
        closeOnEscape={false}
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title="QR Scan"
      >
        <>
          {!scanned && <QrReader onSuccess={onSuccess} />}
          {scanned && (
            <Group direction="column" align="center">
              {!success ? (
                <Loader />
              ) : (
                <Alert color="green">
                  <Text size="xl" align="center" weight="bold" color="green">
                    {success.name}
                  </Text>
                  <Text align="center">marked as present</Text>
                </Alert>
              )}
              <Button onClick={() => setScanned(false)} variant="subtle">
                Scan again
              </Button>
            </Group>
          )}
        </>
      </Modal>
    </>
  );
};

export default QrScanModal;
