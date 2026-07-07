

const fs = require('fs');
const path = require('path');

function createStore(filename) {
  const filePath = path.join(__dirname, filename);
  let cache = null;

  function readAll() {
    if (cache !== null) return cache;
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      cache = JSON.parse(raw || '[]');
    } catch (err) {
      cache = [];
    }
    return cache;
  }

  function writeAll(items) {
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
    cache = items;
  }

  return {
    getAll(sortNewestFirst = true) {
      const items = readAll().slice();
      if (sortNewestFirst) {
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      return items;
    },

    getById(id) {
      return readAll().find((item) => item.id === id);
    },

    add(item) {
      const items = readAll().slice();
      const newItem = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        createdAt: new Date().toISOString(),
        ...item,
      };
      items.push(newItem);
      writeAll(items);
      return newItem;
    },

    update(id, changes) {
      const items = readAll().slice();
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return null;
      items[index] = { ...items[index], ...changes };
      writeAll(items);
      return items[index];
    },

    remove(id) {
      const items = readAll().filter((item) => item.id !== id);
      writeAll(items);
    },
  };
}

module.exports = createStore;
