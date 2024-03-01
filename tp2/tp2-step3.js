// Écrire une requête qui permet de faire la jointure entre le magasin “Magasin de Paris” et son inventaire.
db.getCollection("stores").aggregate([
    {$match: {name: "Magasin de Paris"}},
    {
        $lookup: {
            from: "inventories",
            localField: "_id",
            foreignField: "storeRef",
            as: "inventories"
        }
    }
])


// Stocker le résultat de la requête précédente dans une nouvelle collection (nommage au choix)
db.getCollection("stores").aggregate([
    {
        $lookup: {
            from: "inventories",
            localField: "_id",
            foreignField: "storeRef",
            pipeline: [
                {$project: {_id: 0, productRef: "$product.eanNumber", quantity: 1}}
            ],
            as: "inventories",
        }
    },
    {$out: "storesWithInventories"}
])


// Requêter dans cette nouvelle collection.
db.getCollection("storesWithInventories").find({})
