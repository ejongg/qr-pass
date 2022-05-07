import { Stack, Title } from '@mantine/core';
import { FC } from 'react';
import QRCode from 'react-qr-code';

const QrDisplay: FC<{ name: string; qrcode: string }> = ({ name, qrcode }) => {
  return (
    <>
      <Stack align="center">
        <Title align="center" order={2}>
          Thank you for registering
        </Title>
        <QRCode value={qrcode} />
        <Title>{name}</Title>
      </Stack>
    </>
  );
};

export default QrDisplay;
