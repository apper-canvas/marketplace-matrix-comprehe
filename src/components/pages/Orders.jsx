import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { orderService } from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useSelector(state => state.user)

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      // In a real implementation, you would filter orders by user
      const ordersData = await orderService.getAll()
      setOrders(ordersData)
    } catch (error) {
      console.error('Failed to load orders:', error)
      setError('Failed to load orders')
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadOrders}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Empty
        icon="Package"
        title="No orders yet"
        description="You haven't placed any orders. Start shopping to see your orders here."
        action={
          <Link
            to="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </Link>
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <div className="text-gray-600">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.Id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Order #{order.order_number_c || order.Id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.order_date_c)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status_c)}>
                    {order.status_c || 'pending'}
                  </Badge>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    ${order.total_amount_c || '0.00'}
                  </div>
                  {order.tracking_number_c && (
                    <p className="text-sm text-gray-600">
                      Tracking: {order.tracking_number_c}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Payment Method:</span>
                    <span className="ml-2 text-gray-600">
                      {order.payment_method_c || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Shipping Address:</span>
                    <span className="ml-2 text-gray-600">
                      {order.shipping_address_c || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  {order.status_c === 'shipped' && (
                    <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                      <ApperIcon name="Truck" className="w-4 h-4" />
                      Track Order
                    </button>
                  )}
                  {order.status_c === 'delivered' && (
                    <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                      <ApperIcon name="CheckCircle" className="w-4 h-4" />
                      Write Review
                    </button>
                  )}
                </div>
                
                <Link
                  to={`/order-confirmation/${order.Id}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  View Details
                  <ApperIcon name="ChevronRight" className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
</div>
    </div>
  )
}