import styles from './Task.module.css';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Trash, PlusCircle, Check, Clipboard } from 'phosphor-react';

interface ITask {
    id: string;
    title: string;
    isCompleted: boolean;
}

export function Task() {
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState<ITask[]>([]);
    const tasksQuantity = tasks.length;
    const completedTasks = tasks.filter((task) => task.isCompleted).length;

    useEffect(() => {
        loadSavedTasks();
    }, []);

    function loadSavedTasks() {
        const saved = localStorage.getItem('todo');
        if (saved) {
            setTasks(JSON.parse(saved));
        }
    }

    function setTasksAndSave(newTasks: ITask[]) {
        setTasks(newTasks);
        localStorage.setItem('todo', JSON.stringify(newTasks));
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setTasksAndSave([
            ...tasks,
            {
                id: crypto.randomUUID(),
                title: newTask,
                isCompleted: false,
            },
        ]);
        setNewTask('');
    }

    function handleNewTask(event: ChangeEvent<HTMLInputElement>) {
        setNewTask(event.target.value);
    }

    function deleteTask(taskToDelete: ITask) {
        const tasksWithoutDeletedOne = tasks.filter((task) => {
            return task.id !== taskToDelete.id;
        });
        setTasksAndSave(tasksWithoutDeletedOne);
    }

    function toogleTaskCompleted(taskId: string) {
        const newTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return {
                    ...task,
                    isCompleted: !task.isCompleted,
                };
            }
            return task;
        });
        setTasksAndSave(newTasks);
    }

    const isNewTaskEmpty = newTask.length === 0;

    return (
        <>
            {/* Input para adicionar uma nova tarefa */}
            <div className={styles.containerTaskInput}>
                <form onSubmit={handleSubmit}>
                    <input
                        onChange={handleNewTask}
                        value={newTask}
                        placeholder='Adicione uma nova tarefa'
                        type='text'
                    />
                    <button disabled={isNewTaskEmpty} type='submit'>
                        Criar <PlusCircle size={18} weight='bold' />
                    </button>
                </form>
            </div>

            {/* Barra de status com tarefas criadas e concluídas */}
            <div className={styles.containerStatusBar}>
                <div className={styles.createdTasks}>
                    <p>Tarefas criadas</p>
                    <span className={styles.tag}>{tasksQuantity}</span>
                </div>

                <div className={styles.completedTasks}>
                    <p>Concluídas</p>
                    <span className={styles.tag}>
                        {completedTasks} de {tasksQuantity}
                    </span>
                </div>
            </div>

            {/* Listagem de todas as tarefas */}
            {tasks.map((task) => {
                if (task.id) {
                    return (
                        <div key={task.id} className={styles.containerTask}>
                            <button
                                onClick={() => toogleTaskCompleted(task.id)}
                                className={styles.complete}
                            >
                                {task.isCompleted ? (
                                    <Check
                                        className={styles.check}
                                        weight='bold'
                                    />
                                ) : (
                                    <div />
                                )}
                            </button>

                            <p
                                className={
                                    task.isCompleted
                                        ? styles.taskContentCompleted
                                        : styles.taskContent
                                }
                            >
                                {task.title}
                            </p>

                            <button
                                onClick={() => deleteTask(task)}
                                className={styles.delete}
                            >
                                <Trash size={20} />
                            </button>
                        </div>
                    );
                }
            })}

            {tasks.length <= 0 && (
                <div className={styles.emptyTasks}>
                    <Clipboard size={60} />
                    <p>Você ainda não tem tarefas cadastradas</p>
                    <p>Crie tarefas e organize seus itens a fazer</p>
                </div>
            )}
        </>
    );
}
