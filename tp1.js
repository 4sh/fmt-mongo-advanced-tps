// Récupérer les paniers pour contenant le produit 0757100810837 et ne conserver que ces lignes en résultat.
db.getCollection("baskets").find({"products.product._id": "0757100810837"}, {"products.$": 1})


// Pour tous les paniers, récupérer uniquement les lignes concernant les produits de type CLOTHES.
db.getCollection("baskets").find({}, {"products": {$elemMatch: {type: "CLOTHES"}}})


// Pour chaque produit, projeter son nom et un nouveau champ isExpensive indiquant si le prix unitaire
// du produit dépasse 10.
db.getCollection("products").find({}, {isExpensive: {$gt: ["$unitPrice", 10]}, unitPrice: 1})
