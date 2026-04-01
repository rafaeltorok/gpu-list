import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SearchBar from "../ui/SearchBar";
import GpuCard from "../ui/GpuCard";
import AddGpuForm from "../AddGpuForm";

import "../../styles/Home.css";

function Home({ gpus, onSearch, searchTerm, addGpu, scrollToGpu }) {
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  useEffect(() => {
    if (scrollToGpu) {
      document
        .getElementById(scrollToGpu)
        .scrollIntoView({ behavior: "instant" });
    }
  }, [scrollToGpu]);

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="home-actions">
          <SearchBar onSearch={onSearch} searchTerm={searchTerm} />
          <button className="add-gpu-toggle" onClick={toggleAddForm}>
            {showAddForm ? "Cancel" : "Add GPU"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="add-form-container">
          <AddGpuForm createGpu={addGpu} onCancel={toggleAddForm} />
        </div>
      )}

      {gpus.length === 0 && searchTerm !== "" ? (
        <div className="no-results">
          <p>No GPUs found matching: {searchTerm}</p>
        </div>
      ) : (
        <div className="gpu-grid">
          {gpus.map((gpu) => (
            <GpuCard key={gpu.id} gpu={gpu} />
          ))}
        </div>
      )}
    </div>
  );
}

Home.propTypes = {
  gpus: PropTypes.array.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  addGpu: PropTypes.func.isRequired,
  scrollToGpu: PropTypes.string,
};

export default Home;
