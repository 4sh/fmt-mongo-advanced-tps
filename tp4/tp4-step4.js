// Voici une requête :
db.getCollection("products").find({$or: [{name: /.*livre.*/i}, {description: /.*livre.*/i}]})

// Quelle amélioration pourrait être apportée ?

// TODO


// Maintenant que le problème de performance est corrigé, l’équipe marketing demande à ce que la recherche renvoie la
// pertinence de chaque résultat, en considérant que le champ nom est 3 fois plus important que le celui de la description.

// TODO


// Bonus
// L'équipe marketing a oublié de préciser qu'il est nécessaire de trier les résultats par pertinence

// TODO