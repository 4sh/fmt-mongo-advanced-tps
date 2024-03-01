// Les factures portent une notion de droit de visibilité via les champs _right dans le document et certains sous-objets.
// Écrire une requête permettant de prendre en compte cette notion de droit, grâce à $redact,
// en respectant les règles (exemple concret sur le slide suivant) :
// - si le champ _right est absent ou null alors le document auquel il appartient est visible de tous,
//   mais il faut s’assurer que les sous-objets sont visibles également
// - si le champ supérieur ou égal à 0, alors seul quelqu’un ayant un droit supérieur ou égal pourra
//   voir l’objet dans lequel est présent ce droit.
var currentUserRight = 0;

db.getCollection("invoices").aggregate([
    {
        $redact: {
            $cond: {
                if: {$gte: [currentUserRight , "$_right" ]},
                then: "$$DESCEND",
                else: "$$PRUNE"
            }
        }
    }
])


// Bonus
// Enrichir la requête précédente, afin de ne voir que les 2 lignes de facturation le plus important de la facture.
currentUserRight = 2;

db.getCollection("invoices").aggregate([
    {
        $redact: {
            $cond: {
                if: {$gte: [currentUserRight , "$_right" ]},
                then: "$$DESCEND",
                else: "$$PRUNE"
            }
        }
    },
    // Surcharge du champ lines existant
    {
        $addFields: {
            lines: {
                // N'étant pas dans une opération de groupement, on ne peut pas utiliser $topN
                // $firstN sur le tableau trié permet de s'en sortir
                $firstN: {
                    n: 2,
                    input: {
                        $sortArray: {
                            input: "$lines",
                            sortBy: {totalPrice: -1}
                        }
                    }
                }
            }
        }
    }
])