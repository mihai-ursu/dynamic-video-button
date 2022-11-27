import DynamicVideoButton from "components/DynamicVideoButton/DynamicVideoButton";
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.spacer} />
      <DynamicVideoButton>
        <div className={styles.video}></div>
      </DynamicVideoButton>
    </div>
  );
}
