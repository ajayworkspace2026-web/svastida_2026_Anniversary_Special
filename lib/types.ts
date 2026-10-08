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


export type ProductDetail = ProductListItem & {
  custom_measurements_enabled: boolean;
  tags: string[];
  stock_label: string | null;
  images: Array<{
    id: string;
    storage_path: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
    publicUrl: string | null;
  }>;
  size_charts: Array<{
    size_label: string;
    bust_min_cm: number | null;
    bust_max_cm: number | null;
    waist_min_cm: number | null;
    waist_max_cm: number | null;
    hips_min_cm: number | null;
    hips_max_cm: number | null;
  }>;
};
