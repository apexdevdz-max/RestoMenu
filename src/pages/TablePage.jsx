import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import CategoryNav from '../components/CategoryNav';
import ProductGrid from '../components/ProductGrid';
import ProductDetailModal from '../components/ProductDetailModal';

export default function TablePage() {
  const { tableId } = useParams();
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);

  // Default to first category (burgers) on initial load
  const effectiveCategoryId = activeCategoryId === null
    ? null // "TOUT" shows all
    : activeCategoryId;

  return (
    <Layout tableId={tableId}>
      {/* Category Navigation */}
      <CategoryNav
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
      />

      {/* Product Grid */}
      <main className="max-w-2xl mx-auto px-3 pt-4 pb-28">
        <ProductGrid
          categoryId={effectiveCategoryId}
          onOpenDetail={setDetailProduct}
        />
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        open={!!detailProduct}
        onClose={() => setDetailProduct(null)}
      />
    </Layout>
  );
}
