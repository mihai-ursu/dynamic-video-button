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
  const [elementCenter, setElementCenter] = useState({
    x: 0,
    y: 0,
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const getElementCenter = (wrapperRef: RefObject<HTMLDivElement>) => {
    if (!wrapperRef) return { x: 0, y: 0 };
    const left = wrapperRef?.current?.getBoundingClientRect().left || 0;
    const top = wrapperRef?.current?.getBoundingClientRect().top || 0;

    const width = wrapperRef?.current?.getBoundingClientRect().width || 0;
    const height = wrapperRef?.current?.getBoundingClientRect().height || 0;

    const x = left + width / 2;
    const y = top + height / 2;

    return { x, y };
  };

  useEffect(() => {
    cursorX.set(0);
    cursorY.set(0);
  }, [cursorX, cursorY, elementCenter.x, elementCenter.y]);

  useEffect(() => {
    const { x, y } = getElementCenter(wrapperRef);
    setElementCenter({ x: x, y: y });
  }, []);

  const onMouseMove = (e: MouseEvent) => {
    if (isHovered) {
      cursorX.set(e.clientX - PLAY_BUTTON_SIZE / 2);
      cursorY.set(e.clientY - PLAY_BUTTON_SIZE / 2);
    } else {
      cursorX.set(0);
      cursorY.set(0);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  });

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={wrapperRef}
    >
      <motion.div
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
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
