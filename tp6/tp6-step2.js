// La collection customers a un schéma de validation.
// Ce dernier est consultable grâce à la commande :
db.getCollectionInfos({name: 'customers'})[0].options.validator

// Lancer les requêtes suivantes et constater à chaque fois la raison pour laquelle elle est invalide :

// Le prénom doit faire au moins 1 caractère.
db.customers.insertOne({
    firstName: '',
    lastName: 'MARTIN',
    address: {},
    birthDate: '1986-05-16',
    gender: 'M'
})

// La date de naissance n'est pas au bon format.
db.customers.insertOne({
    firstName: 'Gabriella',
    lastName: 'MARTIN',
    address: {},
    birthDate: '1986/05/16',
    gender: 'M'
})

// La date de naissance n'est pas du bon type.
db.customers.insertOne({
    firstName: 'Gabriella',
    lastName: 'MARTIN',
    address: {},
    birthDate: new ISODate(),
    gender: 'M'
})

// Le genre ? n'est pas une valeur acceptée.
db.customers.insertOne({
    firstName: 'Gabriella',
    lastName: 'MARTIN',
    address: {},
    birthDate: '1986-05-16',
    gender: '?'
})


// En s'inspirant du schéma de customers, réaliser un schéma de validation pour les produits, respectant
// les règles suivantes :
// - name : requis, de type string, entre 1 et 100 caractères
// - language : requis, de type string, pouvant avoir les valeurs : 'en', 'es', 'fr', 'it' ou 'nl'
// - unitPrice: requis, de type number, ne pouvant pas être négatif

const schema = {
    $jsonSchema: {
        // TODO
    }
}

db.runCommand({
    collMod: 'products',
    validator: schema
})


// Bonus :
// Ajouter la règle suivante :
// - properties : requis, de type objet, pouvant contenir soit :
//      - origin et isBio :
//          - origin : requis, de type string
//          - isBio : requis, de type bool
//      - isbn10 et author :
//          - isbn10 : requis, de type string, de taille 10
//          - author : requis, de type string
//      - origin, size et color :
//          - origin : requis, de type string
//          - size : requis, de type string
//          - color : requis, de type string

const schemaBonus = {
    $jsonSchema: {
        // TODO
    }
};

db.runCommand({
    collMod: 'products',
    validator: schemaBonus
})

// Vérifier que cette insertion n'est pas accéptée
db.products.insertOne({
    name: 'Kiwanos',
    type: 'VEGETABLE',
    description: 'Un fruit méconnu',
    language: 'fr',
    unitPrice: 3.5,
    properties: {
        origin: 'France'
    }
})
