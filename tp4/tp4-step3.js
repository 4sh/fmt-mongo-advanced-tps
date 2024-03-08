// Actuellement, rien n'empêche de créer une ligne d'inventaire entre un magasin et un produit,
// même si cette ligne existe déjà. Mettre en place une solution pour éviter cela.

// TODO


// Vérifier que l'insertion d'une ligne d'inventaire existante entre un magasin et un produit n'est pas autorisée
const existingInventory = db.inventories.aggregate([{$sample: {size: 1}}]).toArray()[0];
delete existingInventory._id

// Cette insertion doit être interdite
db.inventories.insertOne(existingInventory);