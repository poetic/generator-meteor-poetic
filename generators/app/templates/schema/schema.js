var <%= collectionNameSingle %>Schema = new SimpleSchema({
})

<%= collectionName %> = new Mongo.Collection('<%= collectionNameCamel %>')
<%= collectionName %>.attachSchema(<%= collectionNameSingle %>Schema)
