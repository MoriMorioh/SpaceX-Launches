import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalPortalProps {
  launch: Launch;
  onClose: () => void;
}

export const ModalPortal: React.FC<ModalPortalProps> = ({ launch, onClose }) => {
  const modalRoot = document.getElementById('modal-root');
  const rawUrl = launch.links?.mission_patch || null;

  const [prevRawUrl, setPrevRawUrl] = useState<string | null>(rawUrl);
  const [hasError, setHasError] = useState(false);

  if (prevRawUrl !== rawUrl) {
    setPrevRawUrl(rawUrl);
    setHasError(false);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!modalRoot) return null;

  const showImage = rawUrl && !hasError;

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      aria-label="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            border: 'none',
            background: 'none',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <h3 style={{ marginTop: 0, paddingRight: '20px' }}>{launch.mission_name}</h3>

        {showImage && (
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <img
              src={rawUrl}
              alt={launch.mission_name}
              style={{ width: '150px', height: '150px', objectFit: 'contain' }}
              onError={() => setHasError(true)}
            />
          </div>
        )}

        <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
          <p>
            <strong>Mission name:</strong>
            <br />
            {launch.mission_name}
          </p>
          <p>
            <strong>Rocket name:</strong>
            <br />
            {launch.rocket?.rocket_name}
          </p>
          <p>
            <strong>Details:</strong>
            <br />
            {launch.details}
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
};