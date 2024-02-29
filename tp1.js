// Écrire une requête triant les produits par noms avec une collation pour le français, et
// constater la différence avec le tri sans cette dernière.
db.getCollection("products").find({}).sort({name: -1})


// Enrichir la requête précédente pour s’assurer que les noms de produits commençants par un
// nombre soient triés comme des nombres.
db.getCollection("products").find({}, {}).sort({name: -1})


