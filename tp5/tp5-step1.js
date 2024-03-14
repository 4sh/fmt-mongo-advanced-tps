db.products.find({price: {$lt: 30}}, {price: -1, name: 1}).sort({name: 1})

// Essayez de deviner les différentes étapes qui vont être retenues par Mongo pour traiter cette requête.
// TODO

// Récupérez le winning plan de Mongo et comparez avec votre supposition.
// TODO


// Que faire pour améliorer les choses ?
// TODO


// Essayez de deviner les différentes étapes qui vont être retenus par Mongo pour traiter la requête suite à vos améliorations.
// TODO


// Vérifiez que le winning plan est amélioré.
// TODO