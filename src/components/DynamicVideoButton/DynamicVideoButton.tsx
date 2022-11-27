import {
  FunctionComponent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import DynamicVideoButtonProps from "./DynamicVideoButtonProps";
import styles from "./DynamicVideoButton.module.scss";
import { useMotionValue, useSpring } from "framer-motion";
import { motion } from "framer-motion";

const DynamicVideoButton: FunctionComponent<DynamicVideoButtonProps> = ({
  children,
}) => {
  const PLAY_BUTTON_SIZE = 60;
  const [isHovered, setIsHovered] = useState(false);
  const [wrapperDimensions, setWrapperDimensions] = useState<DOMRect | null>(
    null
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const getWrapperDimensions = (ref: RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    setWrapperDimensions(ref.current.getBoundingClientRect());
  };

  useEffect(() => {
    getWrapperDimensions(wrapperRef);

    document.addEventListener("scroll", () => getWrapperDimensions(wrapperRef));
    return () => {
      document.removeEventListener("scroll", () =>
        getWrapperDimensions(wrapperRef)
      );
    };
  }, [wrapperRef]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const wrapperLeft = wrapperDimensions?.left ?? 0;
      const wrapperTop = wrapperDimensions?.top ?? 0;
      const wrapperHeight = wrapperDimensions?.height ?? 0;
      const wrapperWidth = wrapperDimensions?.width ?? 0;

      const calcLeft = wrapperLeft + wrapperWidth / 2;
      const calcTop = wrapperTop + wrapperHeight / 2;

      if (isHovered) {
        cursorX.set(e.clientX - calcLeft);
        cursorY.set(e.clientY - calcTop);
      } else {
        cursorX.set(0);
        cursorY.set(0);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [isHovered, wrapperDimensions, cursorX, cursorY]);

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
        className={styles.customButton}
      />
      {children}
    </div>
  );
};

export default DynamicVideoButton;
