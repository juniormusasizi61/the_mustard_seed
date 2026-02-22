import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./components/layout/AppLayout";

import Chat from "./pages/Chat";
import ReadBible from "./pages/ReadBible";
import Saved from "./pages/Saved";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TermsAndPolicies from "./pages/TermsAndPolicies";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Chat />} />
          <Route path="chat" element={<Chat />} />
          <Route path="read-bible" element={<ReadBible />} />
          <Route path="saved" element={<Saved />} />
          <Route path="profile" element={<Profile />} />
            <Route path="terms-policies" element={<TermsAndPolicies />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
