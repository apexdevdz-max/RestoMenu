import { useState, useMemo } from 'react';
import { useTables } from '../hooks/useTables';
import TableCard from '../components/tables/TableCard';
import TableFilters from '../components/tables/TableFilters';
import TableStats from '../components/tables/TableStats';
import AddTableModal from '../components/tables/AddTableModal';
import EditTableModal from '../components/tables/EditTableModal';
import TableDrawer from '../components/tables/TableDrawer';

export default function TablesPage() {
  const { tables, loading, addTable, updateTable, deleteTable, releaseTable } = useTables();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals/drawer state
  const [showAdd, setShowAdd] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [drawerTable, setDrawerTable] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredTables = useMemo(() => {
    return tables.filter(t => {
      if (search && !t.table_number.toString().includes(search)) return false;
      if (statusFilter === 'free' && t.status !== 'free') return false;
      if (statusFilter === 'occupied' && t.status !== 'occupied') return false;
      return true;
    });
  }, [tables, search, statusFilter]);

  async function handleDelete(table) {
    if (table.status === 'occupied') {
      alert('Impossible de supprimer une table occupée. Libérez-la d\'abord.');
      return;
    }
    setDeleteConfirm(table);
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    try {
      await deleteTable(deleteConfirm.id);
    } catch (err) {
      console.error('Delete error:', err);
    }
    setDeleteConfirm(null);
  }

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
        <div className="flex items-center gap-3">
          <TableFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
          <button
            onClick={() => setShowAdd(true)}
            className="bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm px-4 py-2 rounded-lg shadow-btn transition-all active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle Table
          </button>
        </div>
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
              <TableCard
                key={table.id}
                table={table}
                onViewOrder={(t) => setDrawerTable(t)}
                onEdit={(t) => setEditTable(t)}
                onDelete={(t) => handleDelete(t)}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <TableStats tables={tables} />
      </div>

      {/* Add Table Modal */}
      <AddTableModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={addTable}
        existingNumbers={tables.map(t => t.table_number)}
      />

      {/* Edit Table Modal */}
      <EditTableModal
        open={!!editTable}
        table={editTable}
        onClose={() => setEditTable(null)}
        onSave={updateTable}
      />

      {/* Table Detail Drawer */}
      <TableDrawer
        table={drawerTable}
        open={!!drawerTable}
        onClose={() => setDrawerTable(null)}
        onRelease={releaseTable}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-[sheetUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            <h2 className="font-display font-bold text-lg text-brand-dark mb-2">Supprimer la table ?</h2>
            <p className="text-sm text-brand-gray mb-5">
              Êtes-vous sûr de vouloir supprimer la <strong>Table {deleteConfirm.table_number}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-semibold text-brand-gray rounded-xl hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all active:scale-[0.98]"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
