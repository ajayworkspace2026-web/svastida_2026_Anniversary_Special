# Architecture Baseline

## Customer
Home -> Collections -> Product -> Customisation -> Cart -> Checkout -> Order record -> WhatsApp click-to-chat.

## Admin
Admin Login -> Dashboard -> Products -> Collections -> Orders -> Storage -> Settings.

## AI fashion designer
Fabric upload -> validated upload -> generation request -> multiple dress concepts -> select concept -> attach to enquiry/order.

## Non-negotiable requirements
- Admin protected by authentication and authorization.
- No service-role secrets in browser code.
- Customer must be able to browse and place order requests without payment.
- WhatsApp message is generated from the persisted order and opened for the customer to send.
- Product, collection, pricing, image and order data are dynamic.
- Storage dashboard must report measured usage where provider metadata allows and never present invented usage as fact.
- Image uploads are validated and optimized.
- Customer-facing flows need explicit loading, empty, error and success states.
- UI must remain responsive with reduced client-side JavaScript and lazy-loaded media.
- AI generation is a visual concept generator, not a sewing-pattern guarantee.
- Test gates will cover functional, responsive, accessibility, security and performance behavior.

## Phases
1. Foundation
2. Customer storefront
3. Product and collection management
4. Cart, checkout and WhatsApp
5. Admin authentication and dashboard
6. Storage management
7. AI fashion designer
8. Security and performance hardening
9. Full QA
10. Production release
