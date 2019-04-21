module.exports = {


  friendlyName: 'Add friends',


  description: '',


  inputs: {

    friends:{
      description: 'An array of new friends to send requests to.',
      type: [
        {
          emailAddress: 'string',
          fullName: 'string',
        }
      ],
      example: [
        {
          emailAddress: 'foo@example.com',
          fullName: 'Foo McF'
        }
      ],
      required: true,
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    var desiredFriendEmails = _.pluck(inputs.friends, 'emailAddress');

    var friends = await User.find({
      emailAddress: { in: _.pluck(inputs.friends, 'emailAddress') }
    });
    // TODO: deal with friends not yet in the database

    var existingUserFriendIds = _.pluck(friends, 'id');

    var existingsUserEmails = _.pluck(friends, 'emailAddress');

    var newUserEmails = _.difference(desiredFriendEmails, existingsUserEmails);

    if (newUserEmails.length === 0) {
      await User.addToCollection(this.req.me.id, 'outboundFriendRequests', existingUserFriendIds);
    } else {
      for (let email of newUserEmails) {
        User.create({
          emailAddress: email,
          fullName: (_.find(inputs.friends, { emailAddress: email })).fullName
        });
      }
      // TODO: send emails to newly invited users
      await User.addToCollection(this.req.me.id, 'outboundFriendRequests', existingUserFriendIds);
    }

    return exits.success();

  }


};
