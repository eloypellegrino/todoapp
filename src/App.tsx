import styles from './App.module.css';
import logo from './assets/logo.png';
import { Task } from './components/Task';

export function App() {
    return (
        <div className='App'>
            <div className={styles.appTodo}>
                <header className={styles.header}>
                    <img className={styles.logo} src={logo} alt='' />
                </header>
                <main className={styles.main}>
                    <Task />
                </main>
            </div>
        </div>
    );
}
