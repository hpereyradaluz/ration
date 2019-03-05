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
      label: ''
    },

    // Syncing / loading state
    syncing: false,

    // Validation errors:
    formErrors: {},

    // Server error state:
    cloudError: ''
  },

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
        label: ''
      };
      // Clear error states
      this.formErrors = {};
      this.cloudError = '';
    },

    closeUploadThingModal: function(){
      this._clearUploadThingModal();
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

    submittedUploadThingForm: function(result){

      // TODO

      // Close the modal.
      this._clearUploadThingModal();
    },

  }
});
