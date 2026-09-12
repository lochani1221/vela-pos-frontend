import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PayMethodTile from '../components/PayMethodTile';
import Keypad from '../components/Keypad';
import { useCart } from '../context/CartContext';
import { formatRs } from '../utils/format';

const PAY_METHODS = [
  { key: 'Cash', icon: '💵', label: 'Cash' },
  { key: 'Card', icon: '💳', label: 'Card' },
  { key: 'QR', icon: '📱', label: 'LankaQR / PayHere' },
  { key: 'Gift Card', icon: '🎁', label: 'Gift Card' },
  { key: 'Split', icon: '➗', label: 'Split Payment' },
  { key: 'Loyalty', icon: '⭐', label: 'Loyalty Points' },
];

const TIP_OPTIONS = [0, 5, 10, 15, 'custom'];

export default function PosPayment() {
  const navigate = useNavigate();
  const { items, customer, checkout, totals, updateCheckout, appendCashDigit, completeOrder } =
    useCart();

  // Guard: if someone lands here with an empty cart (e.g. page refresh), send them back
  if (items.length === 0) {
    navigate('/billing');
    return null;
  }

  const isSplit = checkout.paymentMethod === 'Split';
  const splitTotal = Number(checkout.splitCash || 0) + Number(checkout.splitCard || 0);
  const splitCovers = splitTotal >= totals.grandTotal - 0.5;

  const cashEntered = Number(checkout.cashTendered || 0);
  const cashCovers = checkout.paymentMethod !== 'Cash' || cashEntered >= totals.grandTotal - 0.5;

  const canComplete = isSplit ? splitCovers : cashCovers;

  function handleComplete() {
    if (!canComplete) return;
    completeOrder();
    navigate('/billing/receipt');
  }

  return (
    <>
      <PageHeader eyebrow="POS Billing  /  New Order" title="Payment">
        <button className="btn btn-ghost" onClick={() => navigate('/billing')}>
          ← Back to Order
        </button>
      </PageHeader>

      <div className="pay-grid">
        <div>
          <div className="section-label" style={{ marginTop: 0 }}>
            Choose payment method
          </div>
          <div className="pay-methods">
            {PAY_METHODS.map((method) => (
              <PayMethodTile
                key={method.key}
                icon={method.icon}
                label={method.label}
                selected={checkout.paymentMethod === method.key}
                onClick={() => updateCheckout({ paymentMethod: method.key })}
              />
            ))}
          </div>

          <div className="section-label">Add a tip</div>
          <div className="tip-row">
            {TIP_OPTIONS.map((tip) => (
              <div
                key={tip}
                className={checkout.tipPercent === tip ? 'tip-chip selected' : 'tip-chip'}
                onClick={() => updateCheckout({ tipPercent: tip })}
              >
                {tip === 0 ? 'No Tip' : tip === 'custom' ? 'Custom' : `${tip}%`}
              </div>
            ))}
          </div>
          {checkout.tipPercent === 'custom' && (
            <div className="field" style={{ marginTop: 12, maxWidth: 200 }}>
              <label>Custom tip (Rs.)</label>
              <input
                type="number"
                value={checkout.tipCustomAmount}
                onChange={(e) => updateCheckout({ tipCustomAmount: Number(e.target.value) })}
              />
            </div>
          )}

          {checkout.paymentMethod === 'Cash' && (
            <>
              <div className="section-label">Cash tendered</div>
              <div className="field" style={{ maxWidth: 200, marginBottom: -4 }}>
                <input readOnly value={checkout.cashTendered || '0'} style={{ fontSize: 18, fontWeight: 700 }} />
              </div>
              <Keypad
                onKeyPress={appendCashDigit}
                confirmLabel={`Confirm ${formatRs(totals.grandTotal)}`}
                onConfirm={() => updateCheckout({ cashTendered: String(totals.grandTotal) })}
              />
            </>
          )}

          {isSplit && (
            <>
              <div className="section-label">Split amounts</div>
              <div className="split-inputs" style={{ padding: 0 }}>
                <div className="field">
                  <label>Cash (Rs.)</label>
                  <input
                    type="number"
                    value={checkout.splitCash}
                    onChange={(e) => updateCheckout({ splitCash: Number(e.target.value) })}
                  />
                </div>
                <div className="field">
                  <label>Card (Rs.)</label>
                  <input
                    type="number"
                    value={checkout.splitCard}
                    onChange={(e) => updateCheckout({ splitCard: Number(e.target.value) })}
                  />
                </div>
              </div>
              {!splitCovers && (
                <p style={{ color: 'var(--warn)', fontSize: 12, marginTop: -6 }}>
                  Split amounts don't cover the total yet.
                </p>
              )}
            </>
          )}
        </div>

        <div className="cart-panel" style={{ height: 'fit-content' }}>
          <div className="cart-head">
            <span className="title">Order Summary</span>
          </div>
          <div className="cart-totals" style={{ borderTop: 'none' }}>
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatRs(totals.subtotal)}</span>
            </div>
            {customer && (
              <div className="total-row">
                <span>Discount</span>
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
            <div className="total-row">
              <span>
                Tip {checkout.tipPercent !== 0 && checkout.tipPercent !== 'custom'
                  ? `(${checkout.tipPercent}%)`
                  : ''}
              </span>
              <span>{formatRs(totals.tipAmount)}</span>
            </div>
            <div className="total-row grand">
              <span>Total Due</span>
              <span>{formatRs(totals.grandTotal)}</span>
            </div>
          </div>

          {isSplit && (
            <div style={{ padding: '0 20px 6px' }}>
              <div className="split-row">
                <span style={{ fontWeight: 700, fontSize: 13 }}>Cash</span>
                <span style={{ fontWeight: 700 }}>{formatRs(Number(checkout.splitCash) || 0)}</span>
              </div>
              <div className="split-row">
                <span style={{ fontWeight: 700, fontSize: 13 }}>Card</span>
                <span style={{ fontWeight: 700 }}>{formatRs(Number(checkout.splitCard) || 0)}</span>
              </div>
            </div>
          )}

          <button className="checkout-btn" disabled={!canComplete} onClick={handleComplete}>
            Complete Payment ✓
          </button>
        </div>
      </div>
    </>
  );
}