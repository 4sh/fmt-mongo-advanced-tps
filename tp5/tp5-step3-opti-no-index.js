// Les index nécessaires pour nos 3 requêtes

// On peut créer un index couvrant pour la recherche des clients
// Dans ce cas, firstName et _id ne sont présents que pour satisfaire la projection. L'index est alors plus lourd, mais
// permet d'éviter un FETCH.
db.customers.createIndex({lastName: 1, firstName: 1, _id: 1});

// Pour la recherche des factures
db.invoices.createIndex({"customer._id": 1});
// Pourquoi ne pas mettre totalPrice et lines ?
// lines étant un tableau, Mongo ne pourra pas utiliser l'index pour donner les lignes d'un document
// (rappel : Mongo va créer autant d'entrées dans l'index que de lignes)
// Donc Mongo va de toute façon devoir aller chercher le document complet sur disque (FETCH).
// C'est aussi la raison pour laquelle il n'est pas nécessaire de mettre totalPrice pour satisfaire la projection
// puisque de toute façon un FETCH va être réalisé. Pas la peine d'alourdir l'index pour rien.


// Pour la recherche du panier
// On peut là aussi faire un index couvrant la requête pour éviter un FETCH.
// Selon le principe ESR, on privilégie
db.baskets.createIndex({"customer._id": 1, creationDate: -1, totalPrice: 1});


// Attention !!!!!
// Il s'agit d'un exercice basique, où le raisonnement que nous opérons se fait sur une petite portion de code.
// La méthode qui a été appliquée, à savoir créer les index permettant de couvrir les requêtes, ne peut pas toujours
// être appliquée. Il faut garder en tête, que la création d'un index n'est pas sans conséquence et qu'on est
// limité à 64 par collection.

