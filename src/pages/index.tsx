import CustomCursor from "components/CustomCursor/CustomCursor";
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <CustomCursor>
        <div className={styles.video}></div>
      </CustomCursor>
    </div>
  );
}
