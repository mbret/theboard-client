var path = require('path');
/**
 * Created by Maxime on 3/1/2015.
 */
module.exports.paths = {
    assets: path.normalize(__dirname + '/../assets'),
    imagesAssets: path.normalize(__dirname + '/../assets/images'),
    data: path.normalize(__dirname + '/../data'),
    publicData: path.normalize(__dirname + '/../data/statics/public')
};