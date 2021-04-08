const express = require("express");
const app = express();
const Razorpay = require("razorpay");
const cors = require("cors");
const dotenv = require('dotenv');
const { products } = require("./data");



const PORT = process.env.PORT || 3000 ;

const key_id = "rzp_test_MdGluNtTWCvuX9";
const key_secret = "6KXQDPcq6R77mzBbjVmbOqHr";
const instance = new Razorpay({
  key_id,
  key_secret
});

app.use(cors());
dotenv.config();
app.use(express.json());

app.get("/products", (req,res) => {
 res.status(200).json(products)
});

app.get("/order/:productId", (req,res) => {
const { productId } = req.params;
const product = products.find((product) => product.id == productId)
const amount = product.price * 100 * 70;
const currency = "INR";
const receipt = 'receipt#123';
const notes = { desc: product.Description };
instance.orders.create({amount, currency, receipt, notes}, (error, order) => {
  if (error) {
    return res.status(500).json(error);
  }
  return res.status(200).json(order);
})
});

app.post("/verify/razorpay-signature", (req,res) => {
  console.log(JSON.stringify(req.body));
const crypto = require('crypto');
const sha256 = crypto.createHash('SHA256', "1234567@20").update(JSON.stringify(req.body)).digest("hex");
console.log(hash)
console.log(req.headers["x-razorpay-signature"])
if(hash===req.headers["x-razorpay-signature"]){
  console.log("payment success")
}else{
  console.log("payment declined");
}
  res.status(200).json(products)
 });

app.listen(PORT, () => {
  console.log(`server started on port : ${PORT}`);
});