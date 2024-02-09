print(
    db.baskets.find({
        products:
            {
                $elemMatch: {'quantity': 2, 'product.name': 'Des fleurs pour Algernon'}
            }
    })
);