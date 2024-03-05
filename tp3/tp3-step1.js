// Lancer cette requête pour créer un nouveau client.
var customer = {
    "_id" : ObjectId("65e6d7ebd48351485442b5a6"),
    "firstName" : "Eli",
    "lastName" : "AZUL",
    "address" : {
        "number" : NumberInt(7),
        "streetName" : "Cours de la Marne"
    },
    "birthDate" : "1996-12-21",
    "gender" : "M"
};

db.getCollection("customers").insertOne({
    "_id" : ObjectId("65e6d7ebd48351485442b5a6"),
    "firstName" : "Eli",
    "lastName" : "AZUL",
    "address" : {
        "number" : NumberInt(7),
        "streetName" : "Cours de la Marne"
    },
    "birthDate" : "1996-12-21",
    "gender" : "M"
})


// Ajouter un produit dans le panier du client Eli AZUL pour le magasin "Magasin de Paris".
// Le panier n’existe pas, mais on souhaite faire une requête de mise à jour (update) et non pas d’insertion (insert).
// La requête doit donc gérer le cas du panier non existant.
// Pour rappel, voici le schéma d'un panier :
// {
//     "_id" : ObjectId,
//     "products" : [
//         {
//             "product" : {
//                 "_id" : String,
//                 "unitPrice" : Number,
//                 "name" : String,
//                 "type" : String
//             },
//             "quantity" : Number,
//             "totalPrice" : Number
//         },
//         ...
//     ],
//     "totalPrice": Number,
//     "customer" : {
//         "_id" : ObjectId,
//         "firstName" : String,
//         "lastName" : String
//     },
//     "store" : {
//         "_id" : ObjectId,
//         "name" : String
//     },
//     "creationDate" : ISODate,
//     "lastEditionDate" : ISODate,
//     "lastViewingDate" : ISODate
// }
var store = db.getCollection("stores").findOne({"name": "Magasin de Paris"});
// Récupération aléatoire d'un produit.
var product = db.getCollection("products").aggregate([{ $sample: { size: 1 } }]).toArray()[0];

db.baskets.updateOne(
   // TODO
)

// Contrôler qu'il n'y a qu'un seul résultat et qu'il contient bien tout ce qui est attendu.
db.baskets.find({"customer._id": customer._id, "store._id": store._id})

// Récupération aléatoire d'un produit.
var product2 = db.getCollection("products").aggregate([{ $sample: { size: 1 } }]).toArray()[0];

// Relancer la requête précédente avec le produit 2 pour l'ajouter au panier.
// Ne pas hésiter à multiplier les mises à jour, pour le plaisir de voir votre requête marcher :-)



// Bonus
// Le panier a maintenant plusieurs produits.
// Supprimer 1 produits du panier en prenant soin de mettre à jour les champs totalPrice, lastEditionDate et lastViewingDate.
db.baskets.updateOne(
    // TODO
)