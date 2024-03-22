// Récupérer les paniers contenant le produit “Les fleurs du mal” et ne conserver qu’une ligne en résultat.
db.getCollection("baskets").find({}, {})


// Pour tous les paniers, récupérer uniquement une ligne concernant un produit de type CLOTHES.
db.getCollection("baskets").find({}, {})


// Pour chaque produit, projeter son nom et un nouveau champ isExpensive indiquant si le prix unitaire
// du produit dépasse 10.
db.getCollection("products").find({}, {})