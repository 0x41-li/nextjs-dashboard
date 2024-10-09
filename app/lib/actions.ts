"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const invoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const invoiceFormSchemaOmissions = invoiceFormSchema.omit({
  id: true,
  date: true,
});

export const createInvoice = async (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);

  const { customerId, amount, status } =
    invoiceFormSchemaOmissions.parse(rawFormData);

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  await sql`
    INSERT INTO invoices
      (customer_id, amount, status, date)
    VALUES
      (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
};

export const updateInvoice = async (id: string, formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);

  const { customerId, amount, status } =
    invoiceFormSchemaOmissions.parse(rawFormData);

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    set customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
};
