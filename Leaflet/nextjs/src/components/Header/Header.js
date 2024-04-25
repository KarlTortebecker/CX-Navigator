import Link from 'next/link';
import { FaMapMarked } from 'react-icons/fa';

import Container from '@components/Container';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">
            Le CX Navigator
          </Link>
        </p>
        <ul className={styles.headerLinks}>
          <li>
            <a href="https://github.com/colbyfayock/next-leaflet-starter" rel="noreferrer">
              <FaMapMarked />
            </a>
          </li>
        </ul>
      </Container>
    </header>
  );
};

export default Header;
