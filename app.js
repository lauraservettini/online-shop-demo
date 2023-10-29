const express = require("express");
const session = require('express-session');
const db = require("./data/database");
const path = require("path");
const errorHandlerMid = require("./middleware/error-handler");
const checkAuthStatusMid = require("./middleware/check-auth");
const protectRoutesMid = require("./middleware/protect-routes");
const initializeCartMid = require("./middleware/cart");
const updateCartPrices = require("./middleware/update-cart-prices");
const NotFound404Handler = require("./middleware/not-found-404");
const csrfMid = require("./middleware/csrf-token");

const cookieParser = require('cookie-parser')
const sessionConfig = require("./config/session");
const mongoDbSessionStore = sessionConfig.createSessionStore(session);

const app = express();

const routes = require("./routes/routes");
const auth = require("./routes/auth.routes");
const products = require("./routes/products.routes");
const adminProducts = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");

let port = 3000

// verifica se c'è una connessione a un server esterno al localhost
if(process.env.PORT){
  port = process.env.PORT;
} 

app.use(express.static("public"));

//cerca /products/assets/  (images/this.id)dentro product-data
app.use("/products/assets/", express.static("product-data"));

//urlencoded usata per estrarre dati dai form (req.body)
app.use(express.urlencoded({ extended: false }));

//json usata per i dati da inviare da richieste ajax al beckend
app.use(express.json());

//per estrarre il corpo di una richiesta, per usare anche req.body
app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));
app.use(cookieParser("SecretKey"));


app.use(initializeCartMid);
app.use(updateCartPrices);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(csrfMid.addCsrfToken);

app.use(checkAuthStatusMid);

app.use(csrfMid.csrfSynchronisedProtection);

app.use(routes);
app.use(auth);
app.use("/products", products);
app.use("/cart", cartRoutes);

//per proteggere l'acesso all'area di admin
//alternativa app.use(protectRoutesMid) prima delle routes da proteggere;
app.use("/orders", protectRoutesMid, ordersRoutes);
app.use("/admin", protectRoutesMid, adminProducts);


app.use(NotFound404Handler);

app.use(errorHandlerMid);

db.connectToDatabase()
  .then(function () {
    app.listen(port);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
  });
