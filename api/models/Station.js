/**
 * Station model
 * @description At least one profile should exist for every users
 */
var Station = {
    
    // Enforce model schema in the case of schemaless databases
    schema: true,
    
    attributes: {
        user        : { model: 'user', required: true },
        profile        : { model: 'profile', required: true }
    }

};

module.exports = Station;
