import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/pages/Home";
import GpuDetail from "./components/pages/GpuDetail";

import gpuService from "./services/gpus";

import "./styles/App.css";

function App() {
  const [gpus, setGpus] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollToGpu, setScrollToGpu] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const data = await gpuService.getAll();
        setGpus(data);
      } catch (err) {
        console.error("Failed to fetch GPU data:", err);
      }
    }
    getData();
  }, []);

  async function addGpu(gpuObject) {
    if (
      gpuObject.manufacturer === "" ||
      gpuObject.gpuline === "" ||
      gpuObject.model === "" ||
      gpuObject.cores < 1 ||
      gpuObject.tmus < 1 ||
      gpuObject.rops < 1 ||
      gpuObject.vram < 0.016 ||
      gpuObject.bus < 1 ||
      gpuObject.memType === "" ||
      gpuObject.baseclock < 1 ||
      gpuObject.boostclock < 1 ||
      gpuObject.memclock < 1
    ) {
      alert("Invalid GPU data");
      return;
    }

    try {
      const returnedObject = await gpuService.create(gpuObject);
      setGpus((prevGpus) => [...prevGpus, returnedObject]);
      alert(
        `${returnedObject.manufacturer} ${returnedObject.gpuline} ${returnedObject.model} was added!`,
      );
    } catch (err) {
      console.error("Failed to add new Graphics Card:", err);
    }
  }

  async function deleteGpu(id, manufacturer, gpuline, model) {
    const confirmDeletion = window.confirm(
      `Remove ${manufacturer} ${gpuline} ${model} from the list?`,
    );

    if (confirmDeletion) {
      try {
        await gpuService.remove(id);
        setGpus(gpus.filter((gpu) => gpu.id !== id));
        return true;
      } catch (err) {
        console.error("Failed do remove GPU from the list:", err);
      }
    }
    return false;
  }

  function handleSearch(term) {
    setSearchTerm(term);
  }

  function handleReturn(id) {
    setScrollToGpu(id);
  }

  const filteredGpus = gpus.filter((gpu) => {
    const fullName =
      `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <Router basename="/alt">
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  gpus={filteredGpus}
                  onSearch={handleSearch}
                  searchTerm={searchTerm}
                  addGpu={addGpu}
                  scrollToGpu={scrollToGpu}
                />
              }
            />
            <Route
              path="/gpu/:id"
              element={
                <GpuDetail
                  gpus={gpus}
                  onDelete={deleteGpu}
                  handleReturn={handleReturn}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
