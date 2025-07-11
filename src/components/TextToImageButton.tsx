import React, { useState } from 'react';
import { textToImage, STABLECOG_MODELS_LIST } from '../utils/textToImage';

interface TextToImageButtonProps {
  prompt: string;
  style?: React.CSSProperties;
  enabled?: boolean;
}

export const TextToImageButton: React.FC<TextToImageButtonProps> = ({ prompt, style, enabled = true }) => {
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setImg(null);
    try {
      const image = await textToImage(prompt);
      setImg(image);
      setShow(true);
    } catch (e: any) {
      setError(e.message || 'Failed to generate image.');
      setShow(true);
    } finally {
      setLoading(false);
    }
  };

  if (!enabled) return null;
  return (
    <div style={{ display: 'inline-block', ...style }}>
      <button
        className="techno-btn"
        style={{ marginLeft: 8, fontSize: 13, padding: '0.3em 0.7em' }}
        onClick={handleClick}
        disabled={loading}
        title="Generate an image from this sentence"
      >
        🖼️ Image
      </button>
      {show && (
        <div style={{ marginTop: 8, maxWidth: 320 }}>
          {loading && <div>Generating image...</div>}
          {error && <div style={{ color: '#ff3860' }}>{error}</div>}
          {img && <img src={img} alt="Generated visual" style={{ maxWidth: '100%', borderRadius: 8, marginTop: 4 }} />}
        </div>
      )}
    </div>
  );
};
