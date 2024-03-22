// Tous les produits dont la description contient le mot “fleur” puis le mot “ouvrage” (2 documents attendus)
db.products.find({
    description: {$regex: /fleur.*ouvrage/, $options: 's'}
})

// Tous les produits dont le nom contient “image”, quelle que soit la casse (6 documents attendus)
db.products.find({
    name: /image/i
})

// Tous les produits dont la description contient le mot “livre” puis le mot “fleur”, quelle que soit la casse (3 documents attendus)
db.products.find({
    description: {$regex: /livre.*fleur/, $options: 'is'}
})

// Bonus
// Tous les produits dont une des lignes de la description commence par “Les” (2 documents attendus)
db.products.find({
    description: /^Les/m
})
