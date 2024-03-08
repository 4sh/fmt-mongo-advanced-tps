const store = db.stores.aggregate([{$sample: {size: 1}}]).toArray()[0];

// La requête suivante est trop lente. L'executer pour mesurer son temps d'execution.
db.getCollection("invoices")
    .find({"lines.product.name": /^Le.*/, "store._id": ObjectId("65e1acb9353339330f148376")})
    .sort({"lines.product.name": 1})

// Créer l'index qui permet d'améliorer la requête précédente et vérifier que l'execution de cette dernière est plus rapide.
db.getCollection("invoices").createIndex({"store._id": 1, "lines.product.name": 1})
