var generators = require('yeoman-generator')
var _          = require('lodash')

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
    schema: function (type, name) {
      if(!(type === 'schema')) {
        return
      }

      generateFilesForSchema(name, this)
    },
    // TODO: create a lib for this, instead of creating the same template
    factory: function (type, name) {
      if(!(type === 'factory')) {
        return
      }

      generateFilesForFactory(name, this)
    },
    publication: function (type, name) {
      if(!(type === 'publication')) {
        return
      }

      generateFilesForPublication(name, this)
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
  var filePath  = [generator.options.prefix, type, routeInfo.filePath].join('/')
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
  var tplName  = capitalize(name)

  // make sure name is not camelcase
  if(name !== name.toLowerCase()) {
    generator.log.error('Your name (' + name + ') ' + 'should not be camelcase.')
  }

  return {
    filePath: name,
    tplName:  tplName
  }
}

function generateFilesForSchema (name, generator) {
  var collectionName      = capitalize(name)
  var collectionNameCamel = camelize(collectionName)

  generator.fs.copyTpl(
    generator.templatePath('schema/schema.js'),
    generator.destinationPath('schemas/' + name + '.js'),
    {
      collectionName:      collectionName,
      collectionNameCamel: collectionNameCamel
    }
  )
}

function generateFilesForFactory (name, generator) {
  var collectionName      = camelize(name)

  generator.fs.copyTpl(
    generator.templatePath('factory/factory.js'),
    generator.destinationPath('server/factories/' + name + '.js'),
    {
      collectionName:       collectionName,
      collectionNameSingle: singularize(collectionName)
    }
  )
}

function generateFilesForPublication (name, generator) {
  var collectionName      = camelize(name)

  generator.fs.copyTpl(
    generator.templatePath('publication/publication.js'),
    generator.destinationPath('server/publications/' + name + '.js'),
    {
      collectionName:       collectionName,
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

// TODO: use a inflection library
function singularize (name) {
  return _.last(name) === 's' ?
    name.substr(0, name.length - 1) :
    name
}
