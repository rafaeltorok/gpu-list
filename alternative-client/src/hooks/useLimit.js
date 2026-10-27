import { useSearchParams } from "react-router";

export default function useLimit() {
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = Number(searchParams.get("limit")) || 9;

  function setLimit(limit) {
    setSearchParams({
      page: "1",
      limit: String(limit),
    });
  }

  return { limit, setLimit };
}
