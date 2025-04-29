const db = require('../config/db');

const Order = {
  async create(clientId, items) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.execute(
        'INSERT INTO orders (client_id) VALUES (?)',
        [clientId]
      );
      const orderId = result.insertId;

      for (const item of items) {
        await conn.execute(
          'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)',
          [orderId, item.menu_item_id, item.quantity]
        );
      }

      await conn.commit();
      return orderId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  async findByUserId(userId) {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE client_id = ?',
      [userId]
    );

    for (const order of orders) {
      const [items] = await db.execute(
        'SELECT menu_item_id, quantity, item_status FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    return orders;
  },

  async findById(orderId) {
    const [orderRows] = await db.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );
    const order = orderRows[0];
    if (!order) return null;

    const [items] = await db.execute(
      'SELECT menu_item_id, quantity, item_status FROM order_items WHERE order_id = ?',
      [orderId]
    );

    order.items = items;
    console.log(order);
    return order;
  },

  async getOrderItems(orderId) {
    const [rows] = await db.execute(
      'SELECT menu_item_id, quantity, item_status FROM order_items WHERE order_id = ?',
      [orderId]
    );
    return rows;
  },

  async updateStatus(orderId, status) {
    const [result] = await db.execute(
      'UPDATE orders SET order_status = ? WHERE id = ?',
      [status, orderId]
    );
    return result;
  },

  async closeOrder(orderId) {
    const [result] = await db.execute(
      'UPDATE orders SET order_status = "livre", updated_at = NOW() WHERE id = ?',
      [orderId]
    );
    return result;
  },

  async delete(orderId) {
    await db.execute('DELETE FROM order_items WHERE order_id = ?', [orderId]);
    const [result] = await db.execute('DELETE FROM orders WHERE id = ?', [orderId]);
    return result;
  }
};

module.exports = Order;
