import { getOrderById } from "@/lib/actions/order.actions"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import OrderDetailsTablePage from "./order-details-table"
import { OrderDetails } from "@/types"

export const metadata: Metadata = {
  title: "Order Details",
}

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params

  const order = await getOrderById(id)
  if (!order) notFound()

  return (
    <>
      <OrderDetailsTablePage order={order as unknown as OrderDetails} />
    </>
  )
}

export default OrderDetailsPage
