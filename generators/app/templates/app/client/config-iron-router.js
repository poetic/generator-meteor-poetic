var publicRoutes = []

Router.onBeforeAction(function () {
  // Public Routes
  var currentRoute = Router.current().route.getName()
  if(_.includes(publicRoutes, currentRoute)) {
    this.next()
    return
  }

  // Login If Not Logged In
  if(!Meteor.user()) {
    this.layout('LayoutLogin')
    this.render('Login')
    return
  }

  this.next()
})

Router.configure({
  layoutTemplate: 'LayoutMain'
})
