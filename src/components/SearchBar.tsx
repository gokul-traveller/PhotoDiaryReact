interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="max-w-sm mx-auto pb-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search..."
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          🔍
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
