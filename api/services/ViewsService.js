/**
 * Created by Maxime on 1/15/2015.
 */
module.exports = {

    buildTitle: function(title){
        console.log("title" + title);
        title = title ? title : "";
        return sails.config.preTitle + ' ' + sails.config.titleSeparator + ' ' + title;
    }
    
};
