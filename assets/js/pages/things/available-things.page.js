parasails.registerPage('available-things', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    things: [],
    confirmDeleteThingModalOpen: false,
    selectedThing: undefined,

    // Syncing / loading state
    syncing: false,

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
    }


  }
});
