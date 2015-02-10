/**
 * Created by Maxime on 1/15/2015.
 */

var rootPath = __dirname + '/../..';
var fs = require('fs');

module.exports = {

    createDataDir: function(cb){
        this._ensureExists( rootPath + '/data', 0744, function(err){
            if(err){
                return cb(err);
            }
            return cb();
        });
    },

    /**
     * Found here http://stackoverflow.com/questions/21194934/node-how-to-create-a-directory-if-doesnt-exist
     *
     * That doesn't handle:
     *  - What happens if the folder gets deleted while your program is running? (assuming you only check that it exists once during startup)
     *  - What happens if the folder already exists but with the wrong permissions?
     * @param path
     * @param mask
     * @param cb
     * @private
     */
    _ensureExists: function(path, mask, cb) {
        if (typeof mask === 'function') { // allow the `mask` parameter to be optional
            cb = mask;
            mask = 0777;
        }
        fs.mkdir(path, mask, function(err) {
            if (err) {
                if (err.code === 'EEXIST'){
                    cb(null); // ignore the error if the folder already exists
                }
                else{
                    cb(err); // something else went wrong
                }
            } else{
                cb(null); // successfully created folder
            }
        });
    }
};