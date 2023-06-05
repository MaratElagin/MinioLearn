import React from 'react';
import { Link } from 'react-router-dom';
import "./styles.css"

const TasksPage: React.FC = () => {
    const tasks = [
        { id: 1, title: 'Ковбой Джон и шериф' },
        { id: 2, title: 'Царь Салтан и 2 башни' },
        { id: 3, title: 'Прикольные числа и рыбка Дори' },
    ];

    return (
        <div>
            <h2>Tasks Page</h2>
            <table className="tasks-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>
                            <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
export default TasksPage;


