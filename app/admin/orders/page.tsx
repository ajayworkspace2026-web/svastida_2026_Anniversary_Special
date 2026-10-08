import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import type { OrderStatus } from "@/lib/types";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id,order_number,customer_name,phone,whatsapp_phone,city,state,total,status,created_at,order_items(product_name,quantity,size_label,unit_price)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Operations</p>
      <h1 className="mt-3 text-6xl leading-[0.85]">Orders.</h1>
      <div className="mt-10 space-y-4">
        {!orders?.length ? (
          <div className="rounded-2xl bg-white p-8 text-sm text-black/40">No orders yet.</div>
        ) : null}

        {orders?.map((order) => (
          <article key={order.id} className="rounded-2xl bg-white p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold)]">{order.order_number}</p>
                <h2 className="mt-2 text-3xl">{order.customer_name}</h2>
                <p className="mt-1 text-sm text-black/50">{order.phone} · {order.whatsapp_phone}</p>
                <p className="mt-1 text-xs text-black/40">{order.city}, {order.state}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">{formatCurrency(Number(order.total))}</span>
                <OrderStatusSelect id={order.id} value={order.status as OrderStatus} />
              </div>
            </div>

            <div className="mt-6 border-t border-black/10 pt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-black/35">Items</p>
              <div className="mt-3 space-y-2">
                {(order.order_items ?? []).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between gap-4 text-sm">
                    <span>{item.product_name} · {item.size_label ?? "Custom"} × {item.quantity}</span>
                    <span>{formatCurrency(Number(item.unit_price) * Number(item.quantity))}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
