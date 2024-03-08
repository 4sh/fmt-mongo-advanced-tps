// Voici une requête :
db.getCollection("products").find({$or: [{name: /.*livre.*/i}, {description: /.*livre.*/i}]})

// Quelle amélioration pourrait être apportée ?
// Solution : une recherche text et

// Création d'un index de type text
db.products.createIndex({name: "text", description: "text"}, {name: "textIndex"})

// Requêtage avec une requête de type $text
db.products.find({$text: {$search: "livre", $language: "fr", $caseSensitive: false}})

// Vérifions que le nombre de résultat est bien le même
db.getCollection("products").countDocuments({$or: [{name: /.*livre.*/i}, {description: /.*livre.*/i}]})
db.products.countDocuments({$text: {$search: "livre", $language: "fr"}})


// Maintenant que le problème de performance est corrigé, l’équipe marketing demande à ce que la recherche renvoie la
// pertinence de chaque résultat, en considérant que le champ nom est 3 fois plus important que le celui de la description.

// Suppression de l'index text. Rappel : il ne peut y en avoir qu'un seul par collection.
db.products.dropIndex("textIndex")

// Recréation de l'index avec les poids
db.products.createIndex({name: "text", description: "text"}, {name: "textIndex", weights: {name: 3, description: 1}})

// Réécriture de la requête pour projeter les poids
db.products.find({$text: {$search: "livre", $language: "fr", $caseSensitive: false}}, {_score: {$meta: "textScore"}})


// Bonus
// L'équipe marketing a oublié de préciser qu'il est nécessaire de trier les résultats par pertinence
db.products.find({$text: {$search: "livre", $language: "fr", $caseSensitive: false}}, {_score: {$meta: "textScore"}}).sort({"_score": {$meta: "textScore"}})
