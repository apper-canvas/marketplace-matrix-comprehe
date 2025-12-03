import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "@/services/api/orderService";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await orderService.getAll();
      // Sort orders by date, newest first
      const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sortedOrders);
    } catch (err) {
      setError(err.message || "Failed to load orders");
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
      month: "short",
      day: "numeric",
    });
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "success";
      case "shipped":
        return "primary";
      case "processing":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const handleViewOrder = (orderNumber) => {
    navigate(`/order-confirmation/${orderNumber}`);
  };

  const handleStartShopping = () => {
    navigate("/");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorView
          error={error}
          onRetry={loadOrders}
          type="network"
        />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          type="orders"
          onAction={handleStartShopping}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
        <p className="text-gray-600">
          View and track your recent purchases
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.Id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-6">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium text-gray-900">{formatDate(order.orderDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant={getStatusVariant(order.status)} size="lg">
                    {order.status}
                  </Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewOrder(order.orderNumber)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {order.items.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-primary-600">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.items.length > 4 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    +{order.items.length - 4} more items
                  </p>
                </div>
              )}

              {/* Order Actions */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  {order.status === "Delivered" ? (
                    <div className="flex items-center text-green-600">
                      <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
                      Delivered on {formatDate(order.deliveryDate)}
                    </div>
                  ) : order.status === "Shipped" ? (
                    <div className="flex items-center text-blue-600">
                      <ApperIcon name="Truck" className="w-4 h-4 mr-1" />
                      Estimated delivery: {formatDate(order.estimatedDelivery)}
                    </div>
                  ) : (
                    <div className="flex items-center text-orange-600">
                      <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                      Order is being processed
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  {order.status === "Delivered" && (
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                      Return Items
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="MessageCircle" className="w-4 h-4 mr-2" />
                    Get Help
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleViewOrder(order.orderNumber)}
                  >
                    <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                    View Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready for Your Next Purchase?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Discover more amazing products and continue building your collection.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartShopping}
            className="px-8"
          >
            <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Orders;