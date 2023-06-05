import React from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route, Routes, useLocation } from 'react-router-dom';
import TasksPage from "./Pages/TasksPage/TasksPage";
import HomePage from "./Pages/HomePage/HomePage";
import TaskPage from "./Pages/TasksPage/Components/TaskPage";
function App() {
    return (
        <Router>
            <div className="app">
                <nav className="navbar">
                    <ul className="navbar-nav">
                        <NavbarLink to="/" label="Home" />
                        <NavbarLink to="/tasks" label="Tasks" />
                    </ul>
                </nav>
                <div className="content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/tasks/:taskId" element={<TaskPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

interface NavbarLinkProps {
    to: string;
    label: string;
}

function NavbarLink({ to, label } : NavbarLinkProps) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <li className={`nav-item ${isActive ? 'active' : ''}`}>
            <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
                {label}
            </Link>
        </li>
    );
}

export default App;
