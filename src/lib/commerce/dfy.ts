/**
 * Done-For-You intake — server functions for the $59 service product.
 *
 * Flow: buyer pays for the service product (normal PayPal checkout) →
 * the success page shows the intake form → the buyer submits their job
 * details → the operator sees the request on the desk order page, fills
 * the template, emails the finished document, and marks it delivered.
 *
 * Guardrails: a request is accepted only for an order that is PAID and
 * actually contains a service product, and only one request per order
 * (the unique order_id keeps resubmits from duplicating the work).
 */
import { createServerFn } from "@tanstack/react-start";

function requireString(data: unknown, field: string): string {
  const value = (data as Record<string, unknown> | null)?.[field];
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function optionalString(data: unknown, field: string): string {
  const value = (data as Record<string, unknown> | null)?.[field];
  return typeof value === "string" ? value.trim() : "";
}

export interface DfyRequestView {
  id: string;
  orderId: string;
  productId: string;
  customerEmail: string | null;
  status: "pending" | "delivered";
  deliveredAt: Date | null;
  createdAt: Date;
  details: Record<string, string>;
}

function toView(row: {
  id: string;
  order_id: string;
  product_id: string;
  customer_email: string | null;
  status: "pending" | "delivered";
  delivered_at: Date | null;
  created_at: Date;
  details: Record<string, string>;
}): DfyRequestView {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    customerEmail: row.customer_email,
    status: row.status,
    deliveredAt: row.delivered_at,
    createdAt: row.created_at,
    details: row.details,
  };
}

/** The intake form a buyer fills in after paying for the service product. */
export const submitDfyRequest = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const email = requireString(data, "deliveryEmail");
    if (!email.includes("@")) throw new Error("A valid email is required");
    return {
      orderId: requireString(data, "orderId"),
      templatePack: requireString(data, "templatePack"),
      whatNeeded: requireString(data, "whatNeeded"),
      businessName: requireString(data, "businessName"),
      clientName: optionalString(data, "clientName"),
      jobDetails: optionalString(data, "jobDetails"),
      priceOrAmount: optionalString(data, "priceOrAmount"),
      neededBy: optionalString(data, "neededBy"),
      deliveryEmail: email,
    };
  })
  .handler(async ({ data }) => {
    const db = await import("./server");

    // One guard for the whole intake: paid order holding the service product.
    const serviceProduct = await db.getPaidServiceProductForOrder(data.orderId);

    const { request, created } = await db.createDfyRequest({
      order_id: data.orderId,
      product_id: serviceProduct.id,
      customer_email: data.deliveryEmail,
      details: {
        templatePack: data.templatePack,
        whatNeeded: data.whatNeeded,
        businessName: data.businessName,
        clientName: data.clientName,
        jobDetails: data.jobDetails,
        priceOrAmount: data.priceOrAmount,
        neededBy: data.neededBy,
        deliveryEmail: data.deliveryEmail,
      },
    });
    return { alreadySubmitted: !created, request: toView(request) };
  });

/** Read-only intake view for the success page. Same exposure as the order itself. */
export const getDfyRequestForOrder = createServerFn({ method: "GET" })
  .validator((data: unknown) => ({ orderId: requireString(data, "orderId") }))
  .handler(async ({ data }) => {
    const db = await import("./server");
    const request = await db.getDfyRequestByOrder(data.orderId);
    return request ? toView(request) : null;
  });
