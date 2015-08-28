/**
 * Remove deleted user accounts
 * */

var _ = require('lodash');
//base class
var MiaJs = require('mia-js-core');
var Utils = MiaJs.Utils;
var CronJobs = MiaJs.CronJobs;
var BaseCronJob = CronJobs.BaseCronJob;
var Shared = MiaJs.Shared;

/**
 * Custom cron job
 */
module.exports = BaseCronJob.extend({},
    {
        disabled: false, // Enable /disable job definition
        time: {
            hour: '0-23',
            minute: '0-59',
            second: '0',
            dayOfMonth: '0-31',
            dayOfWeek: '0-7', // (0 or 7 is Sun, or use names)
            month: '0-12',   // names are also allowed
            timezone: 'CET'
        },

        isSuspended: false,
        debugOutput: false,
        allowedHosts: [],

        maxInstanceNumberTotal: 1,
        maxInstanceNumberPerServer: 1,

        identity: 'generic-removeUserAccounts', // Job name

        worker: function () {
            var userModel = Shared.models('generic-user-model');

            //Delete user accounts marked as deleted
            return userModel.remove(
                {
                    'status': 'deleted'
                },
                {
                    multi: true, validate: false
                }).then(function (data) {
                    if (data > 0) {
                        MiaJs.Logger('info', data + ' deleted user accounts removed from user collections');
                    }
                }).fail(function (err) {
                    MiaJs.Logger('err', err);
                }
            );
        },

        created: '2015-07-13T19:00:00', // Creation date
        modified: '2015-07-13T19:00:00' // Last modified date
    });