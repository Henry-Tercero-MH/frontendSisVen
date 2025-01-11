import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "./logoOriginal.png";

const Header = () => {
  return (
    <>
      <header>
        <div className={styles.boxHeader}>
          <div>
            <Link to="/">
              <img src={logo} alt="Logo" className={styles.logo} />
            </Link>
          </div>
          <nav className={styles.cabecera}>
            <Link to="/">Home</Link>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
