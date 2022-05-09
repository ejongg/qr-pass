import { Box, Stack, Title } from '@mantine/core';
import { FC } from 'react';
import QRCode from 'react-qr-code';
import { Student } from '../api-interface';

const QrDisplay: FC<{ student: Student }> = ({ student }) => {
  return (
    <>
      <Stack align="center">
        <Title align="center" order={2}>
          Thank you for confirming
        </Title>
        <QRCode value={student.registration?.qrcode || ''} />
        <Box style={{ textAlign: 'center' }}>
          <Title mb={0}>{student.name}</Title>
          <Title mt={0} order={4} color="gray">
            {student.course}
          </Title>
        </Box>
      </Stack>
    </>
  );
};

export default QrDisplay;
