// Récupérer les paniers pour contenant le produit "Les fleurs du mal" et ne conserver qu'une ligne en résultat.
db.getCollection("baskets").find({"products.product.name": "Les fleurs du mal"}, {"products.$": 1})


// Pour tous les paniers, récupérer uniquement 1 ligne concernant un produit de type CLOTHES.
db.getCollection("baskets").find({}, {"products": {$elemMatch: {"product.type": "CLOTHES"}}})


// Pour chaque produit, projeter son nom et un nouveau champ isExpensive indiquant si le prix unitaire
// du produit dépasse 10.
db.getCollection("products").find({}, {name: 1, isExpensive: {$gt: ["$unitPrice", 10]}})

