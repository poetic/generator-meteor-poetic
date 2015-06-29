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
    }
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
  var segments = name.split('/').filter(Boolean)

  // make sure name is not camelcase
  if(name !== name.toLowerCase()) {
    generator.log.error('Your name (' + name + ') ' + 'should not be camelcase.')
  }

  var filePath = name
  var tplName  = segments.map(function(segment){
    return segment.split(/[-_]/).map(_.capitalize).join('');
  }).join('');

  return {
    filePath: name,
    tplName:  tplName
  }
}
