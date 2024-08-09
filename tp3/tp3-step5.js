// Trier les produits des paniers par quantité dans l’ordre décroissant.


// Faire 1000 mises à jour unitaires (peu importe la collection). Pour cet exercice, demander au formateur un accès à un replica Mongo déployé.
// - calculer le temps total avec le write concern par défaut, puis le wc minimal, puis le wc maximal.
// - grouper toutes les opérations dans un bulk ordonné, avec les 3 wc précédents.
// - grouper toutes les opérations dans un bulk non-ordonné, avec les 3 wc précédents.
// - analyser les différents résultats