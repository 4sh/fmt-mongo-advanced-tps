// Écrire une requête d’agrégation calculant un rapport de facturation, sur les années 2021, 2022 et 2023
// permettant de connaître :
// - par année :
//    - Le chiffre d'affaires
//    - Le montant moyen d’une facture, arrondi à l'euro près
//    - Le nombre de produits vendus dont le prix unitaire est > 5€
// - par mois :
//    - Le chiffre d'affaires
//    - Le montant moyen par facture
//    - Le nombre de produits vendus

db.invoices.aggregate([
    {$match: {date: {$gte: ISODate("2021-01-01T00:00:00.000+0000"), $lt: ISODate("2024-01-01T00:00:00.000+0000")}}},
    {$facet: {
        // Pipeline relatif aux informations à consolider par année
        byYear: [
            {$group: {
                _id: {$year: "$date"},
                // Le chiffre d'affaires
                totalPrice: {$sum: "$totalPrice"},
                // Le montant moyen d’une facture
                // On ne peut pas faire l'arrondi à cette étape, car nous sommes dans un groupement, qui nécessite des
                // opérateurs d'accumulation, ce que n'est pas $round
                averagePrice: {$avg: "$totalPrice"},
                // Le nombre de produits vendus dont le prix unitaire est > 5€
                nbProducts: {
                    // Ce $sum est utilisé comme accumulateur
                    $sum: {
                        // Ce $sum est utilisé comme un opérateur sur un tableau
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$lines",
                                        as: "item",
                                        cond: {$gt: ["$$item.product.unitPrice", 5]}
                                    }
                                },
                                as: "line",
                                in: "$$line.quantity"
                            }
                        }
                    }
                }
            }},
            // On peut procéder à l'arrondi sur le prix moyen
            {$addFields: {averagePrice: {$round: ["$averagePrice", 0]}}}
        ],
        // Pipeline relatif aux informations à consolider par mois
        byMonth: [
            {$group: {
                _id: {$month: "$date"},
                // Le chiffre d'affaires
                totalPrice: {$sum: "$totalPrice"},
                // Le montant moyen d’une facture
                averagePrice: {$avg: "$totalPrice"},
                // Le nombre de produits vendus
                nbProducts: {$sum: {$reduce: {input: "$lines", initialValue: 0, in: {$sum: "$$this.quantity"}}}}
            }}
        ]
    }}
])


// Une autre version pour éviter le $sum $sum
db.invoices.aggregate([
    { $match: { date: { $gte: ISODate("2021-01-01T00:00:00.000+0000"), $lt: ISODate("2024-01-01T00:00:00.000+0000") } } },
    {
        $facet: {
            // Pipeline relatif aux informations à consolider par année
            byYear: [
                {
                    $group: {
                        _id: { $year: "$date" },
                        // Le chiffre d'affaires
                        totalPrice: { $sum: "$totalPrice" },
                        // Le montant moyen d'une facture
                        // On ne peut pas faire l'arrondi à cette étape, car nous sommes dans un groupement, qui nécessite des
                        // opérateurs d'accumulation, ce que n'est pas $round
                        averagePrice: { $avg: "$totalPrice" },
                        // Le nombre de produits vendus dont le prix unitaire est > 5€
                        nbProducts:
                            {
                                $sum: {
                                    $reduce: {
                                        input: {
                                            $filter: {
                                                input: "$lines",
                                                as: "item",
                                                cond: { $gt: ["$$item.product.unitPrice", 5] }
                                            }
                                        },
                                        initialValue: 0,
                                        in: { $add: ["$$this.quantity", "$$value"] }
                                    }
                                }
                            }
                    }
                },
                // On peut procéder à l'arrondi sur le prix moyen
                { $addFields: { averagePrice: { $round: ["$averagePrice", 0] } } }
            ],
            // Pipeline relatif aux informations à consolider par mois
            byMonth: [
                {
                    $group: {
                        _id: { $month: "$date" },
                        // Le chiffre d'affaires
                        totalPrice: { $sum: "$totalPrice" },
                        // Le montant moyen d'une facture
                        averagePrice: { $avg: "$totalPrice" },
                        // Le nombre de produits vendus
                        nbProducts: { $sum: { $reduce: { input: "$lines", initialValue: 0, in: { $sum: "$$this.quantity" } } } }
                    }
                }
            ]
        }
    }
])