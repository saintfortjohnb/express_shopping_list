const express = require('express');
const app = express();
const items = require('./fakeDb');
const Item = require('./item');

app.use(express.json());

const itemsRouter = express.Router();

// GET /items - Get all shopping items
itemsRouter.get('/', (req, res) => {
  res.json(items);
});

// POST /items - Add a new item to the shopping list
itemsRouter.post('/', (req, res) => {
  const { name, price } = req.body;
  const newItem = new Item(name, price);
  items.push(newItem);
  res.status(201).json({ added: newItem });
});

// GET /items/:name - Get a single item by name
itemsRouter.get('/:name', (req, res) => {
  const itemName = req.params.name;
  const item = items.find((item) => item.name === itemName);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// PATCH /items/:name - Update a single item by name
itemsRouter.patch('/:name', (req, res) => {
  const itemName = req.params.name;
  const updatedItem = req.body;

  const itemIndex = items.findIndex((item) => item.name === itemName);

  if (itemIndex !== -1) {
    items[itemIndex] = { ...items[itemIndex], ...updatedItem };
    res.json({ updated: items[itemIndex] });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// DELETE /items/:name - Delete a single item by name
itemsRouter.delete('/:name', (req, res) => {
  const itemName = req.params.name;
  const itemIndex = items.findIndex((item) => item.name === itemName);

  if (itemIndex !== -1) {
    items.splice(itemIndex, 1);
    res.json({ message: 'Deleted' });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.use('/items', itemsRouter);

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
}

module.exports = app;
