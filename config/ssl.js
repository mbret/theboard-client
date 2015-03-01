/**
 * Created by Maxime on 3/1/2015.
 */
module.exports.ssl = {
    // SSL configuration
    // http://www.cert-depot.com/
    // http://www.mobilefish.com/services/ssl_certificates/ssl_certificates.php
    ca: require('fs').readFileSync(__dirname + '/ssl/app.csr'),
    key: require('fs').readFileSync(__dirname + '/ssl/app.private.key'),
    cert: require('fs').readFileSync(__dirname + '/ssl/app.cert')

};
    
