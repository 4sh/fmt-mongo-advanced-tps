// Calculer l’état des stocks du magasin 'Magasin de Paris' si les paniers étaient validés par les clients.

db.inventories.aggregate([
    // Filtre sur le magasin via son id
    {$match: {storeRef: ObjectId("65f3553141f72e7ad269bbee")}},
    // Ajout du champ product._id, copie du champ product.eanNumber
    {$addFields: {"product._id": "$product.eanNumber"}},
    // Union des résultats (l'inventaire) avec des lignes provenant des paniers
    {$unionWith: {
            coll: "baskets",
            pipeline: [
                // Filtre des paniers sur le magasin
                {$match: {"store._id": ObjectId("65f3553141f72e7ad269bbee")}},
                // Éclatement des produits
                {$unwind: "$products"},
                // On remplace le document courant par le contenu du champs 'products', qui est un tableau de 1 élément.
                {$replaceWith: "$products"},
                // On modifie le champ 'quantity' pour le passer en négatif
                {$addFields: {quantity: {$subtract: [0, "$quantity"]}}},
            ]
        }},
    // On groupe sur 'product._id' et on somme les quantités.
    {$group: {_id: "$product._id", totalQuantity: {$sum: "$quantity"}}}
])



// Faire une requête de mise à jour qui ajoute un champ stats sur les factures. Ce champ stats doit calculer le prix total par type de produit.
// - Dans un premier temps, on s’autorisera de connaître exhaustivement les différents types de produit.
// - Ensuite, on cherchera à avoir le moins de référence en dur aux types (idéalement 1).
// - Et pour finir, on veut une solution sans aucune référence aux types. On considère donc qu’on ne connaît pas l’exhaustivité des types possibles.

// Les solutions qui suivent sont écrites avec un updateOne sur une facture de mon choix.

// Solution 1 : relativement simple, mais avec une dépendance sur les types.
db.invoices.updateOne({_id: ObjectId("65f35540fbdf782c2e41ee7f")},
    [
        {$addFields: {
                stats: {
                    $reduce: {
                        input: "$lines",
                        initialValue: {},
                        in: {
                            // Pour simplifier la lecture, on va définir quelques variables pour la suite.
                            $let: {
                                vars: {
                                    totalPrice: "$$this.totalPrice",
                                    type: "$$this.product.type",
                                    // En fonction du type, on va chercher la bonne valeur dans $$value
                                    valueTotalPrice: {$switch: {
                                            branches: [
                                                {case: {$eq: ["$$this.product.type", "BOOK"]}, then: "$$value.BOOK"},
                                                {case: {$eq: ["$$this.product.type", "CLOTHES"]}, then: "$$value.CLOTHES"},
                                                {case: {$eq: ["$$this.product.type", "VEGETABLE"]}, then: "$$value.VEGETABLE"},
                                            ]
                                        }}
                                },
                                in: {
                                    // On merge 2 objets. Le premier contient l'état actuel, dans lequel on va vouloir
                                    // écraser le champ <type> avec la nouvelle valeur.
                                    $mergeObjects: [
                                        "$$value",
                                        // On construit un objet {<type>: <nombre>}. Superbe syntaxe !!!!
                                        {$arrayToObject: [[
                                                ["$$type", {$add: [ {$ifNull: ["$$valueTotalPrice", 0]}, "$$totalPrice"]}]
                                            ]]}
                                    ]
                                }
                            }
                        }
                    }
                }
            }}
    ]
)



// Solution 2 : Approche différente pour n'avoir qu'une seule référence sur le type.
db.invoices.updateOne({_id: ObjectId("65f35540fbdf782c2e41ee7f")},
    [
        {$addFields: {
                stats: {
                    $arrayToObject: {
                        $filter: {
                            input: {
                                $reduce: {
                                    input: "$lines",
                                    // On construit un état de départ avec cette forme : tableau de {k, v}
                                    // Ce format est utile car il permet ensuite de créer un objet à partir de ce tableau.
                                    initialValue: [
                                        {k: "BOOK", v: null},
                                        {k: "CLOTHES", v: null},
                                        {k: "VEGETABLE", v: null}
                                    ],
                                    in: {
                                        // On va transformer l'item de notre état de consolidation (-> $$value)
                                        // dont le champ k vaut le type de la ligne courante (-> $$this)
                                        $map: {
                                            input: "$$value",
                                            as: "itemInMap",
                                            in: {
                                                $cond: {
                                                    // Si l'item de mon état a k qui vaut le type de produit de la ligne courante
                                                    if: {$eq: ["$$itemInMap.k", "$$this.product.type"]},
                                                    // Alors on renvoie un nouvel objet, avec le compteur mis à jour
                                                    then: {
                                                        // $arrayToObject permet de construire un objet à partir d'un
                                                        // tableau, très pratique pour définir un nom de champs dynamique
                                                        $arrayToObject: [[
                                                            ["k", "$$this.product.type"],
                                                            ["v", {$add: [ {$ifNull: ["$$itemInMap.v", 0]}, "$$this.totalPrice"]}]
                                                        ]]
                                                    },
                                                    // Sinon, je n'ai pas besoin de toucher à cette ligne
                                                    else: "$$itemInMap"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            as: "itemInFilter",
                            cond: {
                                // On filtre les entrées avec v à null, car ça veut dire que c'est un type qui
                                // n'est pas utilisé dans les lignes de la facture.
                                $ne: ["$$itemInFilter.v", null]
                            }
                        }
                    }
                }
            }}
    ]
)



// Solution sans dépendance aux types
db.invoices.updateOne({_id: ObjectId("65f35540fbdf782c2e41ee7f")},
    [
        {$addFields: {
                stats: {
                    $reduce: {
                        input: "$lines",
                        // On part d'un état initial de type objet, vide
                        initialValue: {},
                        in: {
                            // On transforme notre tableau de {k, v} en un objet
                            $arrayToObject: {
                                // On itére sur les valeurs de notre état courant (transformé en tableau)
                                $map: {
                                    input: {
                                        // On transforme notre état courant en un tableau de {k, v}
                                        $objectToArray: {
                                            // On s'assure de déclarer le champ <type> dans notre état courant
                                            $mergeObjects: [
                                                {$arrayToObject: [[
                                                        ["$$this.product.type", 0]
                                                    ]]},
                                                "$$value"
                                            ]
                                        }
                                    },
                                    as: "itemInMap",
                                    in: {
                                        $cond: {
                                            // Si l'item de l'état courant a le même type que la ligne courante
                                            if: {$eq: ["$$itemInMap.k", "$$this.product.type"]},
                                            // Alors on remplace l'item avec la valeur mise à jour
                                            then: {
                                                $mergeObjects: [
                                                    "$$itemInMap",
                                                    {$arrayToObject: [[
                                                            ["v", {$add: [ "$$itemInMap.v", "$$this.totalPrice"]}]
                                                        ]]}
                                                ]
                                            },
                                            // Sinon on ne touche pas à l'item
                                            else: "$$itemInMap"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }}
    ]
)
