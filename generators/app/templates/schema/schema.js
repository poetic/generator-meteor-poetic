var <%= collectionName %>Schema = new SimpleSchema({
})

<%= collectionName %> = new Mongo.Collection('<%= collectionNameCamel %>')
<%= collectionName %>.attachSchema(<%= collectionName %>Schema)
