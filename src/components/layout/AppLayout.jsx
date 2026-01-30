import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "16px" }}>
        <Outlet />
      </main>
    </>
  );
}
