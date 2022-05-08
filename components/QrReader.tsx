import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import React, { FC, useEffect, useState } from 'react';

const readerId = 'html5-qr';

const QrReader: FC<{ onSuccess: (result: any) => void }> = ({ onSuccess }) => {
  const [reader, setReader] = useState<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    setReader(
      new Html5QrcodeScanner(
        readerId,
        {
          fps: 10,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          qrbox: 250,
        },
        false
      )
    );
    if (reader) {
      reader.render(onSuccess, () => {});
    }

    return () => {
      // Unmount
    };
  }, []);

  return <div id={readerId} />;
};

export default QrReader;
