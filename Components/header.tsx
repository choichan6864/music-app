import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">홈</Link>
      <Link href="/upload">
        <button className={styles.uploadBtn}>+</button>
      </Link>
      <Link href="/sign-in">로그인</Link>
      <Link href="/sign-up">회원가입</Link>
    </header>
  );
}
