// Cette partie est un bonus, permettant à ceux qui ont de l'avance de pratiquer.
// Il est possible que vous ayez besoin de choses que nous n'avons pas encore vu ou que vous ne connaissez pas,
// auquel cas il ne faut pas hésiter à consulter la documentation de Mongo.


// Écrire une requête permettant de récupérer uniquement les paniers contenant au moins 10 produits.
db.getCollection("baskets").find({
    $expr: {
        $gte: [{$sum: "$products.quantity"}, 10]
    }
});


// Écrire une requête qui, pour chaque panier contenant au moins 1 légume, le retourne avec seulement
// les lignes concernant les légumes.
db.getCollection("baskets").find(
    // Query
    {"products.product.type": "VEGETABLE"},
    // Projection
    {
        products: {
            // Utilisation de l'aggrégation et de l'opérateur $filter pour filtrer un tableau.
            $filter: {
                input: "$products",
                as: "item",
                cond: {
                    $eq: ["$$item.product.type", "VEGETABLE"]
                }
            }
        }
    }
);


// Écrire une requête permettant d’indiquer s’il existe une facture comportant exactement 3 lignes,
// dont une concernant exactement 74 vêtements pour un prix d’au moins 2000€. La requête ne doit pas prendre plus de 300ms.
db.getCollection("invoices").countDocuments({
        $and: [
            {lines: {$size: 3}},
            {lines: {$elemMatch: {"product.type": "CLOTHES", quantity: 74, totalPrice: {$gt: 2000}}}}
        ]
    },
    // Très important, on se fiche du nombre exact de résultat. On veut juste savoir s'il en existe 1.
    {limit: 1, maxTimeMS: 300}
);
