'use strict';

/**
 *
 * @param data
 * @param options
 */
module.exports = function sendCreated(data) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    sails.log.silly('res.created() :: Sending 201 ("CREATED") response');

    // Set status code
    res.status(201);

    return res.jsonx(data);

};
