const Order = require('../models/orderModel');

const orderController = {
  async createOrder(req, res) {
    const { clientId, items, deliveryPersonId, pickupTime, deliveryTime } = req.body;
    try {
      const id = await Order.create(clientId, items, deliveryPersonId, pickupTime, deliveryTime);
      res.status(201).json({ message: 'Order created', id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },  

  async getUserOrders(req, res) {
    // Récupérer role de l'utilisateur à partir du token JWT
    const user = req.user;
    try {
      const orders = await Order.findByUserId(user.id, user.role);
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
    const { status, delivery_person_id } = req.body;
  
    try {
      await Order.updateStatus(req.params.orderId, status, delivery_person_id);
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
