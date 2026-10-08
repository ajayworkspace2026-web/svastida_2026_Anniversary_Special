export type ProductStatus = "draft" | "active" | "archived";

export type OrderStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  category_id: string | null;
  status: ProductStatus;
  featured: boolean;
  new_arrival: boolean;
  bestseller: boolean;
  custom_fit: boolean;
  sizes: string[];
  created_at: string;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  size: string | null;
  measurements?: Record<string, string>;
  imageUrl: string | null;
  aiDesignUrl?: string | null;
};
