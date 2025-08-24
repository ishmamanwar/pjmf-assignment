import { Routes, Route } from "react-router-dom";
import { Header } from "./components";
import { Home, Data, Trends, HeatMap } from "./pages";
import "./styles/globals.css";
import "./styles/pjmf.tokens.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data" element={<Data />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/heatmap" element={<HeatMap />} />
      </Routes>
    </>
  );
}

export default App;
