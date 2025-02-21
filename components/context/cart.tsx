"use client";

import { StoreCart } from "@medusajs/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { medusa } from "@/utils/medusa";
import { toast } from "@medusajs/ui";
import { Stripe, StripeElements } from "@stripe/stripe-js";

export type ExtendedStoreCart = StoreCart & {
  promotions: {
    id: string;
    code: string;
    is_automatic: boolean;
    application_method: { value: number; type: string; currency: string | null };
  }[];
};

type CartContextType = {
  cart: ExtendedStoreCart | undefined;
  setCart: Dispatch<SetStateAction<ExtendedStoreCart | undefined>>;
  refreshCart: () => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  addItem: ({ variantId, quantity }: { variantId: string; quantity: number }) => Promise<void>;
  updateItem: ({ itemId, quantity }: { itemId: string; quantity: number }) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  fields: string;
  isLoadingClientSecret: boolean;
  setIsLoadingClientSecret: Dispatch<SetStateAction<boolean>>;
  stripe: Stripe | null;
  elements: StripeElements | null;
  initializeStripe: (s: Stripe, e: StripeElements) => void;
  isLoadingShipping: boolean;
  setIsLoadingShipping: Dispatch<SetStateAction<boolean>>;
};

const fields =
  "*items.variant,*items.variant.options,*items.product.options,*items.product.variants,*shipping_methods";

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ExtendedStoreCart | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingClientSecret, setIsLoadingClientSecret] = useState(false);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  useEffect(() => {
    if (cart) return;

    // check if there is a cart id in local storage
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) {
      // create a new cart
      medusa.store.cart.create({}).then(({ cart }) => {
        localStorage.setItem("cart_id", cart.id);
        setCart(cart as ExtendedStoreCart);
      });
    } else {
      // get the cart
      medusa.store.cart.retrieve(cartId, { fields }).then(({ cart }) => {
        setCart(cart as ExtendedStoreCart);
      });
    }
  }, [cart]);

  const refreshCart = () => {
    localStorage.removeItem("cart_id");
    setCart(undefined);
  };

  const addItem = async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
    if (!cart) return;

    const getQuantity = () => {
      if (
        quantity === 0 ||
        !quantity ||
        isNaN(quantity) ||
        quantity.toString().includes(".") ||
        quantity.toString().includes("-")
      ) {
        return 1;
      }

      return Number(quantity);
    };

    try {
      const response = await medusa.store.cart.createLineItem(
        cart.id,
        { variant_id: variantId, quantity: getQuantity() },
        { fields },
      );

      setCart(response.cart as ExtendedStoreCart);
      setIsOpen(true);
    } catch (e) {
      console.error(e);
      toast.error("Failed to add item to cart");
    }
  };

  const updateItem = async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    if (!cart) return;

    const getQuantity = () => {
      if (
        quantity === 0 ||
        !quantity ||
        isNaN(quantity) ||
        quantity.toString().includes(".") ||
        quantity.toString().includes("-")
      ) {
        return 0;
      }

      return Number(quantity);
    };

    try {
      const response = await medusa.store.cart.updateLineItem(
        cart.id,
        itemId,
        {
          quantity: getQuantity(),
        },
        { fields },
      );

      setCart(response.cart as ExtendedStoreCart);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update item in cart");
    }
  };

  const removeItem = async (itemId: string) => {
    if (!cart) return;

    try {
      await medusa.store.cart.deleteLineItem(cart.id, itemId);
      // get updated cart
      const response = await medusa.store.cart.retrieve(cart.id, { fields });
      setCart(response.cart as ExtendedStoreCart);
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove item from cart");
    }
  };

  const initializeStripe = useCallback((s: Stripe, e: StripeElements) => {
    setStripe(s);
    setElements(e);
  }, []);

  console.log(cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        refreshCart,
        isOpen,
        setIsOpen,
        addItem,
        updateItem,
        removeItem,
        fields,
        isLoadingClientSecret,
        setIsLoadingClientSecret,
        stripe,
        elements,
        initializeStripe,
        isLoadingShipping,
        setIsLoadingShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
