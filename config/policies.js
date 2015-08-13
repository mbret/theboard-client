/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

    // Revoke all by default
    '*': false,

    // Views are accessible but some part are revoked when logged or not
    'view': {
        'index'         : ['sessionAuthOrRedirect'],
        'configuration' : true, // true is needed because configuration is accessible even for signin / signup
        'user'          : ['sessionAuth'],
        'flash'         : ['sessionAuth'],
        'signin'        : ['notAuthenticated'],
        'signup'        : ['notAuthenticated'],
    },
    
    //
    'auth': {
        'signin': true,
        'signup': true,
        'provider': true,
        'callback': true,
        'logout': ['sessionAuthOrRedirect']
    },
    
    // Only available for logged user
    'profile': {
        '*': ['sessionAuth']
    },
    'widget': {
        '*': ['sessionAuth']
    },
    'account': {
        '*': ['sessionAuth']
    },
    'repository': {
        '*': ['sessionAuth']
    }
};
