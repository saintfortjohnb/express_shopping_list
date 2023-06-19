const items = require("./fakeDb");

class Item {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  static findAll() {
    return items;
  }

  static update(name, data) {
    let foundItem = Item.find(name);
    if (foundItem === undefined) {
      throw { message: "Not Found", status: 404 };
    }
    foundItem.name = data.name;
    foundItem.price = data.price;

    return foundItem;
  }

  static find(name) {
    const foundItem = items.find((v) => v.name === name);
    if (foundItem === undefined) {
      throw { message: "Not Found", status: 404 };
    }
    return foundItem;
  }

  static remove(name) {
    let foundIdx = items.findIndex((v) => v.name === name);
    if (foundIdx === -1) {
      throw { message: "Not Found", status: 404 };
    }
    items.splice(foundIdx, 1);
  }
}

module.exports = Item;
