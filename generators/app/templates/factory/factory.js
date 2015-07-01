Factories.<%= collectionName %> = {}
Factories.<%= collectionName %>.create = function(override) {
  var <%= collectionNameCamelSingle %> = {
  }

  <%= collectionNameCamelSingle %> = _.merge(<%= collectionNameCamelSingle %>, override)
  var <%= collectionNameCamelSingle %>Id = <%= collectionName %>.insert(<%= collectionNameCamelSingle %>)
  return <%= collectionNameCamelSingle %>Id
}
