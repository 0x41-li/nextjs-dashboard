import { fetchCustomersPages } from "@/app/lib/data";
import CustomersTable from "@/app/ui/customers/table";
import { lusitana } from "@/app/ui/fonts";
import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{
    query: string,
    page: string
  }>
}) {

  const { query = '', page = '1' } = await searchParams;

  const currentPage = Number(page)

  const totalPages = await fetchCustomersPages(query)

  return (
    <div className="">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Customers
      </h1>

      <Search placeholder="Search customers..." />

      <CustomersTable query={query} currentPage={currentPage} />

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>

    </div>
  )
}
