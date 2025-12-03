import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ onSearch, className = "", placeholder = "Search products..." }) => {
  const [query, setQuery] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const searchQuery = searchParams.get("q") || "";
    setQuery(searchQuery);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="flex">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          icon="Search"
          iconPosition="left"
          className="rounded-r-none border-r-0 focus:z-10"
        />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 z-10"
          >
            <span className="sr-only">Clear search</span>
            ×
          </Button>
        )}
        
        <Button
          type="submit"
          variant="primary"
          className="rounded-l-none px-6"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;