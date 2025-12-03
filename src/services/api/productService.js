import { getApperClient } from "@/services/apperClient";
export const productService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "stock_quantity_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "tags_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('product_c', parseInt(id), {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "stock_quantity_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "tags_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByCategory(categoryId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "stock_quantity_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [parseInt(categoryId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching products by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "stock_quantity_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {
                  "fieldName": "name_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ]
            },
            {
              "conditions": [
                {
                  "fieldName": "description_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ]
            },
            {
              "conditions": [
                {
                  "fieldName": "tags_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ]
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching products:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(productData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          name_c: productData.name_c,
          description_c: productData.description_c,
          price_c: productData.price_c,
          image_url_c: productData.image_url_c,
          stock_quantity_c: productData.stock_quantity_c,
          is_featured_c: productData.is_featured_c,
          rating_c: productData.rating_c,
          category_c: productData.category_c,
          tags_c: productData.tags_c
        }]
      };

      const response = await apperClient.createRecord('product_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} products:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, productData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          name_c: productData.name_c,
          description_c: productData.description_c,
          price_c: productData.price_c,
          image_url_c: productData.image_url_c,
          stock_quantity_c: productData.stock_quantity_c,
          is_featured_c: productData.is_featured_c,
          rating_c: productData.rating_c,
          category_c: productData.category_c,
          tags_c: productData.tags_c
        }]
      };

      const response = await apperClient.updateRecord('product_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} products:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('product_c', {
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
          console.error(`Failed to delete ${failed.length} products:`, failed);
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data?.message || error);
      return false;
    }
  }
};