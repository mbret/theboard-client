/**
 * Created by mbret on 12/10/2015.
 */
module.exports = function(label, json){

    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', 0);
    res.send('window.' + label + ' = ' + JSON.stringify( json ) + ';');

};