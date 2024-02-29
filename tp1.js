// Certains ISBN10 de livres sont stockés sous la forme de nombre alors qu’ils devraient être des string.
// Faire une requête pour trouver les documents correspondants.
db.products.find({'properties.isbn10': {$exists: true}, $expr: {$isNumber: '$properties.isbn10'}})


// On aimerait étudier la saisonnalité des ventes des magasins.
// Faire une requête pour trouver toutes les factures émises lors d’un mois de janvier.
db.invoices.find({$expr: {$eq: [1, {$month: '$date'}]}})


// Un magasin a des quantités minimales pour chaque produit dans son inventaire.
// Faire une requête pour trouver toutes les lignes d’inventaire pour lesquelles une commande devrait être faite.
db.inventories.find({$expr: {$lt: ['$quantity', '$minimalQuantity']}})


// Une nouvelle réglementation vient d’être dévoilée :
// tous les magasins qui ont des étages de plus de 100 mètres carrés doivent fermer.
// Faire une requête pour trouver les magasins qui vont devoir fermer.
db.stores.find({$expr: {$gt: [{$divide: ['$sizeInSquareMeters', '$floorsNumber']}, 100]}})


// Bonus
// On voudrait déstocker les produits présents en trop grande quantité dans les inventaires des magasins.
// Les réductions que l’on souhaite appliquer sont les suivantes :
//   - si le produit est présent en plus de 100 exemplaires, le prix réduit est le prix initial multiplié par 0.5
//   - sinon, le prix réduit est le prix initial multiplié par 0.75
// 	Avant d’appliquer ces réductions, on souhaite trouver les entrées d’inventaire qui auraient des prix plus faibles que 5.
// 	Faire une requête pour les trouver.
db.inventories.find({
    $expr: {
        $lt: [{
            $cond: {
                if: {$gte: ['$quantity', 100]},
                then: {$multiply: ['$price.unitPrice', 0.5]},
                else: {$multiply: ['$price.unitPrice', 0.75]}
            }
        }, 5]
    }
})