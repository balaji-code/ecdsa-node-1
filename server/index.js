const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "03f0c32546ee4d7ce2d8884a2e65e1c49e74086edec25cae09a888b6e6b84be0bb": 100,
  "03f4f48d422ad350d7cf9dcd77dbc87c59908a8cd0130f2f3a64784bc3375a6ed6": 50,
  "02cdb83cff38cf1b163915e11f08cab87f7c7143f0677db15bff5d0a8c355ee261": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
