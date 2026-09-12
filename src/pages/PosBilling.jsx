import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PosItemTile from '../components/PosItemTile';
import CartItemRow from '../components/CartItemRow';
import { useCart } from '../context/CartContext';
import { POS_CATEGORIES, POS_ITEMS } from '../data/posItems';
import { formatRs } from '../utils/format';

export default function PosBilling() {
  const navigate = useNavigate();
  const { customer, items, checkout, totals, addItem, changeQty, updateCheckout, applyPromo } =
    useCart();

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [promoInput, setPromoInput] = useState('');

  const filteredItems = useMemo(() => {
    return POS_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  function handleApplyPromo() {
    applyPromo(promoInput);
  }

  function handleProceedToPayment() {
    navigate('/billing/payment');
  }

  return (
    <>
      <PageHeader eyebrow="POS Billing" title="New Sale — Colombo Branch">
        <span className="branch-select">🧾 New Order</span>
      </PageHeader>

      <div className="pos-layout">
        <div className="pos-left">
          <div className="scan-bar">
            <input
              className="scan-input"
              placeholder="🔍  Scan barcode or search service / product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="scan-btn">📷 Scan</button>
          </div>

          <div className="pos-tabs">
            {POS_CATEGORIES.map((cat) => (
              <div
                key={cat}
                className={cat === activeCategory ? 'pos-tab active' : 'pos-tab'}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>

          <div className="pos-grid">
            {filteredItems.map((item) => (
              <PosItemTile key={item.id} item={item} onAdd={addItem} />
            ))}
          </div>
        </div>

        <div className="cart-panel">
          <div className="cart-head">
            <span className="title">Current Order</span>
            <span className="panel-meta">{items.length} items</span>
          </div>

          {customer && (
            <div className="customer-chip">
              <span className="avatar-sm">{customer.initials}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>
                  {customer.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                  {customer.points.toLocaleString('en-LK')} pts · {customer.membership}
                </div>
              </div>
            </div>
          )}

          <div className="cart-items">
            {items.length === 0 ? (
              <div className="cart-empty">Tap a service or product to add it to the order.</div>
            ) : (
              items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onIncrement={(id) => changeQty(id, 1)}
                  onDecrement={(id) => changeQty(id, -1)}
                />
              ))
            )}
          </div>

          <div className="promo-row">
            <input
              placeholder="Promo code or gift card"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
            />
            <button onClick={handleApplyPromo}>
              {checkout.promoApplied ? 'Applied ✓' : 'Apply'}
            </button>
          </div>

          {customer && (
            <div
              className="loyalty-row"
              onClick={() => updateCheckout({ loyaltyRedeemed: !checkout.loyaltyRedeemed })}
            >
              <span>
                Redeem {customer.points.toLocaleString('en-LK')} loyalty points (−
                {formatRs(Math.min(customer.points, totals.subtotal))})
              </span>
              <span className={checkout.loyaltyRedeemed ? 'switch on' : 'switch'} />
            </div>
          )}

          <div className="cart-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatRs(totals.subtotal)}</span>
            </div>
            {customer && (
              <div className="total-row">
                <span>Discount ({customer.membership} {customer.discountPercent * 100}%)</span>
                <span>− {formatRs(totals.discountAmount)}</span>
              </div>
            )}
            <div className="total-row">
              <span>Tax (VAT 8%)</span>
              <span>{formatRs(totals.tax)}</span>
            </div>
            {checkout.loyaltyRedeemed && (
              <div className="total-row">
                <span>Loyalty Redeemed</span>
                <span>− {formatRs(totals.loyaltyDiscount)}</span>
              </div>
            )}
            <div className="total-row grand">
              <span>Total Due</span>
              <span>{formatRs(totals.preTipTotal)}</span>
            </div>
          </div>

          <button
            className="checkout-btn"
            disabled={items.length === 0}
            onClick={handleProceedToPayment}
          >
            Proceed to Payment →
          </button>
        </div>
      </div>
    </>
  );
}