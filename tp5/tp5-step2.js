db.products.createIndex({type: 1, unitPrice: 1})
db.products.aggregate([
    {$match: {type: {$in: ["BOOK", "CLOTHES"]}}},
    {$group: {_id: "$type", nb: {$sum: 1}, averagePrice: {$avg: "$unitPrice"}}}
])

// D'après-vous quelles étapes Mongo va-t-il suivre ?
// IDXSCAN
// GROUP

// Vérifiez le winning plan
db.products.explain().aggregate([
    {$match: {type: {$in: ["BOOK", "CLOTHES"]}}},
    {$group: {_id: "$type", nb: {$sum: 1}, averagePrice: {$avg: "$unitPrice"}}}
])
// IDXSCAN
// PROJECTION_COVERED
// GROUP


// Vérifiez maintenant ce qui est réellement executé.
db.products.explain("executionStats").aggregate([
    {$match: {type: {$in: ["BOOK", "CLOTHES"]}}},
    {$group: {_id: "$type", nb: {$sum: 1}, averagePrice: {$avg: "$unitPrice"}}}
])
// Les étapes indiquées par le moteur d'execution slot-based :
// branch(ixscan_generic, nlj(ixseek))
// project
// group
// project
// mkbson
// Comme indiqué, ces types ne sont pas documentés et il est donc compliqué de comprendre ce qui est fait.
// Néanmoins, ce moteur est utilisé pour optimiser des requêtes par rapport au moteur classique et nous ne pouvons
// pas forcer l'usage d'un moteur plutôt qu'un autre. On ne peut donc que faire confiance à Mongo.

// On notera qu'il n'y a pas eu de lecture sur disque. Notre requête est totalement couverte par l'index.
