// Suite à des problèmes de performance sur la recherche de produits, des requêtes suivantes ressortent
// // comme étant particulièrement lentes. Voici quelques exemples.
// // Quelle solution pourrait être pertinente pour adresser cette problèmatique ?

db.products.find({type: "CLOTHES", "properties.size": "XL"})
db.products.find({type: "CLOTHES", "properties.color": "RED"})
db.products.find({type: "CLOTHES", "properties.origin": "France"})
db.products.find({type: "VEGETABLE", "properties.origin": "France"})
db.products.find({type: "VEGETABLE", "properties.isBio": true})
db.products.find({type: "BOOK", "properties.isbn10": "2359903055"})
db.products.find({type: "BOOK", "properties.author": "Dan Gookin"})


// TODO