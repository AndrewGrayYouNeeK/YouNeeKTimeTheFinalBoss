import { createPortal } from 'react-dom';

export default function LightningFlash() {
  return createPortal(
    <div className="lightning-sky-flash" aria-hidden="true" />,
    document.body
  );
}
