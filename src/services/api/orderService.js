import ordersData from "@/services/mockData/orders.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OrderService {
  constructor() {
    this.orders = [...ordersData];
  }

  async getAll() {
    await delay(300);
    return [...this.orders];
  }

  async getById(id) {
    await delay(200);
    const order = this.orders.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  }

  async getByOrderNumber(orderNumber) {
    await delay(200);
    const order = this.orders.find(o => o.orderNumber === orderNumber);
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  }

  async create(orderData) {
    await delay(500);
    const newId = Math.max(...this.orders.map(o => o.Id)) + 1;
    const orderNumber = `MP-2024-${String(newId).padStart(3, '0')}`;
    
    const newOrder = {
      Id: newId,
      orderNumber,
      ...orderData,
      status: "Processing",
      orderDate: new Date().toISOString(),
    };
    
    this.orders.push(newOrder);
    return { ...newOrder };
  }

  async update(id, updateData) {
    await delay(300);
    const orderIndex = this.orders.findIndex(o => o.Id === parseInt(id));
    if (orderIndex === -1) {
      throw new Error("Order not found");
    }
    
    this.orders[orderIndex] = { ...this.orders[orderIndex], ...updateData };
    return { ...this.orders[orderIndex] };
  }
}

export default new OrderService();