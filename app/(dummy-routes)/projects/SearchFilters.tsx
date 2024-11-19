type SearchFiltersProps = {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function SearchFilters({ searchTerm, statusFilter, onSearchChange, onStatusChange }: SearchFiltersProps) {
  return (
    <div className="flex gap-4 mb-4">
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search projects..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  )
}
