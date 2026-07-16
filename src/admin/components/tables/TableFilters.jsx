export default function TableFilters({ search, onSearchChange, statusFilter, onStatusChange }) {
  return (
    <div className="flex items-center gap-3">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Rechercher une table..."
          className="pl-9 pr-4 py-2 w-52 rounded-lg border border-gray-200 text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
        />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <select
          value={statusFilter}
          onChange={e => onStatusChange(e.target.value)}
          className="pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-brand-dark bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
        >
          <option value="all">Tous les statuts</option>
          <option value="free">Libres</option>
          <option value="occupied">Occupées</option>
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
