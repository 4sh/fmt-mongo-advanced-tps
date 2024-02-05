print(
    db.products.find({'properties.isbn10': {$exists: true}, $expr: {$isNumber: '$properties.isbn10'}})
);

print(
    db.invoices.find({$expr: {$eq: [1, {$month: '$date'}]}})
);

print(
    db.inventories.find({$expr: {$lt: ['$quantity', '$minimalQuantity']}})
);

print(
    db.inventories.find({
        $expr: {
            $lt: [{
                $cond: {
                    if: {$gte: ['$quantity', 100]},
                    then: {$multiply: ['$price.unitPrice', 0.5]},
                    else: {$multiply: ['$price.unitPrice', 0.75]}
                }
            }, 5]
        }
    })
);

print(
    db.baskets.find({
        $expr: {
            $lt: [
                15,
                {
                    $reduce: {
                        input: '$products',
                        initialValue: 0,
                        in: {$add: ['$$value', '$$this.quantity']}
                    }
                }
            ]
        }
    })
);

print(
    db.stores.find({$expr: {$gt: [{$divide: ['$sizeInSquareMeters', '$floorsNumber']}, 100]}})
);

