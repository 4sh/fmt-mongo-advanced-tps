// Bonus
//
// La requête suivante est lente, malgré l'index qui l'accompagne.
db.invoices.createIndex({"customer.name": 1})
db.invoices.find({}).sort({"customer.name": 1}).collation({locale: "fr"})

// Que faire pour améliorer les choses ?

// TODO