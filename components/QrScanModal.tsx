import { Alert, Button, Group, Loader, Modal, Text, Title } from '@mantine/core';
import { QrcodeSuccessCallback } from 'html5-qrcode/esm/core';
import { useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Scan } from 'tabler-icons-react';
import { Student } from '../api-interface';
import { studentContext } from '../context/students';
import QrReader from './QrReader';

const QrScanModal = () => {
  const { students, setStudents } = useContext(studentContext);
  const [{ access_token }] = useCookies(['access_token']);
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
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (res.status === 200) {
        const body = await res.json();
        setSuccess(body);
        setStudents(students.map((s) => (s._id === body._id ? Object.assign(s, body) : s)));
      }
    })();
  };

  const reset = () => {
    setScanned(false);
    setSuccess(null);
  };

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
          reset();
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
              <Button onClick={() => reset()} variant="subtle">
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
