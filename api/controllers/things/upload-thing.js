module.exports = {


  friendlyName: 'Upload thing',


  description: '',

  files:['photo'],

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
    success:{
      outputDescription: 'Information about the newly created record.',
      //outputType:{} podria poner solo un diccionario  pero de la forma que ponemos abajo podemos exponer la api
      outputType:{
        id:'number',
        imageSrc: 'string',
      }
    },
    badRequest: {
      description: 'No image updload was provided.',
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs, exits) {

    var url = require('url');
    var info = await sails.uploadOne(inputs.photo);
    console.log(info);

    if (!info) {
      throw 'badRequest';
    }

    var newThing = await Thing.create({
      imageUploadFd: info.fd,
      imageUploadMime: info.type,
      owner: this.req.me.id,
      label: inputs.label
    }).fetch(); // use .fetch() for not consume extra resources and send to de front-end only the data i want to send

    return exits.success({
      id: newThing.id,
      imageSrc: url.resolve (sails.config.custom.baseUrl, '/api/v1/things/'+newThing.id) // ver custom.js
    });

  }


};
