import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classes from './ModalPortal.module.css';

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
      className={classes.overlay}
      onClick={onClose}
      aria-label="modal-overlay"
    >
      <div
        className={classes.content}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={classes.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <h3 className={classes.title}>{launch.mission_name}</h3>

        {showImage && (
          <div className={classes.imageWrapper}>
            <img
              className={classes.image}
              src={rawUrl}
              alt={launch.mission_name}
              onError={() => setHasError(true)}
            />
          </div>
        )}

        <div className={classes.details}>
          <p>
            <strong>Mission name:</strong>
            <br />
            {launch.mission_name}
          </p>
          <p>
            <strong>Rocket name:</strong>
            <br />
            {launch.rocket?.rocket_name || 'N/A'}
          </p>
          <p>
            <strong>Details:</strong>
            <br />
            {launch.details || 'No details available.'}
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
};