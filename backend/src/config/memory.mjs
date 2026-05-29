import { randomUUID } from "node:crypto";

const memory = {
  books: [
    { id: randomUUID(), title: "Viața condusă de scopuri", author: "Rick Warren", category: "General", language: "ro", stock: 4, reserved: 0, price: 12.5 },
    { id: randomUUID(), title: "Creștinul autentic", author: "John Stott", category: "General", language: "ro", stock: 2, reserved: 0, price: 9.99 },
    { id: randomUUID(), title: "Rugăciunea", author: "Timothy Keller", category: "General", language: "ro", stock: 1, reserved: 0, price: 14 },
    { id: randomUUID(), title: "Biblia pentru copii", author: "Resurse familie", category: "Copii", language: "ro", stock: 6, reserved: 0, price: 18 }
  ],
  orders: [],
  events: [],
  volleyRegistrations: [],
  auditLogs: []
};

export { memory };
