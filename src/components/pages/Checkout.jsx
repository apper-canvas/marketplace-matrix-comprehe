import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import orderService from "@/services/api/orderService";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Checkout = () => {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    
    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    
    // Order notes
    notes: ""
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect to cart if no items
    if (items.length === 0) {
      navigate("/cart");
      toast.error("Your cart is empty");
    }
  }, [items, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const subtotal = total;
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const finalTotal = subtotal + tax + shipping;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    const requiredFields = ["firstName", "lastName", "email", "street", "city", "state", "zipCode"];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (formData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Please enter a valid card number";
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = "CVV must be at least 3 digits";
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = "Name on card is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          Id: item.Id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal,
        tax,
        shipping,
        total: finalTotal,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: `Credit Card ending in ${formData.cardNumber.slice(-4)}`,
        customerEmail: formData.email,
        notes: formData.notes
      };

      const order = await orderService.create(orderData);
      
      // Clear cart and redirect to confirmation
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order.orderNumber}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Order creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Shipping", icon: "Truck" },
    { number: 2, title: "Payment", icon: "CreditCard" },
    { number: 3, title: "Review", icon: "CheckCircle" }
  ];

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number 
                  ? "bg-primary-600 border-primary-600 text-white" 
                  : "border-gray-300 text-gray-400"
              }`}>
                {currentStep > step.number ? (
                  <ApperIcon name="Check" className="w-5 h-5" />
                ) : (
                  <ApperIcon name={step.icon} className="w-5 h-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step.number ? "text-gray-900" : "text-gray-400"
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${
                  currentStep > step.number ? "bg-primary-600" : "bg-gray-300"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  error={errors.firstName}
                  required
                />
                
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  error={errors.lastName}
                  required
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                  required
                  className="md:col-span-2"
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="md:col-span-2"
                />
                
                <Input
                  label="Street Address"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  error={errors.street}
                  required
                  className="md:col-span-2"
                />
                
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  error={errors.city}
                  required
                />
                
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  error={errors.state}
                  required
                />
                
                <Input
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  error={errors.zipCode}
                  required
                />
                
                <Input
                  label="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  disabled
                />
              </div>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Payment Information
              </h2>
              
              <div className="space-y-6">
                <Input
                  label="Card Number"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
                    handleInputChange("cardNumber", value);
                  }}
                  error={errors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
                
                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + "/" + value.substring(2, 4);
                      }
                      handleInputChange("expiryDate", value);
                    }}
                    error={errors.expiryDate}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                  
                  <Input
                    label="CVV"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                    error={errors.cvv}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
                
                <Input
                  label="Name on Card"
                  value={formData.cardName}
                  onChange={(e) => handleInputChange("cardName", e.target.value)}
                  error={errors.cardName}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Order Review */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Review Your Order
              </h2>
              
              <div className="space-y-6">
                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">{formData.firstName} {formData.lastName}</p>
                    <p className="text-gray-600">{formData.street}</p>
                    <p className="text-gray-600">{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p className="text-gray-600">{formData.country}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">Credit Card ending in {formData.cardNumber.slice(-4)}</p>
                    <p className="text-gray-600">{formData.cardName}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.Id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any special instructions for your order..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep > 1 ? (
              <Button variant="secondary" onClick={handleBack}>
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/cart")}>
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            )}

            {currentStep < 3 ? (
              <Button variant="primary" onClick={handleNext}>
                Continue
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                    Place Order
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.Id} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;