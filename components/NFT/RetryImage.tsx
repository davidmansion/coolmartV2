// RetryImage.js
import React, { useState } from 'react';

interface RetryImageProps {
  src: string;
  alt?: string;
  maxRetries?: number;
}

const RetryImage: React.FC<RetryImageProps> = ({ src, alt, maxRetries = 1000, ...props }) => {
  const [retryCount, setRetryCount] = useState(0);
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setImgSrc(`${src}?retry=${retryCount}`);
        setRetryCount(retryCount + 1);
      }, 25000);  // 1 second delay before retrying
    }
  };

  return <img src={imgSrc} alt={alt} {...props} />;
};

export default RetryImage;
