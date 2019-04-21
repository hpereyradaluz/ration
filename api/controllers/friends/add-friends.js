module.exports = {


  friendlyName: 'Add friends',


  description: '',


  inputs: {

    friends:{
      description: 'An array of new friends to send requests to.',
      type: ['string'],
      required: true,
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    var friends = await User.find({
      emailAddress: { in: inputs.friends }
    });
    // TODO: deal with friends not yet in the database

    var friendIds = _.pluck(friends, 'id');

    await User.addToCollection(this.req.me.id, 'outboundFriendRequests', friendIds);

    return exits.success();

  }


};
