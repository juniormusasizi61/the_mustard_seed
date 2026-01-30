import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";

import Chat from "./pages/Chat";
import ReadBible from "./pages/ReadBible";
import Saved from "./pages/Saved";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Chat />} />
        <Route path="read-bible" element={<ReadBible />} />
        <Route path="saved" element={<Saved />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
