// Trier les produits des paniers par quantité dans l’ordre décroissant.
db.getCollection("baskets").updateMany({},
    {
        $push: {
            products: {
                $each: [],
                $sort: {quantity: -1}
            }
        }
    });


// Faire 1000 mises à jour unitaires (peu importe la collection). Pour cet exercice, demander au formateur un accès à un replica Mongo déployé.
// - calculer le temps total avec le write concern par défaut
// - idem (en changeant les valeurs de mise à jour), mais avec un write concern le moins exigeant possible
// - idem, avec wc le plus exigeant possible
// - grouper toutes les opérations dans un bulk, avec wc minimal
// - idem, avec wc maximal
// - analyser les différents résultats

// mongodb+srv://<login>:<mdp>@4sh-learning-mongo.det9c4e.mongodb.net/formation-essentiels?retryWrites=true&loadBalanced=false&replicaSet=atlas-scemqz-shard-0&readPreference=primary&srvServiceName=mongodb&connectTimeoutMS=10000&w=majority&authSource=admin&authMechanism=SCRAM-SHA-1

const NB_UPDATES = 1000;

function execute(message, runnable) {
    const startDate = new Date()

    runnable();

    const endDate = new Date()
    const duration = endDate - startDate

    print(message + ": " + duration + "ms")
}


execute(
    NB_UPDATES + " random updates with default WC",
    () => {
        for (let i = 0; i < NB_UPDATES; i++) {
            db.inventories.updateOne({},{$mul: {"product.unitPrice": 1.05}})
        }
    }
)
// => 33259


execute(
    NB_UPDATES + " random updates with minimal WC",
    () => {
        for (let i = 0; i < NB_UPDATES; i++) {
            db.inventories.updateOne({},{$mul: {"product.unitPrice": 1.05}}, { writeConcern : {w: 0, j: false} })
        }
    }
)
// => 24229


execute(
    NB_UPDATES + " random updates with maximal WC",
    () => {
        for (let i = 0; i < NB_UPDATES; i++) {
            db.inventories.updateOne({},{$mul: {"product.unitPrice": 1.05}}, { writeConcern : {w: 3, j: true} })
        }
    }
)
// => 35587


execute(
    NB_UPDATES + " random updates with bulk and default WC",
    () => {
        const updates = []
        for (let i = 0; i < NB_UPDATES; i++) {
            updates.push({updateOne: {filter: {}, update: {$mul: {"product.unitPrice": 1.05}}}})
        }

        db.inventories.bulkWrite(updates)
    }
)
// => 3485


execute(
    NB_UPDATES + " random updates with bulk and minimal WC",
    () => {
        const updates = []
        for (let i = 0; i < NB_UPDATES; i++) {
            updates.push({updateOne: {filter: {}, update: {$mul: {"product.unitPrice": 1.05}}}})
        }

        db.inventories.bulkWrite(updates, { writeConcern : {w: 0, j: false} })

    }
)
// => 2889


execute(
    NB_UPDATES + " random updates with bulk and minimal WC",
    () => {
        const updates = []
        for (let i = 0; i < NB_UPDATES; i++) {
            updates.push({updateOne: {filter: {}, update: {$mul: {"product.unitPrice": 1.05}}}})
        }

        db.inventories.bulkWrite(updates, { writeConcern : {w: 3, j: true} })
    }
)
// => 5399

// 1000 random updates with default WC: 33259ms         -> 33.3s
// 1000 random updates with minimal WC: 24229ms         -> 24.3s
// 1000 random updates with maximal WC: 35587ms         -> 35.6s
// 1000 random updates with bulk and default WC: 3485ms ->  3.5s
// 1000 random updates with bulk and minimal WC: 2889ms ->  2.9s
// 1000 random updates with bulk and minimal WC: 5399ms ->  5.4s