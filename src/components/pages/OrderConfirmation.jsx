import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { orderService } from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      const [orderData, itemsData] = await Promise.all([
        orderService.getById(orderId),
        orderService.getOrderItems(orderId)
      ])
      
      setOrder(orderData)
      setOrderItems(itemsData)
    } catch (error) {
      console.error('Failed to load order:', error)
      setError('Failed to load order details')
      toast.error('Failed to load order details')
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Order not found'}
          </h2>
          <Link to="/orders" className="text-primary-600 hover:text-primary-700 font-medium">
            View All Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Details */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Order #{order.order_number_c || order.Id}
              </h2>
              <p className="text-gray-600">
                Placed on {formatDate(order.order_date_c)}
              </p>
            </div>
            <Badge className={getStatusColor(order.status_c)}>
              {order.status_c || 'pending'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-gray-600">
                {order.shipping_address_c || 'Not specified'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Billing Address</h3>
              <p className="text-gray-600">
                {order.billing_address_c || 'Same as shipping'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
              <p className="text-gray-600">
                {order.payment_method_c || 'Not specified'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tracking Number</h3>
              <p className="text-gray-600">
                {order.tracking_number_c || 'Will be provided when shipped'}
              </p>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
          
          {orderItems.length > 0 ? (
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.product_c?.image_url_c || '/api/placeholder/64/64'}
                        alt={item.product_c?.name_c || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {item.product_c?.name_c || 'Product'}
                      </h4>
                      <p className="text-gray-600">Quantity: {item.quantity_c}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${item.total_price_c || '0.00'}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${item.unit_price_c || '0.00'} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Order items will be displayed here.</p>
          )}
        </Card>

        {/* Order Summary */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.total_amount_c || '0.00'}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${order.total_amount_c || '0.00'}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders">
            <Button variant="outline" className="w-full sm:w-auto">
              <ApperIcon name="Package" className="w-4 h-4 mr-2" />
              View All Orders
            </Button>
          </Link>
          
          <Link to="/">
            <Button className="w-full sm:w-auto">
              <ApperIcon name="ShoppingBag" className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}