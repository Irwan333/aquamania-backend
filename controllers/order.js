const { Order, CartItem } = require("../models/order");
const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { sendEmail } = require("../helpers");

exports.orderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.order = order;
      next();
    });
};

exports.create = (req, res) => {
  console.log("CREATE ORDER: ", req.body);
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  console.log("orderan", order);
  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    const user = new User(req.profile);
    // const receiver = res.json(User.schema.path("email"));
    console.log("user", user.email);
    // send email alert to admin
    // order.address
    // order.products.length
    // order.amount
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Pemesanan telah dilakukan`,
      html: `
            <p>Nama: ${user.name}</p>
            <p>Total produk: ${order.products.length}</p>
            <p>Total biaya: ${order.amount}</p>
            <p>Terimakasih telah melakukan pemesanan.</p>
        `,
    };
    sendEmail(emailData);
    res.json(data);
  });
};

exports.listOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name address")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(orders);
    });
};

exports.getStatusValues = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

// exports.listOrdersUser = (req, res) => {
//   Order.find()
//     .populate("user", "_id name address")
//     .sort("-created")
//     .exec((err, orders) => {
//       if (err) {
//         return res.status(400).json({
//           error: errorHandler(error),
//         });
//       }
//       res.json(orders);
//     });
// };

// exports.getStatusValuesUser = (req, res) => {
//   res.json(Order.schema.path("status").enumValues);
// };

exports.updateOrderStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(order);
    }
  );
};

exports.invoice = (req, res) => {
  Order.find(req.order._id)
    .populate("user", "_id name address email")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(orders);
    });
};
