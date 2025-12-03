import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderService from "@/services/api/orderService";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const orderData = await orderService.getByOrderNumber(orderId);
      setOrder(orderData);
    } catch (err) {
      setError(err.message || "Order not found");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorView
          error={error}
          onRetry={loadOrder}
          type="default"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="CheckCircle" className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-blue-100 px-6 py-3 rounded-lg">
          <ApperIcon name="Package" className="w-5 h-5 text-primary-600 mr-2" />
          <span className="text-lg font-semibold text-primary-800">
            Order #{order.orderNumber}
          </span>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
              <Badge 
                variant={order.status === "Processing" ? "warning" : "success"}
                size="lg"
              >
                {order.status}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">{formatDate(order.orderDate)}</span>
              </div>
              {order.estimatedDelivery && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium">{formatDate(order.estimatedDelivery)}</span>
                </div>
              )}
              {order.deliveryDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivered:</span>
                  <span className="font-medium text-green-600">{formatDate(order.deliveryDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.Id} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-primary-600">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shipping Address
            </h2>
            <div className="text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          {/* Order Total */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Method
            </h3>
            <div className="flex items-center text-gray-600">
              <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
              <span>{order.paymentMethod}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate("/orders")}
            >
              <ApperIcon name="Package" className="w-5 h-5 mr-2" />
              View All Orders
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => navigate("/")}
            >
              <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Need Help With Your Order?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          If you have any questions about your order or need to make changes, 
          our customer service team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="lg">
            <ApperIcon name="Mail" className="w-5 h-5 mr-2" />
            Contact Support
          </Button>
          <Button variant="ghost" size="lg">
            <ApperIcon name="HelpCircle" className="w-5 h-5 mr-2" />
            Order FAQ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;