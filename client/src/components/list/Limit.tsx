import useLimit from "../../hooks/useLimit";

export default function Limit() {
  const { limit, setLimit } = useLimit();

  return (
    <div className="limit-selector">
      <label htmlFor="limit-options">Cards per page:</label>
      <select
        name="limit-options"
        id="limit-options"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
      >
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>
  );
}
