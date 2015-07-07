var generators = require('yeoman-generator')
var _          = require('lodash')
var inflection = require('inflection')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('client', {
      desc: 'Generate files in the client folder',
      type: Boolean
    })
    this.option('server', {
      desc: 'Generate files in the server folder',
      type: Boolean
    })
  },

  prompting: {
    // prefix is client by default
    addPrefixToOptions: function () {
      this.options.prefix = this.options.server ? 'server' : 'client'
    },

    init: function (type) {
      if(!(typeof type === 'undefined')) {
        return
      }

      var done = this.async()

      this.prompt({
        type: 'confirm',
        name: 'confirm',
        message: 'Create a new meteor project?'
      }, function (answer) {
        if(answer.confirm) {
          done()
        } else {
          process.exit(0)
        }
      })
    },
  },

  writing: {
    init: function (type) {
      if(!(typeof type === 'undefined')) {
        return
      }

      this.directory('app', './')
    },
    component: function (type, name) {
      if(!(type === 'component')) {
        return
      }

      if(this.options.server) {
        this.log.error('You can not create a component on the server side.')
        process.exit(1)
      }
      generateFilesForRoute(type, name, this)
    },
    route: function (type, name) {
      if(!(type === 'route')) {
        return
      }

      generateFilesForRoute(type, name, this)
    },
    templateHelper: function (type, name) {
      if(!(type === 'template-helper')) {
        return
      }

      generateCollectionFileForType(type, name, 'client', this)
    },
    schema: function (type, name) {
      if(!(type === 'schema')) {
        return
      }

      generateCollectionFileForType(type, name, 'everywhere', this)
    },
    // TODO: create a meteor lib for this, instead of creating the same template
    factory: function (type, name) {
      if(!(type === 'factory')) {
        return
      }

      generateCollectionFileForType(type, name, 'server', this)
    },
    publication: function (type, name) {
      if(!(type === 'publication')) {
        return
      }

      generateCollectionFileForType(type, name, 'server', this)
    },
    authorization: function (type, name) {
      if(!(type === 'authorization')) {
        return
      }

      generateCollectionFileForType(type, name, 'server', this)
    },
    autorun: function (type, name) {
      if(!(type === 'autorun')) {
        return
      }

      generateCollectionFileForType(type, name, 'client', this)
    },
  }

});

/*
 * generate file for route or component
 */
function generateFilesForRoute (type, name, generator) {
  if(!name) {
    generator.log.error('You need a ' + type + ' name.')
    process.exit(1)
  }

  var routeInfo = parseRouteName(name, generator)
  var filePath  = [generator.options.prefix, inflection.pluralize(type) , routeInfo.filePath].join('/')
  var tplName   = routeInfo.tplName

  generator.fs.copyTpl(
    generator.templatePath('component/template.html'),
    generator.destinationPath(filePath + '.html'),
    {tplName: tplName}
  )
  generator.fs.copyTpl(
    generator.templatePath('component/template.js'),
    generator.destinationPath(filePath + '.js'),
    {tplName: tplName}
  )
}

/*
 * @return
 *  {
 *    filePath: {String},
 *    tplName:  {String}
 *  }
 */
function parseRouteName (name, generator) {
  var filePath = name
  var fileName = extractFileName(name)
  var tplName  = capitalize(name)

  // make sure name is not camelcase
  if(name !== name.toLowerCase()) {
    generator.log.error('Your name (' + name + ') ' + 'should not be camelcase, use "-" instead')
    process.exit(1)
  }

  return {
    filePath: name + '/' + fileName,
    tplName:  tplName
  }
}

/*
 * @param side {'client'|'server'|'everywhere'}
 */
function generateCollectionFileForType (type, name, side, generator) {
  var prefix = side === 'everywhere' ? '' : side

  var collectionName            = capitalize(name)
  var collectionNameCamel       = camelize(collectionName)
  var collectionNameCamelSingle = inflection.singularize(collectionNameCamel)

  var templatePath    = concatAsPath(type, type) + '.js'
  var destinationPath = concatAsPath(prefix, inflection.pluralize(type), name) + '.js'

  generator.fs.copyTpl(
    generator.templatePath(templatePath),
    generator.destinationPath(destinationPath),
    {
      collectionName:            collectionName,
      collectionNameCamel:       collectionNameCamel,
      collectionNameCamelSingle: collectionNameCamelSingle
    }
  )
}

function capitalize (str) {
  var segments        = str.split('/').filter(Boolean)
  var capitalizedName = segments.map(function(segment){
    return segment.split(/[-_]/).map(_.capitalize).join('');
  }).join('');
  return capitalizedName
}

function camelize (str) {
  return deCapitalizeFirst(capitalize(str))
}

function deCapitalizeFirst (str) {
  return str[0].toLowerCase() + str.substr(1)
}

function extractFileName (path) {
  return _.last(path.split('/'))
}

function concatAsPath () {
  var segments = Array.prototype.slice.call(arguments).filter(Boolean)
  return _.flatten(segments).join('/')
}
