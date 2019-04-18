module.exports = {


  friendlyName: 'View available things',


  description: 'Display "Available things" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/things/available-things'
    }

  },


  fn: async function (inputs, exits) {

    var url = require('url');

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
    })
    .populate('owner');

    _.each(things, (thing)=>{
      thing.imageSrc = url.resolve (sails.config.custom.baseUrl, '/api/v1/things/'+thing.id); // ver custom.js
      delete thing.imageUploadFd;
      delete thing.imageUploadMime;
    });

    // Respond with view.
    return exits.success({
      things,
      currentSection: 'things'
    });

  }


};
