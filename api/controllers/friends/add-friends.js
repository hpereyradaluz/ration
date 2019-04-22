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

    var existingUserFriendIds = _.pluck(friends, 'id');

    var existingsUserEmails = _.pluck(friends, 'emailAddress');

    var newUserEmails = _.difference(desiredFriendEmails, existingsUserEmails);

    for (let email of newUserEmails) {

      var token = await sails.helpers.strings.random('url-friendly');

      await User.create({
        emailAddress: email,
        fullName: (_.find(inputs.friends, { emailAddress: email })).fullName,
        emailProofToken: token,
        emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
        emailStatus: 'confirmed'
      });

      // TODO: send emails to newly invited users
    }//∞

    await User.addToCollection(this.req.me.id, 'outboundFriendRequests', existingUserFriendIds);


    return exits.success();

  }


};
