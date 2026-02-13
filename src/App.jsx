import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Taskspage from './pages/Taskspage';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/taskspage' element={<Taskspage />} />
      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<Register />}/>
    </Routes>
  );
}

export default App;
