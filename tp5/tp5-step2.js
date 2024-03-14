db.products.createIndex({type: 1, unitPrice: 1})
db.products.aggregate([
    {$match: {type: {$in: ["BOOK", "CLOTHES"]}}},
    {$group: {_id: "$type", nb: {$sum: 1}, averagePrice: {$avg: "$unitPrice"}}}
])

// D'après-vous quelles étapes Mongo va-t-il suivre ?
// TODO

// Vérifiez le winning plan
// TODO


// Vérifiez maintenant ce qui est réellement executé.
// TODO
