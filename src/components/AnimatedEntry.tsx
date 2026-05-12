import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedEntryProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

const AnimatedEntry = ({ children, className = '', delay = 0, y = 16 }: AnimatedEntryProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' as const }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedEntry;
