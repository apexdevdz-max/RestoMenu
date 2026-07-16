import { useState, useMemo } from 'react';
import { useTables } from '../hooks/useTables';
import TableCard from '../components/tables/TableCard';
import TableFilters from '../components/tables/TableFilters';
import TableStats from '../components/tables/TableStats';

export default function TablesPage() {
  const { tables, loading } = useTables();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTables = useMemo(() => {
    return tables.filter(t => {
      if (search && !t.table_number.toString().includes(search)) return false;
      if (statusFilter === 'free' && t.status !== 'free') return false;
      if (statusFilter === 'occupied' && t.status !== 'occupied') return false;
      return true;
    });
  }, [tables, search, statusFilter]);

  if (loading) {
    return (
      <div>
        <div className="skeleton h-12 w-64 rounded-xl mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <div key={i} className="skeleton h-48 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 6v2a2 2 0 002 2h12a2 2 0 002-2V6M6 10v8m12-8v8M8 18h8" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-brand-dark">Tables</h1>
            <p className="text-sm text-brand-gray">Gérez les tables de votre restaurant</p>
          </div>
        </div>
        <TableFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl shadow-card p-4">
        {filteredTables.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-brand-gray">Aucune table trouvée.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredTables.map(table => (
              <TableCard key={table.id} table={table} />
            ))}
          </div>
        )}

        {/* Stats */}
        <TableStats tables={tables} />
      </div>
    </div>
  );
}
