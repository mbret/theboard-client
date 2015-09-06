(function(){

    window.theboardUtils = {

        messages:{
            error: {

            }
        },

        handleError: function( err ){
            document.body.innerHTML = '<div class="widget-error">Widget on error!</div>';
            console.error( err );
        },

        /**
         * Be careful to not refresh page when removing hash
         */
        resetSignal: function(){
            window.location.hash = '#';
        },

        /**
         *
         * - take care of eventual hash and ignore it
         * @returns {Array}
         */
        getUrlVars: function(){
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

            // remove eventual hash
            var indexOfLastHash = hashes[hashes.length -1].lastIndexOf('#');
            indexOfLastHash = (indexOfLastHash > -1) ? indexOfLastHash : hashes[hashes.length -1].length; // -1 means the were no hash
            hashes[hashes.length -1] = hashes[hashes.length -1].substring(0, indexOfLastHash); // take all string or only good part

            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('='); // get var name and its value into array
                // only continue if a var has a value
                if( hash.length > 1 ){
                    vars.push(hash[0]);
                    // URI.js use encodeURIComponent
                    // I don't know why but (+) are not decoded in ' ' as it should ?
                    vars[hash[0]] = decodeURIComponent(hash[1].replace('+', ' '));
                }
            }
            // remove hash for last if there is
            var hashToRemove = window.location.hash;
            if(hashToRemove){
                for( var i = 0 ; i<vars.length ; i++){
                    vars[vars[i]] = vars[vars[i]].replace( window.location.hash, '');
                }
            }
            return vars;
        },

        checkValidityOfJsonFromUrl: function(jsonToParse){
            try{
                return JSON.parse(jsonToParse);
            }
            catch(e){
                return false;
            }
        },

        convertUnixTsToDate: function( unixTS ){
            // create a new javascript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds
            var date = new Date(unixTS*1000);
            return date;
        }

    }

})();