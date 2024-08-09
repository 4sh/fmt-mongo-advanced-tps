// Trier les produits des paniers par quantité dans l’ordre décroissant.


// Faire 1000 mises à jour unitaires (peu importe la collection). Pour cet exercice, demander au formateur un accès à un replica Mongo déployé.
// - calculer le temps total avec le write concern par défaut
// - idem (en changeant les valeurs de mise à jour), mais avec un write concern le moins exigeant possible
// - idem, avec wc le plus exigeant possible
// - grouper toutes les opérations dans un bulk, avec wc minimal
// - idem, avec wc maximal
// - analyser les différents résultats