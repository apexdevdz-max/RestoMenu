import { useState, useCallback } from 'react';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { useMenuItems } from '../hooks/useMenuItems';
import CategoryList from '../components/menu/CategoryList';
import MenuItemRow from '../components/menu/MenuItemRow';
import MenuItemForm from '../components/menu/MenuItemForm';
import DeleteConfirm from '../components/menu/DeleteConfirm';

export default function MenuPage() {
  const { categories, loading: catsLoading, createCategory, updateCategory, deleteCategory } = useAdminCategories();
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // Auto-select first category when loaded
  const effectiveCategoryId = activeCategoryId || categories[0]?.id || null;

  const { items, loading: itemsLoading, createItem, updateItem, deleteItem, toggleAvailability } = useMenuItems(effectiveCategoryId);

  // Form modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setFormOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingItem(null);
    setFormOpen(true);
  }, []);

  const handleSave = useCallback(async (data) => {
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await createItem(data);
    }
  }, [editingItem, updateItem, createItem]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteItem(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, deleteItem]);

  const activeCategoryName = categories.find(c => c.id === effectiveCategoryId)?.name || 'Menu';

  return (
    <div className="flex gap-5 min-h-[calc(100vh-120px)]">
      {/* Left: Categories */}
      <CategoryList
        categories={categories}
        loading={catsLoading}
        activeCategoryId={effectiveCategoryId}
        onSelect={setActiveCategoryId}
        onCreate={createCategory}
        onRename={updateCategory}
        onDelete={deleteCategory}
      />

      {/* Right: Menu Items */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-brand-dark">{activeCategoryName}</h2>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-btn transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
            Ajouter un plat
          </button>
        </div>

        {/* Items */}
        {itemsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-sm text-brand-gray font-medium">Aucun plat dans cette catégorie.</p>
            <button onClick={handleAdd} className="mt-3 text-sm text-brand-red font-semibold hover:underline">
              + Ajouter un plat
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <MenuItemRow
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onToggleAvailability={toggleAvailability}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <MenuItemForm
        open={formOpen}
        item={editingItem}
        categories={categories}
        categoryId={effectiveCategoryId}
        onClose={() => { setFormOpen(false); setEditingItem(null); }}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <DeleteConfirm
        open={!!deleteTarget}
        itemName={deleteTarget?.name || ''}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
