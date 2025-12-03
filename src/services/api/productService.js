import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  async getAll() {
    await delay(300);
    return [...productsData];
  }

  async getById(id) {
    await delay(200);
    const product = productsData.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  }

  async getByCategory(category) {
    await delay(400);
    return productsData.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    ).map(p => ({ ...p }));
  }

  async getFeatured() {
    await delay(250);
    return productsData
      .filter(p => p.rating >= 4.5)
      .slice(0, 8)
      .map(p => ({ ...p }));
  }

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return productsData.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }));
  }

  async getRecommended(productId, limit = 4) {
    await delay(200);
    const currentProduct = productsData.find(p => p.Id === parseInt(productId));
    if (!currentProduct) return [];
    
    return productsData
      .filter(p => p.Id !== parseInt(productId) && p.category === currentProduct.category)
      .slice(0, limit)
      .map(p => ({ ...p }));
  }
}

export default new ProductService();