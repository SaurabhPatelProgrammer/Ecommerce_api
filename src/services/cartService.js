const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {
  static async getCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
  }

  static async addItem(userId, productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    let cart = await this.getCart(userId);
    const existingItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.updatedAt = Date.now();
    return cart.save();
  }

  static async updateItemQuantity(userId, productId, quantity) {
    const cart = await this.getCart(userId);
    const item = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (!item) {
      throw new Error('Item not found in cart');
    }

    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    item.quantity = quantity;
    cart.updatedAt = Date.now();
    return cart.save();
  }

  static async removeItem(userId, productId) {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );
    cart.updatedAt = Date.now();
    return cart.save();
  }

  static async clearCart(userId) {
    const cart = await this.getCart(userId);
    cart.items = [];
    cart.updatedAt = Date.now();
    return cart.save();
  }
}