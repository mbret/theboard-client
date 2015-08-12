/**
 * This service will be automatically injected to locals under the name .helper
 * Inside your view just use helper.getUrl(...) for example.
 *
 * Here are some sails already injected var https://github.com/balderdashy/sails/blob/master/lib/hooks/request/locals.js
 */
var url = require('url');
module.exports = {

    /**
     *
     * @param url
     * @returns {*}
     */
    getUrl: function(myUrl){
        return url.resolve(sails.getBaseUrl(), myUrl);
    },
};