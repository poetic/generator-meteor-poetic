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
    init: function (type) {
      if(!(typeof type === 'undefined')) {
        return
      }

      var generator = this;
      var done = generator.async()

      generator.prompt({
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
    },
    route: function (type, name) {
      if(!(type === 'route')) {
        return
      }

      if(!name) {
        this.log('You need a route name')
        process.exit(1)
      }

      var side      = this.options.server ? 'server' : 'client'
      var routeInfo = parseRouteName(name, this)
      var filePath  = [side, 'route', routeInfo.filePath].join('/')
      var tplName   = routeInfo.tplName

      this.fs.copyTpl(
        this.templatePath('component/template.html'),
        this.destinationPath(filePath + '.html'),
        {tplName: tplName}
      )
      this.fs.copyTpl(
        this.templatePath('component/template.js'),
        this.destinationPath(filePath + '.js'),
        {tplName: tplName}
      )
    }
  }

});

// @return
//  {
//    filePath: {String},
//    tplName:  {String}
//  }
function parseRouteName (name, generator) {
  var segments = name.split('/').filter(Boolean)

  // make sure name is not camelcase
  if(name !== name.toLowerCase()) {
    generator.log('Your name (' + name + ') ' + 'should not be camelcase')
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
