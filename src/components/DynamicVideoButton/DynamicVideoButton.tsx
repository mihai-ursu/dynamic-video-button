import React, {
  FunctionComponent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import DynamicVideoButtonProps from "./DynamicVideoButtonProps";
import styles from "./DynamicVideoButton.module.scss";
import { useMotionValue, useSpring } from "framer-motion";
import { motion } from "framer-motion";
import useIsomorphicLayoutEffect from "hooks/useIsomorphicLayoutEffect";

const DynamicVideoButton: FunctionComponent<DynamicVideoButtonProps> = ({
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const [dimensions, setDimensions] = useState<DOMRect | null>(null);
  console.log(
    "🚀 ~ file: DynamicVideoButton.tsx ~ line 25 ~ dimensions",
    dimensions
  );

  const callBackRef = useCallback((domNode: any) => {
    if (domNode) {
      setDimensions(domNode.getBoundingClientRect());
    }
  }, []);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const buttonLeft = dimensions?.left ?? 0;
    const buttonTop = dimensions?.top ?? 0;

    const onMouseMove = (e: MouseEvent) => {
      if (isHovered) {
        cursorX.set(e.clientX - buttonLeft);
        cursorY.set(e.clientY - buttonTop);
      } else {
        cursorX.set(0);
        cursorY.set(0);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [isHovered, cursorX, cursorY, dimensions]);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
        ref={callBackRef}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, delay: 0.4 }}
        className={styles.customButton}
      />
      {children}
    </div>
  );
};

export default DynamicVideoButton;
