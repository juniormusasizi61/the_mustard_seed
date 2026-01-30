// import Navbar from "./Navbar";
// import { Outlet } from "react-router-dom";

// export default function AppLayout() {
//   return (
//     <>
//       <Navbar />
//       <main style={{ padding: "16px" }}>
//         <Outlet />
//       </main>
//     </>
//   );
// }
 

// improved layout with better spacing and background
import { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "../chat/chat.css";

export default function AppLayout() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "organic";
    document.body.classList.remove("organic", "brutalist");
    document.body.classList.add(theme);
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ padding: "0 16px 40px" }}>
        <Outlet />
      </main>
    </>
  );
}