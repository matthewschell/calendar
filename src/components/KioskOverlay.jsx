import { useKiosk } from '../hooks/useKiosk';

export default function KioskOverlay() {
  const { isDimmed, dimIntensity } = useKiosk();

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-1000 ease-in-out ${
        isDimmed ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ opacity: isDimmed ? dimIntensity : 0 }}
    />
  );
}