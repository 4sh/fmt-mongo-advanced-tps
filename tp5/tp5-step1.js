db.products.find({type: "BOOK", unitPrice: {$lt: 30}}, {unitPrice: -1, name: 1}).sort({name: 1})

// Essayez de deviner les différentes étapes qui vont être retenues par Mongo pour traiter cette requête.
// COLLSCAN
// PROJECTION
// SORT

// Récupérez le winning plan de Mongo et comparez avec votre supposition.
db.products.explain().find({type: "BOOK", unitPrice: {$lt: 30}}, {unitPrice: -1, name: 1}).sort({name: 1})
// COLLSCAN
// PROJECTION_SIMPLE
// SORT


// Que faire pour améliorer les choses ?
db.products.createIndex({type: 1, name: 1, unitPrice: -1, _id: 1})


// Essayez de deviner les différentes étapes qui vont être retenus par Mongo pour traiter la requête suite à vos améliorations.
// IXSCAN
// PROJECTION_COVERED


// Vérifiez que le winning plan est amélioré.
db.products.explain().find({type: "BOOK", unitPrice: {$lt: 30}}, {unitPrice: -1, name: 1}).sort({name: 1})
// IXSCAN
// PROJECTION_COVERED