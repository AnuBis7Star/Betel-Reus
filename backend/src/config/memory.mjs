import { randomUUID } from "node:crypto";

const memory = {
  books: [
    { id: randomUUID(), title: "Viața condusă de scopuri", author: "Rick Warren", category: "General", language: "ro", stock: 4, reserved: 0, price: 12.5 },
    { id: randomUUID(), title: "Creștinul autentic", author: "John Stott", category: "General", language: "ro", stock: 2, reserved: 0, price: 9.99 },
    { id: randomUUID(), title: "Rugăciunea", author: "Timothy Keller", category: "General", language: "ro", stock: 1, reserved: 0, price: 14 },
    { id: randomUUID(), title: "Biblia pentru copii", author: "Resurse familie", category: "Copii", language: "ro", stock: 6, reserved: 0, price: 18 }
  ],
  orders: [],
  events: [
    {
      id: randomUUID(),
      date: "2026-06-14",
      time: "10:00",
      location: "Carrer de Terrassa, 33, Reus",
      category: "Serviciu divin",
      accentColor: "#003a5a",
      published: true,
      featured: false,
      titleRo: "Botez nou testamental",
      shortDescriptionRo: "Serviciu special de botez la Biserica Betel Reus.",
      fullDescriptionRo: "Te invităm duminică, 14 iunie 2026, la ora 10:00, la un serviciu special de botez nou testamental la Biserica Betel Reus. «Căci, dacă este cineva în Hristos, este o făptură nouă. Cele vechi s-au dus, iată că toate lucrurile s-au făcut noi.» 2 Corinteni 5:17",
      posterRo: "/assets/botez2026.jpeg",
      titleEs: "Bautismo nuevo testamentario",
      shortDescriptionEs: "Culto especial de bautismo en la Iglesia Betel Reus.",
      fullDescriptionEs: "Te invitamos el domingo 14 de junio de 2026, a las 10:00, a un culto especial de bautismo nuevo testamentario en la Iglesia Betel Reus. «De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.» 2 Corintios 5:17",
      posterEs: "/assets/botez2026.jpeg",
      createdAt: "2026-06-02T00:00:00.000Z",
      updatedAt: "2026-06-02T00:00:00.000Z"
    }
  ],
  volleyRegistrations: [],
  auditLogs: [],
  volleyTournamentStates: {}
};

export { memory };
