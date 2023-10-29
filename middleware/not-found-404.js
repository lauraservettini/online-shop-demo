function notFoundHandler(req, res) {
  res.status(404).render("base/404");
}

module.exports = notFoundHandler;
