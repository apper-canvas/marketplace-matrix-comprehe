import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity) => {
    const qty = Math.max(0, Math.min(99, newQuantity));
    setQuantity(qty);
    dispatch(updateQuantity({ productId: item.Id, quantity: qty }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.Id));
    toast.info(`${item.name} removed from cart`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-shrink-0 w-20 h-20">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-grow min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {item.name}
        </h4>
        <p className="text-sm font-bold text-primary-600 mt-1">
          {formatPrice(item.price)}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="Minus" className="h-4 w-4" />
            </Button>
            
            <span className="w-12 text-center text-sm font-medium">
              {quantity}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 99}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-bold text-gray-900">
          {formatPrice(item.price * quantity)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;