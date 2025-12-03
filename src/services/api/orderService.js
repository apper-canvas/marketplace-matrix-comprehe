import { getApperClient } from '@/services/apperClient';

export const orderService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('order_c', {
        fields: [
          {"field": {"Name": "order_number_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "payment_method_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('order_c', parseInt(id), {
        fields: [
          {"field": {"Name": "order_number_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "payment_method_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(orderData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          order_number_c: orderData.order_number_c || `ORD${Date.now()}`,
          total_amount_c: orderData.total_amount_c,
          status_c: orderData.status_c || 'pending',
          order_date_c: new Date().toISOString().split('T')[0],
          shipping_address_c: orderData.shipping_address_c,
          billing_address_c: orderData.billing_address_c,
          tracking_number_c: orderData.tracking_number_c || `TRK${Date.now()}`,
          payment_method_c: orderData.payment_method_c
        }]
      };

      const response = await apperClient.createRecord('order_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} orders:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, orderData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          order_number_c: orderData.order_number_c,
          total_amount_c: orderData.total_amount_c,
          status_c: orderData.status_c,
          order_date_c: orderData.order_date_c,
          shipping_address_c: orderData.shipping_address_c,
          billing_address_c: orderData.billing_address_c,
          tracking_number_c: orderData.tracking_number_c,
          payment_method_c: orderData.payment_method_c
        }]
      };

      const response = await apperClient.updateRecord('order_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} orders:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating order:", error?.response?.data?.message || error);
      return null;
    }
  },

  async updateStatus(id, status) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };

      const response = await apperClient.updateRecord('order_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} order statuses:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating order status:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('order_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} orders:`, failed);
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting order:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getOrderItems(orderId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('order_item_c', {
        fields: [
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "product_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "unit_price_c"}},
          {"field": {"Name": "total_price_c"}}
        ],
        where: [{
          "FieldName": "order_c",
          "Operator": "EqualTo",
          "Values": [parseInt(orderId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching order items:", error?.response?.data?.message || error);
      return [];
    }
  },

  async createOrderItem(orderItemData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          order_c: orderItemData.order_c,
          product_c: orderItemData.product_c,
          quantity_c: orderItemData.quantity_c,
          unit_price_c: orderItemData.unit_price_c,
          total_price_c: orderItemData.total_price_c
        }]
      };

      const response = await apperClient.createRecord('order_item_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} order items:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating order item:", error?.response?.data?.message || error);
      return null;
    }
  }
};