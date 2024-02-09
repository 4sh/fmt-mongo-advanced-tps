print(
    db.baskets.find({
        products:
            {
                $elemMatch: {'quantity': 2, 'product.name': 'Des fleurs pour Algernon'}
            }
    })
);

print(
    db.baskets.find({
        $and: [
            {'products': {$elemMatch: {'quantity': {$gte: 3}, 'product.name': 'Kafka sur le rivage'}}},
            {'products': {$elemMatch: {'quantity': {$gte: 2}, 'product.name': 'Fleur de Zeppelin'}}}
        ]
    })
);