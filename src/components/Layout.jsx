import { useState } from 'react';
import Header from './Header';
import MobileMenu from './MobileMenu';
import CartBar from './CartBar';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import OrderConfirmation from './OrderConfirmation';

export default function Layout({ tableId, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Header */}
      <Header
        tableId={tableId}
        onMenuOpen={() => setMenuOpen(true)}
      />

      {/* Page Content */}
      {children}

      {/* Sticky Cart Bar */}
      <CartBar
        onCartClick={() => setCartDrawerOpen(true)}
        onCheckout={() => setCheckoutOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onCheckout={() => {
          setCartDrawerOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        tableId={tableId}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => {
          setCheckoutOpen(false);
          setOrderSuccess(true);
        }}
      />

      {/* Order Confirmation */}
      <OrderConfirmation
        open={orderSuccess}
        onClose={() => setOrderSuccess(false)}
      />
    </div>
  );
}
