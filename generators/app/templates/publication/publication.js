Meteor.publish('<%= collectionName %>', function() {
  return <%= collectionName %>.find()
})
