import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Create from "./pages/Create.jsx";
import Editor from "./pages/Editor.jsx";
import Public from "./pages/Public.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/create" element={<Create />} />
      <Route path="/editor/:id" element={<Editor />} />
      <Route path="/p/:slug" element={<Public />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
