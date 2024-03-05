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
        // TODO
    ]
)

// Affichage du panier après sa mise à jour.
print("After update");
print(db.getCollection("baskets").findOne({_id: basketWithBookAndVegetable._id}));

