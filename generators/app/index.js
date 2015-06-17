var generators = require('yeoman-generator');

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
      if(!type === 'undefined') {
        return
      }
    },
    // TODO: client or server
    route: function (type, name) {
      if(!type === 'route') {
        return
      }

      if(!name) {
        this.log('You need a route name')
        process.exit(1)
      }

      // TODO: construct path and name
      var path = 'client/route/name/name.html'
      var name = 'Name'

      this.fs.copyTpl(
        this.templatePath('component/template.html'),
        this.destinationPath(path),
        {name: name}
      )
    }
  }

});
