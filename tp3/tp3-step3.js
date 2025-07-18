// Sur un panier pris au hasard, contenant des livres et des légumes, diminuer le prix des livres de 10%
// et mettre à jour le prix total du panier.
const basketWithBookAndVegetable = db.getCollection("baskets").aggregate([
    {$match: {$and: [{"products.product.type": "BOOK"}, {"products.product.type": "VEGETABLE"}]}},
    {$sample: {size: 1}}
]).toArray()[0];

// Affichage du panier avant sa mise à jour.
print(basketWithBookAndVegetable);

db.baskets.updateOne(
    {
        _id: basketWithBookAndVegetable._id,
        "products.product.type": "BOOK"
    },
    [
        // On va commencer par mettre à jour les produits
        {$addFields: {
            products: {
                // Production d'un tableau de lignes mis à jour
                $map: {
                    input: "$products",
                    in: {
                        $cond: {
                            // On ne souhaite modifier que les lignes pour les livres
                            if: {$eq: ["$$this.product.type", "BOOK"]},
                            then: {
                                // On surcharge des champs de l'objet courant.
                                $mergeObjects: ["$$this", {
                                    // Mise à jour du prix unitaire sur le produit
                                    product: {$mergeObjects: ["$$this.product", {unitPrice: {$multiply: ["$$this.product.unitPrice", 0.9]}}]},
                                    // Calcul du prix total de la ligne : quantité * prix unitaire du produit * reduction
                                    // À ce stade, le prix unitaire du produit est encore l'ancien.
                                    totalPrice: {$multiply: ["$$this.quantity", "$$this.product.unitPrice", 0.9]}
                                }]
                            },
                            // Pour tout autre ligne ne concernant pas des livres, on ne change rien
                            else : "$$this"
                        }
                    }
                }
            }
        }},
        // On calcule maintenant le prix total du panier
        {$addFields: {
            // Le prix total est la somme des prix totaux de chaque ligne du panier
            totalPrice: {
                $sum: "$products.totalPrice"
            },
            // Mise à jour de la date de dernière édition
            lastEditionDate : new ISODate()
        }}
    ]
)

// Affichage du panier après sa mise à jour.
print("After update");
print(db.getCollection("baskets").findOne({_id: basketWithBookAndVegetable._id}));

