db.products.find({price: {$lt: 30}}, {price: -1, name: 1}).sort({name: 1})

// Essayez de deviner les différentes étapes qui vont être retenues par Mongo pour traiter cette requête.
// COLLSCAN
// PROJECTION
// SORT

// Récupérez le winning plan de Mongo et comparez avec votre supposition.
db.products.explain().find({price: {$lt: 30}}, {price: -1, name: 1}).sort({name: 1})
// COLLSCAN
// PROJECTION_SIMPLE
// SORT


// Que faire pour améliorer les choses ?
db.products.createIndex({price: -1, name: 1})


// Essayez de deviner les différentes étapes qui vont être retenus par Mongo pour traiter la requête suite à vos améliorations.
// IDXSCAN
// SORT via l'index
// FETCH
// PROJECTION


// Vérifiez que le winning plan est amélioré.
db.products.explain().find({price: {$lt: 30}}, {price: -1, name: 1}).sort({name: 1})
// IDXSCAN
// SORT via l'index
// FETCH
// PROJECTION