import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, .interactive')) {
        setHovering(true);
      }
    };
    const onOut = () => setHovering(false);
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    let raf: number;
    const follow = () => {
      setRingPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.15,
        y: prev.y + (pos.y - prev.y) * 0.15,
      }));
      raf = requestAnimationFrame(follow);
    };
    raf = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  if (!visible) return null;

  return (
    <>
      <div
        className="fixed pointer-events-none z-[10000]"
        style={{
          left: pos.x - 3.5,
          top: pos.y - 3.5,
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: 'var(--sesmi-warm)',
        }}
      />
      <div
        className="fixed pointer-events-none z-[10000] transition-transform duration-200"
        style={{
          left: ringPos.x - (hovering ? 20 : 14),
          top: ringPos.y - (hovering ? 20 : 14),
          width: hovering ? 40 : 28,
          height: hovering ? 40 : 28,
          borderRadius: '50%',
          border: '1px solid rgba(200, 121, 58, 0.35)',
        }}
      />
    </>
  );
};

export default CustomCursor;
