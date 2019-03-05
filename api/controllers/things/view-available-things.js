module.exports = {


  friendlyName: 'View available things',


  description: 'Display "Available things" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/things/available-things'
    }

  },


  fn: async function (inputs, exits) {

    var me = await User.findOne({
      id: this.req.me.id
    })
    .populate('friends');

    // collection of js objects (with _.map)
    //var friendIds = _.map(me.friends, 'id');

    // collection of numbers (with _.pluck)
    var friendIds = _.pluck(me.friends, 'id');

    var things = await Thing.find({ //remote call
      or: [ // where, and are anothers kind off CRITERIA
        { owner: this.req.me.id },
        { owner: { in: friendIds } }
      ]
    });

    // Respond with view.
    return exits.success({
      things
    });

  }


};
