module.exports = {


  friendlyName: 'Upload thing',


  description: '',


  inputs: {
    photo:{
      type: 'ref',
      description: 'Uploaded file stream',
      required: true,
    },
    label:{
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    //sails.uploadOne()
    // All done.
    return;

  }


};
