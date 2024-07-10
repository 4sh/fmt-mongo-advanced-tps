// Voici un script, qui pourrait correspondre à ce qui est fait dans une application métier.
// Dans un premier temps, optimiser ce script sans créer d'index. Écrire dans le fichier tp5-step3-opti-no-index.js
// Bonus : Dans un second temps, optimiser encore plus en créant des index. Écrire dans le fichier tp5-step3-opti-with-index.js

const customer = db.customers.find({lastName: /^BLANCHARD$/}).toArray()[0];

const invoices = db.invoices.find({"customer._id": customer._id}).toArray();

const nbInvoices = invoices.length;
let totalAmountInvoiced = 0;
let nbProductsBoughtByType = {};

for (var i = 0; i < invoices.length; i++) {
    totalAmountInvoiced += invoices[i].totalPrice;

    for (var j = 0; j < invoices[i].lines.length; j++) {
        const line = invoices[i].lines[j];

        if (nbProductsBoughtByType[line.product.type] === undefined) {
            nbProductsBoughtByType[line.product.type] = 0;
        }

        nbProductsBoughtByType[line.product.type] += line.quantity;
    }
}

const basket = db.baskets.find({"customer._id": customer._id}).sort({creationDate: -1}).toArray()[0];
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