const express = require("express");
const mercadopago = require("mercadopago");
const app = express();
const port = process.env.PORT || 3001;

mercadopago.configure({
  access_token:
    "TEST-2934584133936959-071902-7591688dc0a97744fcabf2d3e4c7e179-745740452",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let products = [
  {
  id: 1,
  name: "Flash sativa",
  price: 250,
  image: "images/product-1.jpg",
  stock: 50,
  stock: 3,
  },
  {
  id: 2,
  name: "Planta insert",
  price: 180,
  image: "images/product-2.jpg",
  stock: 50,
  stock: 3,
  },
  {
  id: 3,
  name: "100% Jamaico",
  price: 100,
  image: "images/product-3.jpg",
  stock: 50,
  stock: 3,
  },
  {
  id: 4,
  name: "Mariflaje",
  price: 275,
  image: "images/product-4.jpg",
  stock: 50,
  stock: 3,
  },
  {
  id: 5,
  name: "Orgullo Maria",
  price: 200,
  image: "images/product-5.jpg",
  stock: 50,
  stock: 3,
  },
  {
  id: 6,
  name: "Cannabis club",
  price: 125,
  image: "images/product-6.jpg",
  stock: 50,
  stock: 3,
  },
  {
    id: 7,
    name: "Legalinzenla",
    price: 150,
    image: "images/product-7.jpg",
    stock: 50,
    stock: 3,
  },
  {
    id: 8,
    name: "Porro y pantera",
    price: 225,
    image: "images/product-8.jpg",
    stock: 50,
    stock: 3,
  },
  {
    id: 9,
    name: "Porro 420 pa los negro",
    price: 110,
    image: "images/product-9.jpg",
    stock: 50,
    stock: 3,
  },
  {
    id: 10,
    name: "Porrisima",
    price: 155,
    image: "images/product-10.jpg",
    stock: 50,
    stock: 3,
  },
];

app.get("/api/products", async (req, res) => {
  res.send(products);
});

app.post("/api/pay", async (req, res) => {
  const ids = req.body;
  const productsCopy = await products;

  let preference = {
    items: [],
    back_urls: {
      success: "http://localhost:3001/feedback",
      failure: "http://localhost:3001/feedback",
      pending: "http://localhost:3001/feedback",
    },
    auto_return: "approved",
  };

  let error = false;
  ids.forEach((id) => {
    const product = productsCopy.find((p) => p.id === id);
    if (product.stock > 0) {
      product.stock--;
      preference.items.push({
        title: product.name,
        unit_price: product.price,
        quantity: 1,
      });
    } else {
      error = true;
    }
  });

  if (error) {
    res.send("Sin stock").statusCode(400);
  } else {
    const response = await mercadopago.preferences.create(preference);
    const preferenceId = response.body.id;
    res.send({ preferenceId });
  }
});

app.get("/feedback", async (req, res) => {
    const payment = await mercadopago.payment.findById(req.query.payment_id);
    const merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
    const preferenceId = merchantOrder.body.preference_id;
    const status = payment.body.status;
    await repository.updateOrderByPreferenceId(preferenceId, status);
  
    res.sendFile(require.resolve("./fe/index.html"));
});

app.use("/", express.static("fe"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
