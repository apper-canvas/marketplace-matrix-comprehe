import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { orderService } from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import { clearCart } from "@/store/slices/cartSlice";

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items)
  const { user } = useSelector(state => state.user)
  const [loading, setLoading] = useState(false)
  
  const [billingData, setBillingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddress || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  })

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  const handleBillingChange = (e) => {
    setBillingData({ ...billingData, [e.target.name]: e.target.value })
  }

  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      setLoading(true)

      // Format shipping address
      const shippingAddress = `${billingData.firstName} ${billingData.lastName}\n${billingData.address}\n${billingData.city}, ${billingData.state} ${billingData.zipCode}\n${billingData.country}`
      
      // Create order
      const orderData = {
        total_amount_c: total,
        status_c: 'confirmed',
        shipping_address_c: shippingAddress,
        billing_address_c: shippingAddress,
        payment_method_c: `**** **** **** ${paymentData.cardNumber.slice(-4)}`
      }

      const order = await orderService.create(orderData)
      
      if (order) {
        // Create order items
        for (const item of cartItems) {
          await orderService.createOrderItem({
            order_c: order.Id,
            product_c: item.id,
            quantity_c: item.quantity,
            unit_price_c: item.price,
            total_price_c: item.price * item.quantity
          })
        }

        // Clear cart and redirect
        dispatch(clearCart())
        toast.success('Order placed successfully!')
        navigate(`/order-confirmation/${order.Id}`)
      } else {
        throw new Error('Failed to create order')
      }
    } catch (error) {
      console.error('Checkout failed:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="ShoppingCart" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout.</p>
          <Button onClick={() => navigate('/')}>
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Billing Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Billing Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={billingData.firstName}
                    onChange={handleBillingChange}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={billingData.lastName}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={billingData.email}
                  onChange={handleBillingChange}
                  required
                />
                
                <Input
                  label="Phone"
                  name="phone"
                  value={billingData.phone}
                  onChange={handleBillingChange}
                  required
                />
                
                <Input
                  label="Address"
                  name="address"
                  value={billingData.address}
                  onChange={handleBillingChange}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={billingData.city}
                    onChange={handleBillingChange}
                    required
                  />
                  <Input
                    label="State"
                    name="state"
                    value={billingData.state}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="ZIP Code"
                    name="zipCode"
                    value={billingData.zipCode}
                    onChange={handleBillingChange}
                    required
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={billingData.country}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
              </form>
            </Card>

            {/* Payment Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Payment Information
              </h2>
              
              <div className="space-y-4">
                <Input
                  label="Name on Card"
                  name="nameOnCard"
                  value={paymentData.nameOnCard}
                  onChange={handlePaymentChange}
                  required
                />
                
                <Input
                  label="Card Number"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={handlePaymentChange}
                    required
                  />
                  <Input
                    label="CVV"
                    name="cvv"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xl font-bold text-gray-900 mt-4 mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                    Place Order
                  </>
                )}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}