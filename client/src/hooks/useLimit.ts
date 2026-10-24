import { useSearchParams } from "react-router";

export default function useLimit() {
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = searchParams.get("limit") || 10;

  function setLimit(limit: string) {
    setSearchParams({
      page: "1",
      limit: String(limit),
    });
  }

  return { limit, setLimit };
}
