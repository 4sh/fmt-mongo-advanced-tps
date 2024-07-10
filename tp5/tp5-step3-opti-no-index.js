// Puisqu'on ne récupère qu'un seul résultat, autant transformer en findOne.
// La recherche par regex était une recherche exacte, donc autant supprimer la regex, car les regex
// coûtent cher et peuvent engendrer des limitations à l'usage d'index.
// Ajout d'un projection puisque nous ne nous servons que de quelques champs dans la suite du code.
const customer = db.customers.findOne({lastName: "BLANCHARD"}, {lastName: 1, firstName: 1});

// On récupère toutes les factures du client simplement pour calculer :
// - le nombre de factures
// - le montant total des factures
// - le nombre de produits achetés, par type de produit
//
// Plutôt que de récupérer toutes les factures et faire les calculs côté applicatif,
// nous pouvons faire une agrégation. L'avantage est d'éviter :
// - du coût réseau pour transporter plein de données
// - de monter en RAM (côté applicatif) tout un tas de données inutiles
const invoiceReport = db.invoices.aggregate([
    {$match: {"customer._id": customer._id}},
    {$project: {_id: 0, "customer._id": 1, totalPrice: 1, lines: 1}},
    {$facet: {
            total: [
                {$group: {_id: null, nbInvoices: {$sum: 1}, totalAmountInvoiced: {$sum: "$totalPrice"}}},
                {$project: {_id: 0, nbInvoices: 1, totalAmountInvoiced: 1}}
            ],
            byType: [
                {$unwind: "$lines"},
                {$group: {_id: "$lines.product.type", total: {$sum: "$lines.quantity"}}},
                // On projette k et v pour pouvoir faire un $arrayToObject ensuite
                {$project: {_id: 0, k: "$_id", v: "$total"}}
            ]
        }},
    {$project: {total: {$first: "$total"}, byType: {$arrayToObject: "$byType"}}}
]).toArray()[0];

const nbInvoices = invoiceReport.total.nbInvoices;
const totalAmountInvoiced = invoiceReport.total.totalAmountInvoiced;
const nbProductsBoughtByType = invoiceReport.byType;

// Pas besoin de récupèrer le panier le plus récent au complet. Seul le champs totalPrice nous intéresse.
const basket = db.baskets.find({"customer._id": customer._id}, {_id: 0, totalPrice: 1}).sort({creationDate: -1}).limit(1).toArray()[0];
let totalAmountToInvoice = 0;

if (basket) {
    totalAmountToInvoice = basket.totalPrice;
}


print("********** Summary **********")
print("Identity : " + customer.firstName + ' ' + customer.lastName.toUpperCase())
print("Nb of invoices : " + nbInvoices)
print("Total amount invoiced : " + totalAmountInvoiced)
print("Total amount to invoice : " + totalAmountToInvoice)

for(var type in nbProductsBoughtByType) {
    print("Total products of type " + type + " bought : " + nbProductsBoughtByType[type])
}
