export type ProductStatus = "draft" | "active" | "archived";
export type OrderStatus =
  | "new" | "contacted" | "confirmed" | "preparing"
  | "ready" | "delivered" | "cancelled";

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  featured: boolean;
  new_arrival: boolean;
  bestseller: boolean;
  custom_fit: boolean;
  sizes: string[];
  status: ProductStatus;
  image_url: string | null;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  size: string | null;
  measurements: Record<string, string>;
  imageUrl: string | null;
  aiDesignUrl: string | null;
};
