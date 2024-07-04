// Écrire une requête d’agrégation, avec $bucket, permettant de connaître, pour chaque trimestre de l’année 2023 :
// - Le chiffre d'affaires
// - Le montant moyen d’une facture
// - Le nombre de produits vendus
db.getCollection("invoices").aggregate([
    // Filtrage sur l'année 2023
    {$match: {date: {$gte: ISODate("2023-01-01T00:00:00.000+0000"), $lt: ISODate("2024-01-01T00:00:00.000+0000")}}},
    {$bucket: {
            // Le groupement se fait sur le mois, extrait de la date
            groupBy: {$month: {date: "$date"}},
            // Définition des buckets :
            // [1; 4[   -> 1er trimestre
            // [4; 7[   -> 2eme trimestre
            // [7; 10[  -> 3eme trimestre
            // [10; 13[ -> 4eme trimestre
            boundaries: [1, 4, 7, 10, 13],
            output: {
                // Le chiffre d'affaires
                totalPrice: {$sum: "$totalPrice"},
                // Le montant moyen d’une facture
                averagePrice: {$avg: "$totalPrice"},
                // Le nombre de produits vendus
                nbProducts: {$sum: {$reduce: {input: "$lines", initialValue: 0, in: {$sum: {$add: ["$$value", "$$this.quantity"]}}}}}
            }
        }
    }
])


// Bonus
// Écrire la même requête, mais sans $bucket
db.getCollection("invoices").aggregate([
    {$match: {date: {$gte: ISODate("2023-01-01T00:00:00.000+0000"), $lt: ISODate("2024-01-01T00:00:00.000+0000")}}},
    // Ajout d'un champ month, extrait de la date
    {$addFields: {month: {$month: {date: "$date"}}}},
    // Ajout d'un champ quarter désignant le trimestre, calculé grace à $switch
    {$addFields: {quarter: {
        $switch: {
            branches: [
                {case: {$lte: ["$month", 3]}, then: 1},
                {case: {$lte: ["$month", 6]}, then: 2},
                {case: {$lte: ["$month", 9]}, then: 3},
                {case: {$lte: ["$month", 12]}, then: 4}
            ]

        }}}},
    {$group: {
            // Le groupement se fait sur le champ quarter, précédemment ajouté
            _id: "$quarter",
            // Le chiffre d'affaires
            totalPrice: {$sum: "$totalPrice"},
            // Le montant moyen d’une facture
            averagePrice: {$avg: "$totalPrice"},
            // Le nombre de produits vendus
            nbProducts: {$sum: {$reduce: {input: "$lines", initialValue: 0, in: {$sum: "$$this.quantity"}}}}
    }},
])
