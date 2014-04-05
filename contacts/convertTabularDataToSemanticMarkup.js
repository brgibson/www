/**
 * convertTabularDataToSemanticMarkup is a function which  
 * takes a string of tabular contact data and returns semantic
 * markup.  Takes an optional flag to encodeSpecialCharacters.
 */
var convertTabularDataToSemanticMarkup = (function() {

    /**
     * Initialization section
     */

    /* an object to parse the tabular entries in data.html */
    var dataParser = (function() {
        
        /* private variable */
        var _dataToParse = "";

        /* helper functions */
        function removeNewlines(str) {
            return str.replace(/\n/g, " ");
        }

        function getString(regex) {
            var result = regex.exec(_dataToParse);
            return result && result[1];
        }

        /* object to be returned */
        return {
            setDataToParse : function (dataStr) {
                _dataToParse = removeNewlines(dataStr);
            },
            getName : function() {
                return getString(/s2\">(.+?)<.*/g);
            },
            getEmail : function() {
                return getString(/s3\">(.+?)<.*/g);
            },
            getPhone : function() {
                return getString(/s3.+?s3\">(.+?)<.*/g);
            },
            getAddress : function() {
                var line1 = getString(/s3.+?s3.+?s3\">(.+?)<.*/g);
                var line2 = getString(/s3.+?s3.+?s3.+?s3\">(.+?)<.*/g);
                var city = getString(/s3.+?s3.+?s3.+?s3.+?s3\">(.+?)<.*/g);
                var state = getString(/s3.+?s3.+?s3.+?s3.+?s3.+?s3\">(.+?)<.*/g);
                var zip = getString(/s4\">(.+?)<.*/g);

                return "\n    " + 
                    line1 + "\n    " + 
                    line2 + "\n    " + 
                    city + ", " + state + "\n    " + 
                    zip;
            },
            getMapUrl : function() {
                return "#";
            },
            getChatsUrl : function() {
                return "#";
            },
            getEmailsUrl : function() {
                return "#";
            }
        }
    })();

    /* an object to build the markup that we want for the entries in our contacts widget */
    var markupBuilder = (function() {
        /* private variables */
        var _markup;
        var _encodeSpecialCharactersFlag;

        /* helper function */
        function encodeSpecialCharacters(str) {
            return str
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/\//g, "&frasl;")
                    ;
        }

        /* object to be returned */
        return {
            init : function(encodeSpecialCharactersFlag) { 
                _markup = ""; 
                _encodeSpecialCharactersFlag = encodeSpecialCharactersFlag;
            },
            getMarkup : function() { 
                if (_encodeSpecialCharactersFlag) {
                    return encodeSpecialCharacters(_markup + "\n");    
                } else {
                    return _markup;    
                }
            },
            addName : function(name) { 
                _markup += "<dt class='name'>"+ name +"</dt>\n"; 
            },
            addEmail : function(email) { 
                _markup += "<dd class='email'>"+ email +"</dd>\n"; 
            },
            addPhone : function(phone) { 
                _markup += "<dd class='phone'>"+ phone +"</dd>\n"; 
            },
            addAddress : function(address) { 
                _markup += "<dd class='address'>"+ address +"\n</dd>\n"; 
            },
            addMapUrl : function(mapUrl) { 
                _markup += "<dd><a href='"+ mapUrl +"'>map</a></dd>\n"; 
            },
            addChatsUrl : function(chatsUrl) { 
                _markup += "<dd><a href='"+ chatsUrl +"'>Chats</a></dd>\n"; 
            },
            addEmailsUrl : function(emailsUrl) { 
                _markup += "<dd><a href='"+ emailsUrl +"'>Emails</a></dd>\n"; 
            }
        };            


    })();

    /**
     * Return the function we will be using to convert the data.
     */
    return function(str, encodeSpecialCharactersFlag) {
        var markup = "";
        for (var i = 1, entries = str.split("<tr>"); i < entries.length ; i++) {
            dataParser.setDataToParse(entries[i]);

            markupBuilder.init(encodeSpecialCharactersFlag);
            markupBuilder.addName(dataParser.getName());
            markupBuilder.addEmail(dataParser.getEmail());
            markupBuilder.addPhone(dataParser.getPhone());
            markupBuilder.addAddress(dataParser.getAddress());
            markupBuilder.addMapUrl(dataParser.getMapUrl());
            markupBuilder.addChatsUrl(dataParser.getChatsUrl());
            markupBuilder.addEmailsUrl(dataParser.getEmailsUrl());

            markup += markupBuilder.getMarkup();
        }
        return markup;
    };
})();
