import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import RequireAuth from "./components/common/RequireAuth";

import Chat from "./pages/Chat";
import ReadBible from "./pages/ReadBible";
import Saved from "./pages/Saved";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route element={<RequireAuth />}>
        <Route index element={<Chat />} />
        <Route path="read-bible" element={<ReadBible />} />
        <Route path="saved" element={<Saved />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
