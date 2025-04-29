const Order = require('../models/orderModel');

const orderController = {
  async createOrder(req, res) {
    const { clientId, items } = req.body;
    try {
      const id = await Order.create(clientId, items);
      res.status(201).json({ message: 'Order created', id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getUserOrders(req, res) {
    const { userId } = req.params;
    try {
      const orders = await Order.findByUserId(userId);
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },  

  async updateOrderStatus(req, res) {
    try {
      await Order.updateStatus(req.params.orderId, req.body.status);
      res.status(200).json({ message: 'Order status updated' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async closeOrder(req, res) {
    try {
      await Order.closeOrder(req.params.id);
      res.status(200).json({ message: 'Order closed' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async deleteOrder(req, res) {
    try {
      await Order.delete(req.params.id);
      res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = orderController;
