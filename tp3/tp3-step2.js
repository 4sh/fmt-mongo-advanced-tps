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
        $mul: {
            "products.$[].totalPrice": 1.1,
            "products.$[].product.unitPrice": 1.1,
            "totalPrice": 1.1
        },
        $currentDate: {
            lastEditionDate: true
        },
    }
)

// Affichage du panier après sa mise à jour.
print("After update");
print(db.getCollection("baskets").findOne({_id: basket._id}));



// Sur un autre panier, contenant des livres et des légumes, diminuer le prix des livres de 10%, en utilisant l’opérateur $.
// Note : le prix total du panier ne pourra pas être mis à jour en conséquence !
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
    {
        $mul: {
            "products.$.totalPrice": 0.9,
            "products.$.product.unitPrice": 0.9
        },
        $currentDate: {
            lastEditionDate: true
        },
    }
)

// Affichage du panier après sa mise à jour.
print("After update");
print(db.getCollection("baskets").findOne({_id: basketWithBookAndVegetable._id}));



// Bonus :
// Écrire la requête précédente en utilisant l’opérateur $[<id>]
// Note : le prix total du panier ne pourra pas être mis à jour en conséquence !

// Affichage du panier avant sa mise à jour.
print(basketWithBookAndVegetable);

db.baskets.updateOne(
    {
        _id: basketWithBookAndVegetable._id
    },
    {
        $mul: {
            "products.$[bookFilter].totalPrice": 0.9,
            "products.$[bookFilter].product.unitPrice": 0.9
        },
        $currentDate: {
            lastEditionDate: true
        },
    },
    {
        arrayFilters: [
            {
                "bookFilter.product.type": "BOOK"
            }
        ]
    }
)

// Affichage du panier après sa mise à jour.
print("After update");
print(db.getCollection("baskets").findOne({_id: basketWithBookAndVegetable._id}));
