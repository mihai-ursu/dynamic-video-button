import {
  FunctionComponent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import CustomCursorProps from "./CustomCursorProps";
import styles from "./CustomCursor.module.scss";
import { useMotionValue, useSpring } from "framer-motion";
import { motion } from "framer-motion";

const CustomCursor: FunctionComponent<CustomCursorProps> = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [wrapperRightAndBottom, setWrapperRightAndBottom] = useState({
    x: 0,
    y: 0,
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const getWrapperRightAndBottom = (wrapperRef: RefObject<HTMLDivElement>) => {
    if (!wrapperRef) return { right: 0, bottom: 0 };
    const right = wrapperRef?.current?.getBoundingClientRect().right || 0;
    const bottom = wrapperRef?.current?.getBoundingClientRect().bottom || 0;

    return { right, bottom };
  };

  useEffect(() => {
    cursorX.set(wrapperRightAndBottom.x / 2 - 30);
    cursorY.set(wrapperRightAndBottom.y / 2 - 30);
  }, [cursorX, cursorY, wrapperRightAndBottom.x, wrapperRightAndBottom.y]);

  useEffect(() => {
    const { right, bottom } = getWrapperRightAndBottom(wrapperRef);
    setWrapperRightAndBottom({ x: right, y: bottom });
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  });

  const onMouseMove = (e: MouseEvent) => {
    if (isHovered) {
      cursorX.set(e.clientX - 30);
      cursorY.set(e.clientY - 30);
    } else {
      cursorX.set(wrapperRightAndBottom.x / 2 - 30);
      cursorY.set(wrapperRightAndBottom.y / 2 - 30);
    }
  };

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
        animate={{ scale: isHovered ? 1 : 1 }}
        transition={{ duration: 0.2 }}
        className={styles.customCursor}
      />
      {children}
    </div>
  );
};

export default CustomCursor;
