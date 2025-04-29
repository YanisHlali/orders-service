const db = require('../config/db');

const Order = {
  async create(clientId, items, deliveryPersonId = null, pickupTime = null, deliveryTime = null) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
  
      const [result] = await conn.execute(
        `INSERT INTO orders (client_id, delivery_person_id, pickup_time, delivery_time)
         VALUES (?, ?, ?, ?)`,
        [clientId, deliveryPersonId, pickupTime, deliveryTime]
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

  async findByUserId(userId, role) {
    let orders;
    if (role === 'client') {
      [orders] = await db.execute(
        'SELECT * FROM orders WHERE client_id = ?',
        [userId]
      );
    } else if (role === 'livreur') {
      [orders] = await db.execute(
        `SELECT * FROM orders
         WHERE delivery_person_id = ? OR delivery_person_id IS NULL`,
        [userId]
      );
    } else {
      return [];
    }
  
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

  async updateStatus(orderId, status, deliveryPersonId = null) {
    let query = 'UPDATE orders SET order_status = ?, updated_at = NOW()';
    const params = [status];
  
    if (status === 'en_livraison' && deliveryPersonId) {
      query += ', delivery_person_id = ?';
      query += ', pickup_time = NOW()';
      params.push(deliveryPersonId);
    } 
  
    if (status === 'livre') {
      query += ', delivery_time = NOW()';
    }
  
    query += ' WHERE id = ?';
    params.push(orderId);
  
    const [result] = await db.execute(query, params);
    return result;
  },

  async delete(orderId) {
    await db.execute('DELETE FROM order_items WHERE order_id = ?', [orderId]);
    const [result] = await db.execute('DELETE FROM orders WHERE id = ?', [orderId]);
    return result;
  }
};

module.exports = Order;
