const db = require('../config/database');

class OrderService {
    mapRequestToDatabase(orderData) {
        return {
            orderId: orderData.numeroPedido,
            value: orderData.valorTotal,
            creationDate: new Date(orderData.dataCriacao).toISOString(),
            items: orderData.items.map(item => ({
                productId: parseInt(item.idItem),
                quantity: item.quantidadeItem,
                price: item.valorItem
            }))
        };
    }

    mapDatabaseToResponse(dbOrder, dbItems) {
        return {
            orderId: dbOrder.orderId,
            value: dbOrder.value,
            creationDate: dbOrder.creationDate,
            items: dbItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            }))
        };
    }

    createOrder(orderData) {
        return new Promise((resolve, reject) => {
            const mappedOrder = this.mapRequestToDatabase(orderData);

            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                const sql = `INSERT INTO orders (orderId, value, creationDate) VALUES (?, ?, ?)`;

                db.run(sql, [mappedOrder.orderId, mappedOrder.value, mappedOrder.creationDate], function (err) {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject(err);
                    }

                    const orderDbId = this.lastID;
                    const itemsSql = `INSERT INTO order_items (order_id, productId, quantity, price) VALUES (?, ?, ?, ?)`;

                    let completed = 0;
                    const totalItems = mappedOrder.items.length;

                    if (totalItems === 0) {
                        db.run('COMMIT');
                        return resolve({ id: orderDbId, ...mappedOrder });
                    }

                    mappedOrder.items.forEach(item => {
                        db.run(itemsSql, [orderDbId, item.productId, item.quantity, item.price], (err) => {
                            if (err) {
                                db.run('ROLLBACK');
                                return reject(err);
                            }

                            completed++;
                            if (completed === totalItems) {
                                db.run('COMMIT');
                                resolve({ id: orderDbId, ...mappedOrder });
                            }
                        });
                    });
                });
            });
        });
    }

    getOrderById(orderId) {
        return new Promise((resolve, reject) => {
            const orderSql = `SELECT * FROM orders WHERE orderId = ?`;

            db.get(orderSql, [orderId], (err, order) => {
                if (err) {
                    return reject(err);
                }

                if (!order) {
                    return resolve(null);
                }

                const itemsSql = `SELECT * FROM order_items WHERE order_id = ?`;

                db.all(itemsSql, [order.id], (err, items) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(this.mapDatabaseToResponse(order, items));
                });
            });
        });
    }

    listOrders() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM orders ORDER BY created_at DESC`;

            db.all(sql, [], (err, orders) => {
                if (err) {
                    return reject(err);
                }

                if (orders.length === 0) {
                    return resolve([]);
                }

                const ordersWithItems = [];
                let processed = 0;

                orders.forEach(order => {
                    const itemsSql = `SELECT * FROM order_items WHERE order_id = ?`;

                    db.all(itemsSql, [order.id], (err, items) => {
                        if (err) {
                            return reject(err);
                        }

                        ordersWithItems.push(this.mapDatabaseToResponse(order, items));
                        processed++;

                        if (processed === orders.length) {
                            resolve(ordersWithItems);
                        }
                    });
                });
            });
        });
    }

    updateOrder(orderId, orderData) {
        return new Promise((resolve, reject) => {
            const mappedOrder = this.mapRequestToDatabase(orderData);

            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                const updateSql = `UPDATE orders SET value = ?, creationDate = ? WHERE orderId = ?`;

                db.run(updateSql, [mappedOrder.value, mappedOrder.creationDate, orderId], function (err) {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject(err);
                    }

                    if (this.changes === 0) {
                        db.run('ROLLBACK');
                        return resolve(null);
                    }

                    const getIdSql = `SELECT id FROM orders WHERE orderId = ?`;

                    db.get(getIdSql, [orderId], (err, row) => {
                        if (err) {
                            db.run('ROLLBACK');
                            return reject(err);
                        }

                        const orderDbId = row.id;
                        const deleteSql = `DELETE FROM order_items WHERE order_id = ?`;

                        db.run(deleteSql, [orderDbId], (err) => {
                            if (err) {
                                db.run('ROLLBACK');
                                return reject(err);
                            }

                            const itemsSql = `INSERT INTO order_items (order_id, productId, quantity, price) VALUES (?, ?, ?, ?)`;
                            let completed = 0;
                            const totalItems = mappedOrder.items.length;

                            if (totalItems === 0) {
                                db.run('COMMIT');
                                return resolve({ ...mappedOrder, orderId });
                            }

                            mappedOrder.items.forEach(item => {
                                db.run(itemsSql, [orderDbId, item.productId, item.quantity, item.price], (err) => {
                                    if (err) {
                                        db.run('ROLLBACK');
                                        return reject(err);
                                    }

                                    completed++;
                                    if (completed === totalItems) {
                                        db.run('COMMIT');
                                        resolve({ ...mappedOrder, orderId });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    deleteOrder(orderId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM orders WHERE orderId = ?`;

            db.run(sql, [orderId], function (err) {
                if (err) {
                    return reject(err);
                }

                resolve(this.changes > 0);
            });
        });
    }
}

module.exports = new OrderService();