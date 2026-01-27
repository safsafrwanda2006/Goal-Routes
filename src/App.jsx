import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Taskspage from './pages/Taskspage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/taskspage' element={<Taskspage />} />
    </Routes>
  );
}

export default App;
