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
// On souhaite que les produits du panier soient triés par ordre alphabétique.
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
    // Filtre sur les données permettant de récupérer le bon panier, s'il existe
    {
        "customer._id": customer._id,
        "store._id": store._id
    },
    {
        // Ajout du produit dans le panier, en conservant un tableau trié sur le nom du produit.
        $push: {
            products: {
                $each: [
                    {
                        product: {
                            _id: product._id,
                            unitPrice: product.unitPrice,
                            name: product.name,
                            type: product.type
                        },
                        quantity: 1,
                        totalPrice: product.unitPrice
                    }
                ],
                $sort: {"product.name": 1}
            }},
        // Mise à jour du montant total du panier.
        $inc: {
            totalPrice: product.unitPrice
        },
        // Mise à jour des dates d'édition et de consultation.
        $currentDate: {
            lastEditionDate: true,
            lastViewingDate: true
        },
        // Définition des champs à initialiser en cas d'upsert.
        $setOnInsert: {
            creationDate: new ISODate(),
            customer: {
                _id: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName
            },
            store: {
                _id : store._id,
                name : store.name
            }
        }
    },
    // Activation de l'upsert. Si le panier n'existe pas alors il sera créé sur la base des éléments contenus dans
    // l'ensemble de la requête.
    {upsert: true}
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
    // Filtre sur les données permettant de récupérer le bon panier, s'il existe
    {
        "customer._id": customer._id,
        "store._id": store._id
    },
    {
        // Suppression du produit dans le panier
        $pull: {
            products: {"product._id": product2._id}
        },
        // Mise à jour du montant total du panier. On fait simple en connaissant le montant que l'on doit enlever.
        $inc: {
            totalPrice: 0 - product2.unitPrice
        },
        // Mise à jour des dates d'édition et de consultation.
        $currentDate: {
            lastEditionDate: true,
            lastViewingDate: true
        }
    }
)
