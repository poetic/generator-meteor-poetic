Meteor.publish('<%= collectionNameCamel %>', function() {
  return <%= collectionName %>.find()
})
