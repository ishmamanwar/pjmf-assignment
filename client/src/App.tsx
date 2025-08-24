import { Routes, Route } from "react-router-dom";
import { Header } from "./components";
import { About, Home } from "./pages";
import "./styles/globals.css";
import "./styles/pjmf.tokens.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
