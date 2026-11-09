import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSearchParams } from "react-router";
import useLimit from "./hooks/useLimit";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/pages/Home";
import GpuDetail from "./components/pages/GpuDetail";

import gpuService from "./services/gpus";

import "./styles/App.css";
import type { GpuInputType, GpuType } from "../../shared/types/types";

export default function App() {
  const [gpus, setGpus] = useState<GpuType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [scrollToGpu, setScrollToGpu] = useState<string | null>(null);

  // Hooks
  const [_searchParams, setSearchParams] = useSearchParams();
  const { limit } = useLimit();

  // Fetch all available cards from the database
  useEffect(() => {
    async function getData() {
      try {
        const data: GpuType[] = await gpuService.getAll();
        setGpus(data);
      } catch (err) {
        console.error("Failed to fetch GPU data:", err);
      }
    }
    void getData();
  }, []);

  // Handles the add form data
  async function addGpu(gpuObject: GpuInputType): Promise<void> {
    if (
      gpuObject.manufacturer === "" ||
      gpuObject.gpuline === "" ||
      gpuObject.model === "" ||
      gpuObject.cores < 1 ||
      gpuObject.tmus < 1 ||
      gpuObject.rops < 1 ||
      gpuObject.vram < 0.016 ||
      gpuObject.bus < 1 ||
      gpuObject.memtype === "" ||
      gpuObject.baseclock < 1 ||
      gpuObject.boostclock < 1 ||
      gpuObject.memclock < 1
    ) {
      alert("Invalid GPU data");
      return;
    }

    try {
      const returnedObject = await gpuService.create(gpuObject);
      setGpus((prevGpus: GpuType[]) => [...prevGpus, returnedObject]);
      alert(
        `${returnedObject.manufacturer} ${returnedObject.gpuline} ${returnedObject.model} was added!`,
      );
    } catch (err) {
      console.error("Failed to add new Graphics Card:", err);
    }
  }

  async function deleteGpu(gpu: GpuType | undefined): Promise<boolean> {
    if (gpu) {
      const confirmDeletion = window.confirm(
        `Remove ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model} from the list?`,
      );

      if (confirmDeletion) {
        try {
          await gpuService.remove(gpu.id);
          setGpus(gpus.filter((g: GpuType) => g.id !== gpu.id));
          return true;
        } catch (err) {
          console.error("Failed do remove GPU from the list:", err);
          return false;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  function handleSearch(term: string): void {
    setSearchTerm(term);
    setSearchParams({ page: "1", limit: String(limit) });
  }

  function handleReturn(id: string): void {
    setScrollToGpu(id);
  }

  const filteredGpus = gpus.filter((gpu: GpuType) => {
    const fullName =
      `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
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
  );
}
