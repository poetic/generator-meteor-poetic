var generators = require('yeoman-generator')
var _          = require('lodash')
var inflection = require('inflection')
var sides      = ['before', 'everywhere', 'client', 'server']

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
    this.option('everywhere', {
      desc: 'Generate files in the root folder',
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
      // TODO: do not create new one if one route already exist
      addRouteToTheEndOfRouter(type, name, this)
    },
    templateHelper: function (type, name) {
      if(!(type === 'template-helper')) {
        return
      }

      generateJsFile(type, name, 'client', this)
    },
    schema: function (type, name) {
      if(!(type === 'schema')) {
        return
      }

      generateJsFile(type, name, 'before', this)
    },
    factory: function (type, name) {
      if(!(type === 'factory')) {
        return
      }

      generateJsFile(type, name, 'server', this)
    },
    publication: function (type, name) {
      if(!(type === 'publication')) {
        return
      }

      generateJsFile(type, name, 'server', this)
    },
    authorization: function (type, name) {
      if(!(type === 'authorization')) {
        return
      }

      generateJsFile(type, name, 'server', this)
    },
    autorun: function (type, name) {
      if(!(type === 'autorun')) {
        return
      }

      generateJsFile(type, name, 'client', this)
    },
    method: function (type, name) {
      if(!(type === 'method')) {
        return
      }

      generateJsFile(type, name, 'everywhere', this)
    },
    collectionHelper: function (type, name) {
      if(!(type === 'collection-helper')) {
        return
      }

      generateJsFile(type, name, 'everywhere', this)
    },
  },

  // Helpers
  _getSide: function (defalutSide) {
    var generator = this

    var selectedSide = _.find(sides, function (side) {
      return generator.options[side]
    })

    return selectedSide || defalutSide
  },
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

function addRouteToTheEndOfRouter (type, name, generator) {
  var path = "client/router.js"
  var file = generator.readFileAsString(path)
  file += [
    "",
    "Router.route('/" + name + "', function () {",
    "  this.render('" + capitalize(name)+ "')",
    "})"
  ].join("\n")

  /* make modifications to the file string here */

  generator.writeFileFromString(file, path);
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
 * @param defaultSide {'client'|'server'|'everywhere'}
 */
function generateJsFile (type, name, defaultSide, generator) {
  var side   = generator._getSide(defaultSide)
  var prefix
  if(side === 'before') {
    prefix = 'before/lib'
  } else if (side === 'everywhere') {
    prefix = ''
  } else {
    prefix = side
  }

  var collectionName            = capitalize(name)
  var collectionNameSingle      = inflection.singularize(collectionName)
  var collectionNameCamel       = camelize(collectionName)
  var collectionNameCamelSingle = inflection.singularize(collectionNameCamel)

  var templatePath    = concatAsPath(type, type) + '.js'
  var destinationPath = concatAsPath(prefix, inflection.pluralize(type), name) + '.js'

  generator.fs.copyTpl(
    generator.templatePath(templatePath),
    generator.destinationPath(destinationPath),
    {
      collectionName:            collectionName,
      collectionNameSingle:      collectionNameSingle,
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
