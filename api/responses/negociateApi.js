/**
 *
 * @param data
 * @param options
 */
module.exports = function negociateApi(httpIncomingMessage){

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    sails.log.info('res.negociateApi(): Sending %s response', httpIncomingMessage.statusCode);

    // Set status code
    res.status(httpIncomingMessage.statusCode);

    return res.jsonx();

};
