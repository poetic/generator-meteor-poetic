var UserProfile = new SimpleSchema({

})

var UserSchema = new SimpleSchema({
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/
  },
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: UserProfile,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },

  // # Add `roles` to your schema if you use the meteor-roles package.

  // ## Option 1: Object type
  // If you specify that type as Object, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Example:
  // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.

  // roles: {
  //   type: Object,
  //   optional: true,
  //   blackbox: true
  // },

  // ## Option 2: [String] type
  // If you are sure you will never need to use role groups, then
  // you can specify [String] as the type

  // roles: {
  //   type: [String],
  //   optional: true
  // }
});

Meteor.users.attachSchema(UserSchema);
