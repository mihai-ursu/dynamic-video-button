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
  const [buttonTopAndLeft, setButtonTopAndLeft] = useState({ top: 0, left: 0 });
  console.log(
    "🚀 ~ file: DynamicVideoButton.tsx ~ line 19 ~ buttonTopAndLeft",
    buttonTopAndLeft
  );

  const buttonRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const setButtonTopAndLeftPosition = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const buttonRect = ref.current.getBoundingClientRect();
      setButtonTopAndLeft({ top: buttonRect.top, left: buttonRect.left });
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", () =>
      setButtonTopAndLeftPosition(buttonRef)
    );
    return () => {
      document.removeEventListener("scroll", () =>
        setButtonTopAndLeftPosition(buttonRef)
      );
    };
  }, [buttonRef]);

  const onMouseMove = (e: MouseEvent) => {
    if (isHovered) {
      cursorX.set(e.clientX - buttonTopAndLeft.left - PLAY_BUTTON_SIZE / 2);
      cursorY.set(e.clientY - buttonTopAndLeft.top - PLAY_BUTTON_SIZE / 2);
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
    >
      <motion.div
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
        ref={buttonRef}
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
