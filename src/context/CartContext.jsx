import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

const TAX_RATE = 0.08; // VAT 8%, matches your billing wireframe


const DEFAULT_CUSTOMER = {
  name: 'Dilrukshi Perera',
  initials: 'DP',
  points: 1420,
  membership: 'Platinum',
  discountPercent: 0.10,
};

function emptyCheckoutState() {
  return {
    loyaltyRedeemed: false,
    promoCode: '',
    promoApplied: false,
    tipPercent: 0, // 0 | 5 | 10 | 15 | 'custom'
    tipCustomAmount: 0,
    paymentMethod: 'Cash',
    cashTendered: '',
    splitCash: 0,
    splitCard: 0,
  };
}

export function CartProvider({ children }) {
  const [customer] = useState(DEFAULT_CUSTOMER);
  const [items, setItems] = useState([]);
  const [checkout, setCheckout] = useState(emptyCheckoutState());
  const [lastOrder, setLastOrder] = useState(null);

  function addItem(posItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === posItem.id);
      if (existing) {
        return prev.map((i) => (i.id === posItem.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...posItem, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateCheckout(patch) {
    setCheckout((prev) => ({ ...prev, ...patch }));
  }

  function applyPromo(code) {
    
    updateCheckout({ promoCode: code, promoApplied: Boolean(code) });
  }

  function appendCashDigit(digit) {
    setCheckout((prev) => {
      if (digit === '⌫') return { ...prev, cashTendered: prev.cashTendered.slice(0, -1) };
      if (digit === '·' && prev.cashTendered.includes('.')) return prev;
      return { ...prev, cashTendered: prev.cashTendered + digit.replace('·', '.') };
    });
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discountAmount = customer ? subtotal * customer.discountPercent : 0;
    const tax = (subtotal - discountAmount) * TAX_RATE;
    const loyaltyDiscount =
      checkout.loyaltyRedeemed && customer ? Math.min(customer.points, subtotal) : 0;
    const preTipTotal = subtotal - discountAmount + tax - loyaltyDiscount;
    const tipAmount =
      checkout.tipPercent === 'custom'
        ? Number(checkout.tipCustomAmount) || 0
        : preTipTotal * (checkout.tipPercent / 100);
    const grandTotal = preTipTotal + tipAmount;

    return { subtotal, discountAmount, tax, loyaltyDiscount, preTipTotal, tipAmount, grandTotal };
  }, [items, customer, checkout.loyaltyRedeemed, checkout.tipPercent, checkout.tipCustomAmount]);

  function completeOrder() {
    const pointsEarned = Math.round(totals.grandTotal * 0.01); // simple 1% earn rate, placeholder

    const order = {
      invoiceNumber: `INV-${Math.floor(3000 + Math.random() * 999)}`,
      date: new Date(),
      customer,
      items: [...items],
      ...totals,
      paymentMethod: checkout.paymentMethod,
      cashTendered: checkout.cashTendered,
      splitCash: checkout.splitCash,
      splitCard: checkout.splitCard,
      pointsEarned,
    };

    setLastOrder(order);
    setItems([]);
    setCheckout(emptyCheckoutState());
    return order;
  }

  function startNewSale() {
    setItems([]);
    setCheckout(emptyCheckoutState());
  }

  const value = {
    customer,
    items,
    checkout,
    totals,
    lastOrder,
    addItem,
    changeQty,
    removeItem,
    updateCheckout,
    applyPromo,
    appendCashDigit,
    completeOrder,
    startNewSale,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}