import { Box, Stack, Title } from '@mantine/core';
import { FC } from 'react';
import QRCode from 'react-qr-code';

const QrDisplay: FC<{ props: { name: string; course: string; qrcode: string } }> = ({ props }) => {
  return (
    <>
      <Stack align="center">
        <Title align="center" order={2}>
          Thank you for registering
        </Title>
        <QRCode value={props.qrcode} />
        <Box style={{ textAlign: 'center' }}>
          <Title mb={0}>{props.name}</Title>
          <Title mt={0} order={4} color="gray">
            {props.course}
          </Title>
        </Box>
      </Stack>
    </>
  );
};

export default QrDisplay;
