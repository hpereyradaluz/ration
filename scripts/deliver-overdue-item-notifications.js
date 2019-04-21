module.exports = {


  friendlyName: 'Deliver overdue item notifications',


  description: '',

  inputs: {

  },


  fn: async function () {

    // var overdueThings = await Thing.find({
    //   borrowedBy: { '!=': null },
    //   expectedReturnAT: { '<=': Date.now() - 1000*60*60*12}
    // });

    // for (let overdueThing of overdueThings ){


    // }//∞

    // // All done
    // return exists.success();
    var moment = require('moment');

    var overdueThings = await Thing.find({
      // Check for items that are 12 hrs away from being overdue.
      expectedReturnAt: { '<=': Date.now() -  1000*60*60*12 },
      borrowedBy: { '!=': null }
    })
    .populate('owner')
    .populate('borrowedBy');

    for (let overdueThing of overdueThings) {

      // Format our text for the notification email.
      var itemLabel = overdueThing.label || 'your borrowed item';
      var formattedExpectedReturnAt = moment(overdueThing.expectedReturnAt).format('dddd, MMMM Do');

      // Send the owner a notification email.
      await sails.helpers.sendTemplateEmail.with({
        to: overdueThing.borrowedBy.emailAddress,
        subject: `It's time to return ${overdueThing.owner.fullName}'s ${overdueThing.label || 'item'}!`,
        template: 'email-overdue-notice',
        templateData: {
          ownerName: overdueThing.owner.fullName,
          ownerEmail: overdueThing.owner.emailAddress,
          itemLabel: itemLabel,
          fullName: overdueThing.borrowedBy.fullName,
          expectedReturnAt: formattedExpectedReturnAt,
          baseUrl: sails.config.custom.baseUrl
        }
      });

    }//∞

  }


};
