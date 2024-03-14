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
        bsonType: 'object',
        properties: {
            name: {bsonType: 'string', minLength: 1, maxLength: 100},
            language: {bsonType: 'string', enum: ['en', 'es', 'fr', 'it', 'nl']},
            unitPrice: {bsonType: 'number', minimum: 0}
        },
        required: ['name', 'language', 'unitPrice']
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
        bsonType: 'object',
        properties: {
            name: {bsonType: 'string', minLength: 1, maxLength: 100},
            language: {bsonType: 'string', enum: ['en', 'es', 'fr', 'it', 'nl']},
            unitPrice: {bsonType: 'number', minimum: 0},
            properties: {
                type: 'object',
                oneOf: [
                    // Pour les VEGETABLES
                    {
                        properties: {
                            origin: {bsonType: 'string'},
                            isBio: {bsonType: 'bool'}
                        },
                        required: ['origin', 'isBio']
                    },

                    // Pour les BOOK
                    {
                        properties: {
                            isbn10: {bsonType: 'string', minLength: 10, maxLength: 10},
                            author: {bsonType: 'string'}
                        },
                        required: ['isbn10', 'author']
                    },

                    // Pour les CLOTHES
                    {
                        properties: {
                            origin: {bsonType: 'string'},
                            size: {bsonType: 'string'},
                            color: {bsonType: 'string'}
                        },
                        required: ['origin', 'size', 'color']
                    }
                ]
            }
        },
        required: ['name', 'language', 'unitPrice', 'properties']
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

// Attention, on notera que l'insertion suivante est acceptée :
// db.products.insertOne({
//     name: 'Kiwanos',
//     type: 'VEGETABLE',
//     description: 'Un fruit méconnu',
//     language: 'fr',
//     unitPrice: 3.5,
//     properties: {
//         isbn10: '1234567890',
//         author: 'Inconnu'
//     }
// })