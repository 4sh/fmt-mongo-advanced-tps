// Les factures portent une notion de droit de visibilité via les champs _right dans le document et certains sous-objets.
// Écrire une requête permettant de prendre en compte cette notion de droit, grâce à $redact,
// en respectant les règles (exemple concret sur le slide suivant) :
// - si le champ _right est absent ou null alors le document auquel il appartient est visible de tous,
// mais il faudra quand même vérifier que les sous-niveaux sont visibles ou non.
// - si le champ supérieur ou égal à 0, alors seul quelqu’un ayant un droit supérieur ou égal pourra
//   voir l’objet dans lequel est présent ce droit.

// Dans le support de TP, vous trouverez des exemples de ce qui est attendu.

var currentUserRight = 0;

db.getCollection("invoices").aggregate([

])


// Bonus
// Enrichir la requête précédente, afin de ne voir que les 2 lignes de facturation les plus importantes de la facture.
currentUserRight = 2;

db.getCollection("invoices").aggregate([

])
