Router.configure({
  layoutTemplate: 'LayoutMain'
});

Router.onBeforeAction(function () {
  this.next()
});
