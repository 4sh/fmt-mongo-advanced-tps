// Voici une requête :
db.products.find({type: "CLOTHES"}).sort({name: 1});

// Un index possible pour cette requête est :
db.products.createIndex({type: 1, name: 1})

// Imaginons que cette requête soit systématiquement lancée avec le type "CLOTHES".
// Quelle optimisation pourrait être apportée ?

db.products.createIndex({type: 1, name: 1}, {name: 'type_1_name_1_on_CLOTHES', partialFilterExpression: {type: 'CLOTHES'}})

// Regardons la taille des index
db.products.stats().indexSizes