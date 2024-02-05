print(db.products.find({
    description: {$regex: /fleur.*ouvrage/, $options: 's'}
}));

print(db.products.find({
    description: /^Les/
}));

print(db.products.find({
    name: /image/i
}));

print(db.products.find({
    description: {$regex: /livre.*fleur/, $options: 'is'}
}));