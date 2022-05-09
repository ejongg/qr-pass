import { Html5Qrcode } from 'html5-qrcode';
import React, { FC, useEffect } from 'react';

const QrReader: FC<{ onSuccess: (result: any) => void }> = ({ onSuccess }) => {
  useEffect(() => {
    const qrcodeReader = new Html5Qrcode('qrcode-reader');
    qrcodeReader.start({ facingMode: 'environment' }, { fps: 10 }, onSuccess, () => {});

    return () => {
      qrcodeReader.stop();
    };
  }, []);

  return <div id="qrcode-reader" />;
};

export default QrReader;
