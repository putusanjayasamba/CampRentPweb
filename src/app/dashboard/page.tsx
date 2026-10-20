import { redirect } from "next/navigation";

export default async function DashboardRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  if (tab === "stok") {
    redirect("/admin/stok");
  }
  if (tab === "booking") {
    redirect("/admin/booking");
  }
  if (tab === "pengguna") {
    redirect("/admin/pengguna");
  }

  redirect("/admin");
}
