var _ = lodash

Factories.<%= collectionName %> = {}
Factories.<%= collectionName %>.create = function(override) {
  var <%= collectionNameSingle %> = {
  };

  <%= collectionNameSingle %> = _.merge(<%= collectionNameSingle %>, override);
  var <%= collectionNameSingle %>Id = <%= collectionName %>.insert(timeLog);
  return <%= collectionNameSingle %>Id;
}
