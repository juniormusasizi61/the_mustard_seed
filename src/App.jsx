import {Routes, Route} from 'react-router-dom';
import Chat from './pages/Chat';
import ReadBible from './pages/ReadBible';
import Saved from './pages/Saved';
import Profile from './pages/Profile';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="/read-bible" element={<ReadBible />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;