// Le code suivant permet de mettre à jour le prix d'un produit et d'impacter tous les paniers en conséquence.
// Cependant, si Mongo tombe en plein milieu du traitement, il va y avoir une incohérence car les paniers ne vendront
// pas le produit au bon prix.
// Corriger cette situation en assurant que les paniers seront mis à jour si le produit l'est grâce à une transaction.
// En cas d'erreur pendant le traitement, on souhaite revenir à l'état initial.

const session = db.getMongo().startSession({readPreference: { mode: "primary" }});

session.startTransaction( {
    readConcern: { level: "majority" },
    writeConcern: { w: "majority" }
});

const productId = session.getDatabase("formation-mongo").products.findOne({'properties.isbn10': '2295012880'}, {_id: 1})._id;
const newPrice = 20;

session.getDatabase("formation-mongo").products.updateOne(
    {_id: productId},
    {
        $set: {
            unitPrice: newPrice
        }
    }
);

session.getDatabase("formation-mongo").baskets.updateMany(
    {
        "products.product._id": productId
    },
    [
        {
            $addFields: {
                products: {
                    $map: {
                        input: "$products",
                        in: {
                            $cond: {
                                if: {$eq: ["$$this.product._id", productId]},
                                then: {
                                    $mergeObjects: ["$$this", {
                                        // Mise à jour du prix unitaire sur le produit
                                        product: {$mergeObjects: ["$$this.product", {unitPrice: newPrice}]},
                                        totalPrice: {$multiply: ["$$this.quantity", newPrice]}
                                    }]
                                },
                                else: "$$this"
                            }
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                totalPrice: {
                    $sum: {
                        $map: {
                            input: "$products",
                            in: "$$this.totalPrice"
                        }
                    }
                },
                lastEditionDate: new ISODate()
            }
        }
    ]
);

session.commitTransaction();
session.endSession();


// Maintenant que le code est sur, faire l'essai de le lancer sans terminer la transaction. Lancer le même code dans un
// nouvel onglet et constater que la transaction est en erreur car elle cherche à modifier un document qui est déjà en
// cours de modification (dans la 1ère transaction, qui n'est pas terminée).

// Mettre fin à la 1ère transaction. Dans le 2ème onglet, relancer le code et constater que maintenant tout se passe
// bien, car la 1ère transaction ne bloque plus (étant terminée).
