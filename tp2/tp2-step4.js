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
])