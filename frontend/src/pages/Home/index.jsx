import logo from './logo.svg';
import styles from './styles.module.scss';

const Home = () => (
  <div className={styles.home}>
    <header className={styles.appHeader}>
      <img src={logo} className={styles.appLogo} alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className={styles.appLink}
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);

export default Home;
