// Écrire une requête pour trouver tous les paniers qui contiennent deux exemplaires
// du livre Des fleurs pour Algernon
db.baskets.find({
    products:
        {
            $elemMatch: {'quantity': 2, 'product.name': 'Des fleurs pour Algernon'}
        }
    }
);


// Écrire une requête pour trouver tous les paniers qui contiennent
// au moins 3 exemplaires de Kafka sur le rivage et au moins 2 exemplaires de Fleur de Zeppelin
db.baskets.find({
    $and: [
        {'products': {$elemMatch: {'quantity': {$gte: 3}, 'product.name': 'Kafka sur le rivage'}}},
        {'products': {$elemMatch: {'quantity': {$gte: 2}, 'product.name': 'Fleur de Zeppelin'}}}
    ]
})

// Il est également possible d'écrire avec cette syntaxe
db.baskets.find({
    products: {
        $all: [
            {$elemMatch: {'quantity': {$gte: 3}, 'product.name': 'Kafka sur le rivage'}},
            {$elemMatch: {'quantity': {$gte: 2}, 'product.name': 'Fleur de Zeppelin'}}
        ]
    }
})


// Bonus
// Écrire une requête pour trouver tous les paniers qui contiennent au moins un livre
// dont le titre contient “fleur”, quelle que soit la casse, en 5 exemplaires
db.baskets.find({
    'products': {$elemMatch: {
      'product.name': /fleur/i,
      quantity: 5
    }}
})