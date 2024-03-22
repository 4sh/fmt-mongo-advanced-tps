// Récupération aléatoire d'un panier
const basket = db.getCollection("baskets").aggregate([{ $sample: { size: 1 } }]).toArray()[0];

// Affichage du panier avant sa mise à jour.
print(basket);

// Mettre à jour le panier en augmentant tous les prix de 10%.
db.baskets.updateOne(
    {
        _id: basket._id
    },
    {
       // TODO
    }
)

// Affichage du panier après sa mise à jour.
print("After update");
print(db.getCollection("baskets").findOne({_id: basket._id}));



// Sur un autre panier, contenant des livres et des légumes, diminuer le prix des livres de 10%.
// Note : le prix total du panier ne pourra pas être mis à jour en conséquence !
const basketWithBookAndVegetable = db.getCollection("baskets").aggregate([
    {$match: {$and: [{"products.product.type": "BOOK"}, {"products.product.type": "VEGETABLE"}]}},
    {$sample: {size: 1}}
]).toArray()[0];


// Affichage du panier avant sa mise à jour.
print(basketWithBookAndVegetable);

db.baskets.updateOne(
    {
        _id: basketWithBookAndVegetable._id
    },
    {
        // TODO
    }
)

// Affichage du panier après sa mise à jour.
print("After update");
print(db.getCollection("baskets").findOne({_id: basketWithBookAndVegetable._id}));
