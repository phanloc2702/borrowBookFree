import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CartItem {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  category?: string;
  selected: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "selected">) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleSelection: (id: number) => void;
  getSelectedItems: () => CartItem[];
  isInCart: (id: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// 🔑 Tạo key theo user
const getCartStorageKey = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "cart_guest";
    const user = JSON.parse(raw);
    const id = user.id || user.email || "guest";
    return `cart_${id}`;
  } catch {
    return "cart_guest";
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storageKey, setStorageKey] = useState<string>(() =>
    getCartStorageKey()
  );

  // ⬇️ Load cart khi Provider mount
  useEffect(() => {
    const key = getCartStorageKey();
    setStorageKey(key);

    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        setCart(JSON.parse(raw));
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    }
  }, []);

  // ⬇️ Lưu cart mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey]);

  const addToCart = (item: Omit<CartItem, "selected">) => {
    setCart((prev) => {
      if (prev.some((b) => b.id === item.id)) return prev;
      return [...prev, { ...item, selected: true }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(storageKey);
  };

  const toggleSelection = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const getSelectedItems = () => cart.filter((item) => item.selected);

  const isInCart = (id: number) => cart.some((item) => item.id === id);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        toggleSelection,
        getSelectedItems,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};
