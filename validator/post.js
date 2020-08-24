const { check } = require("express-validator");

exports.createPostValidator = (req, res, next) => {
  // title
  req.check("title", "Tulis Judul").notEmpty();
  req.check("title", "Judul harus 4-50 karakter").isLength({
    min: 4,
    max: 50,
  });
  // body
  req.check("body", "Tulis isi postingan").notEmpty();
  req.check("body", "Isi postingan harus 4-150 karakter").isLength({
    min: 4,
    max: 150,
  });
  // check for errors
  const errors = req.validationErrors();
  // if error show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // proceed to next middleware
  next();
};
