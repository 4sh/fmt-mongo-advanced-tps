// Voir l'énoncé après la déclaration des produits
const product1 = {
    "_id" : "9876543210001",
    "properties" : {},
    "unitPrice" : 150,
    "name" : "Couteau de chef",
    "type" : "TOOL",
    "language" : "FR",
    "description" : "Couteau de chef, gamme supérieure"
};

const product2 = {
    "_id" : "9876543210002",
    "properties" : {},
    "unitPrice" : 15,
    "name" : "Louche",
    "type" : "TOOL",
    "language" : "FR",
    "description" : "Louche large, en inox"
};

const product3 = {
    "_id" : "9876543210003",
    "properties" : {},
    "unitPrice" : 20,
    "name" : "Éplucheur",
    "type" : "TOOL",
    "language" : "FR",
    "description" : "Éplucheur, en inox"
};

const product4 = {
    "_id" : "9876543210004",
    "properties" : {},
    "unitPrice" : 100,
    "name" : "Marteau ramponneau",
    "type" : "TOOL",
    "language" : "FR",
    "description" : "Marteau de tapissier, fabrication française"
};

const product5 = {
    "_id" : "9876543210005 ",
    "properties" : {},
    "unitPrice" : 15,
    "name" : "Alène de sellier",
    "type" : "TOOL",
    "language" : "FR",
    "description" : "Manche en buis, acier carbonne, fabrication française"
};

const product1ToRemove = db.products.aggregate([{$sample: {size: 1}}]).toArray()[0];
const product2ToRemove = db.products.aggregate([{$sample: {size: 1}}]).toArray()[0];



// Voici plusieurs opérations qu'il faut réaliser sur les produits :
// - Insérer 5 nouveaux produits : product1, product2, product3, product4 et product5.
// - Mettre à jour le prix unitaire des bouquins avec une augmentation de 10%
// - Mettre à jour le prix unitaire des légumes avec une réduction de 5%
// - Mettre une date de dernière mise à jour (lastEditionDate) sur tous les produits
// - Supprimer 2 produits (product1ToRemove et product2ToRemove)

db.products.bulkWrite([
        // Les insertions
        {insertOne: {document: product1}},
        {insertOne: {document: product2}},
        {insertOne: {document: product3}},
        {insertOne: {document: product4}},
        {insertOne: {document: product5}},

        // Mettre à jour le prix unitaire des bouquins avec une augmentation de 10%
        {
            updateMany: {
                filter: {type: "BOOK"},
                update: {
                    $mul: {unitPrice: 1.1}
                }
            }
        },

        // Mettre à jour le prix unitaire des légumes avec une réduction de 5%
        {
            updateMany: {
                filter: {type: "VEGETABLE"},
                update: {
                    $mul: {unitPrice: 0.95}
                }
            }
        },

        // Mettre une date de dernière mise à jour (lastEditionDate) sur tous les produits
        {
            updateMany: {
                filter: {},
                update: {
                    $currentDate: {lastEditionDate: true}
                }
            }
        },

        // Suppression de 2 produits
        {
            deleteOne: {
                filter: {_id: product1ToRemove._id},
            }
        },
        {
            deleteOne: {
                filter: {_id: product2ToRemove._id},
            }
        }
    ],
    // Pas besoin d'ordonner nos opérations
    {ordered: false}
)