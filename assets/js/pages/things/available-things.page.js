parasails.registerPage('available-things', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    things: [],

    // The "virtual" portion of the URL which is managed by this page script.
    virtualPageSlug: '',
    confirmDeleteThingModalOpen: false,
    selectedThing: undefined,
    uploadThingModalOpen: false,
    uploadFormData: {
      label: '',
      photo: undefined
    },

    // Syncing / loading state
    syncing: false,

    // Validation errors:
    formErrors: {},

    // Server error state:
    cloudError: ''
  },

  //virtualPages: true,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

    /*this.things = [
      {id:1, label:'Sweet Red Drill'},
      {id:2, label:'Red Mountain Bike'}
    ];*/
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    // clickThing: async function(thingId){
    //   console.log('clicked thing#'+thingId);
    //   await Cloud.destroyOneThing.with({id: thingId});
    //   _.remove(this.things, {id: thingId});
    //   this.$forceUpdate();
    // },

    //clickDeleteThing: async function(){
    clickDeleteThing: function(thingId){
      console.log('clicked the "delete" button!');
      this.confirmDeleteThingModalOpen = true;
      this.selectedThing = _.find(this.things, {id: thingId});
    },

    closeDeleteThingModal: function(){
      this.selectedThing = undefined;
      this.confirmDeleteThingModalOpen = false;
    },

    handleParsingDeleteThingForm: function(){
      // that we pass to the cloud sdk methods
      return{
        id: this.selectedThing.id
      };
    },

    submittedDeleteThingForm: function(){
      console.log('ok it worked!');
      _.remove(this.things, { id: this.selectedThing.id});
      this.$forceUpdate();

      this.confirmDeleteThingModalOpen = false;
      this.selectedThing = undefined;
    },

    clickAddButton: function(){
      console.log('click add');
      this.uploadThingModalOpen = true;
    },

    _clearUploadThingModal: function(){
      // Close modal
      this.uploadThingModalOpen = false;
      // Reset form data
      this.uploadFormData = {
        label: '',
        photo: undefined
      };
      // Clear error states
      this.formErrors = {};
      this.cloudError = '';
    },

    closeUploadThingModal: function(){
      this._clearUploadThingModal();  // we use underscore "_" because is a private method
    },

    handleParsingUploadThingForm: function(){
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.uploadFormData;

      // TODO: validations go here

      // if there where any issues, they´ve already now been communicated to the user,
      // so simply return undefined. (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0){
        return;
      }

      return argins;
    },

    submittedUploadThingForm: function(result) {
      // var newItem = _.extend(result, {
      //   label: this.uploadFormData.label,
      //   isBorrowed: false,
      //   owner: {
      //     id: this.me.id,
      //     fullName : this.me.fullName
      //   }
      // });

      // // // Add the new thing to the list
      // this.things.unshift(newItem);

      this.things.push({
        label: this.uploadFormData.label,
        id: result.id,
        owner: {
          id: this.me
        }
      });

      // Close the modal.
      this._clearUploadThingModal();
    },

    changeFileInput: function(files) {
      if (files.length !== 1 && !this.uploadFormData.photo) {
        throw new Error('Consistency violation: `changeFileInput` was somehow called with an empty array of files, or with more than one file in the array!  This should never happen unless there is already an uploaded file tracked.');
      }
      var selectedFile = files[0];

      // If you cancel from the native upload window when you already
      // have a photo tracked, then we just avast (return early).
      // In this case, we just leave whatever you had there before.
      if (!selectedFile && this.uploadFormData.photo) {
        return;
      }

      this.uploadFormData.photo = selectedFile;

      // Set up the file preview for the UI:
      var reader = new FileReader();
      reader.onload = (event)=>{
        this.uploadFormData.previewImageSrc = event.target.result;

        // Unbind this "onload" event.
        delete reader.onload;
      };
      // Clear out any error messages about not providing an image.
      this.formErrors.photo = false;
      reader.readAsDataURL(selectedFile);

    },

  }
});
