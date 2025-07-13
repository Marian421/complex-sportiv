const validate = (schema, type = "body") => (req, res, next) => {
  const { error } = schema.validate(req[type]);
  if (error) {
    return res.status(400).json({ message: error.details[0].message});
  }
  next();
};

module.exports = validate;
