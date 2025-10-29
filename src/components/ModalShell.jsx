import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const panelVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

const MODAL_ROOT_ID = 'modal-root';

function ensureModalRoot() {
  let root = document.getElementById(MODAL_ROOT_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = MODAL_ROOT_ID;
    document.body.appendChild(root);
  }
  return root;
}

function ModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
  hideCloseButton = false
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.__modalCount = (window.__modalCount || 0) + 1;
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    window.__lenis?.stop?.();
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.__modalCount = Math.max((window.__modalCount || 1) - 1, 0);
      if (window.__modalCount === 0) {
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
        window.__lenis?.start?.();
      }
    };
  }, [isOpen, onClose]);

  const modalRoot = useMemo(() => {
    if (typeof document === 'undefined') return null;
    return ensureModalRoot();
  }, []);

  if (typeof document === 'undefined' || !modalRoot) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="modal-shell__overlay"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={onClose}
        >
          <motion.div
            className={`modal-shell__panel modal-shell__panel--${size}`}
            variants={panelVariants}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            {(title || !hideCloseButton) && (
              <header className="modal-shell__header">
                <div>
                  {title && <h2>{title}</h2>}
                  {subtitle && <p>{subtitle}</p>}
                </div>
                {!hideCloseButton && (
                  <button type="button" className="modal-shell__close" onClick={onClose} aria-label="Close dialog">
                    ×
                  </button>
                )}
              </header>
            )}
            <div className="modal-shell__body">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    modalRoot
  );
}

export default ModalShell;

