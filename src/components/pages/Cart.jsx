import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import CartItem from "@/components/molecules/CartItem";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";

const Cart = () => {
  const [isClearing, setIsClearing] = useState(false);
  const { items, total, itemCount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      dispatch(clearCart());
      setIsClearing(false);
      toast.info("Cart cleared", {
        position: "top-right",
        autoClose: 2000,
      });
    }, 500);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  // Calculate additional costs
  const subtotal = total;
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal >= 100 ? 0 : 9.99; // Free shipping over $100
  const finalTotal = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          type="cart"
          onAction={handleContinueShopping}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">
          {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Items
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {isClearing ? (
                    <>
                      <ApperIcon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
                      Clear Cart
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-0">
                {items.map((item) => (
                  <CartItem key={item.Id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={handleContinueShopping}
              className="text-primary-600"
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-md sticky top-24">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <div className="flex items-center">
                    <span>Shipping</span>
                    {shipping === 0 && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        FREE
                      </span>
                    )}
                  </div>
                  <span>{formatPrice(shipping)}</span>
                </div>

                {subtotal < 100 && shipping > 0 && (
                  <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <ApperIcon name="Info" className="h-4 w-4 inline mr-1" />
                    Spend {formatPrice(100 - subtotal)} more for free shipping!
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                variant="primary"
                size="lg"
                className="w-full"
              >
                <ApperIcon name="CreditCard" className="h-5 w-5 mr-2" />
                Proceed to Checkout
              </Button>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center space-y-1">
                  <ApperIcon name="Shield" className="w-6 h-6 mx-auto text-green-600" />
                  <p className="text-xs text-gray-600">Secure</p>
                </div>
                <div className="text-center space-y-1">
                  <ApperIcon name="Truck" className="w-6 h-6 mx-auto text-blue-600" />
                  <p className="text-xs text-gray-600">Fast Ship</p>
                </div>
                <div className="text-center space-y-1">
                  <ApperIcon name="RotateCcw" className="w-6 h-6 mx-auto text-purple-600" />
                  <p className="text-xs text-gray-600">Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;