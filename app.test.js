const request = require('supertest');
const app = require('./app');
const items = require('./fakeDb');
const Item = require('./item');

beforeEach(() => {
  // Clear the items array before each test
  items.length = 0;
});

afterEach(() => {
  items.length = 0; // Clear the items array after each test
});

describe('GET /items', () => {
  test('should return an empty array when no items are present', async () => {
    const response = await request(app).get('/items');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('should return all items in the array', async () => {
    items.push(new Item('popsicle', 1.45));
    items.push(new Item('cheerios', 3.40));
  
    const response = await request(app).get('/items');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { name: 'popsicle', price: 1.45 },
      { name: 'cheerios', price: 3.40 },
    ]);
  });  
});

describe('POST /items', () => {
  test('should add a new item to the array', async () => {
    const newItem = { name: 'popsicle', price: 1.45 };
  
    const response = await request(app)
      .post('/items')
      .send(newItem);
  
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ added: newItem });
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(newItem);
  });
});

describe('GET /items/:name', () => {
  test('should return the item with the given name', async () => {
    items.push(new Item('popsicle', 1.45));

    const response = await request(app).get('/items/popsicle');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: 'popsicle', price: 1.45 });
  });

  test('should return 404 error when item not found', async () => {
    const response = await request(app).get('/items/nonexistent');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Item not found' });
  });
});

describe('PATCH /items/:name', () => {
  test('should update the item with the given name', async () => {
    items.push(new Item('popsicle', 1.45));

    const updatedItem = { name: 'new popsicle', price: 2.45 };

    const response = await request(app)
      .patch('/items/popsicle')
      .send(updatedItem);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ updated: updatedItem });

    const item = items[0];
    expect(item.name).toBe('new popsicle');
    expect(item.price).toBe(2.45);
  });

  test('should return 404 error when item not found', async () => {
    const response = await request(app)
      .patch('/items/nonexistent')
      .send({ name: 'new item', price: 1.99 });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Item not found' });
  });
});

describe('DELETE /items/:name', () => {
  test('should delete the item with the given name', async () => {
    items.push(new Item('popsicle', 1.45));
  
    const response = await request(app).delete('/items/popsicle');
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Deleted' });
    expect(items.length).toBe(0);
  });  

  test('should return 404 error when item not found', async () => {
    const response = await request(app).delete('/items/nonexistent');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Item not found' });
  });
});
