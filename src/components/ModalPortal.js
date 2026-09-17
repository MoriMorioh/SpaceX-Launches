import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classes from './ModalPortal.module.css';
export const ModalPortal = ({ launch, onClose }) => {
    const modalRoot = document.getElementById('modal-root');
    const rawUrl = launch.links?.mission_patch || null;
    const [prevRawUrl, setPrevRawUrl] = useState(rawUrl);
    const [hasError, setHasError] = useState(false);
    if (prevRawUrl !== rawUrl) {
        setPrevRawUrl(rawUrl);
        setHasError(false);
    }
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    if (!modalRoot)
        return null;
    const showImage = rawUrl && !hasError;
    return ReactDOM.createPortal(_jsx("div", { className: classes.overlay, onClick: onClose, "aria-label": "modal-overlay", children: _jsxs("div", { className: classes.content, onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: classes.closeButton, onClick: onClose, "aria-label": "Close modal", children: "\u2715" }), _jsx("h3", { className: classes.title, children: launch.mission_name }), showImage && (_jsx("div", { className: classes.imageWrapper, children: _jsx("img", { className: classes.image, src: rawUrl, alt: launch.mission_name, onError: () => setHasError(true) }) })), _jsxs("div", { className: classes.details, children: [_jsxs("p", { children: [_jsx("strong", { children: "Mission name:" }), _jsx("br", {}), launch.mission_name] }), _jsxs("p", { children: [_jsx("strong", { children: "Rocket name:" }), _jsx("br", {}), launch.rocket?.rocket_name || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Details:" }), _jsx("br", {}), launch.details || 'No details available.'] })] })] }) }), modalRoot);
};
