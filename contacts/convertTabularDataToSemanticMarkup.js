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
            getAddressLine1 : function() {
                return getString(/s3.+?s3.+?s3\">(.+?)<.*/g);
            },
            getAddressLine2 : function() {
                return getString(/s3.+?s3.+?s3.+?s3\">(.+?)<.*/g);
            },
            getCity : function() {
                return getString(/s3.+?s3.+?s3.+?s3.+?s3\">(.+?)<.*/g);
            },
            getState : function() {
                return getString(/s3.+?s3.+?s3.+?s3.+?s3.+?s3\">(.+?)<.*/g);
            },
            getZip : function() {
                return getString(/s4\">(.+?)<.*/g);
            },
            getAddress : function() {
                return "\n    " + 
                    this.getAddressLine1() + "\n    " + 
                    this.getAddressLine2() + "\n    " + 
                    this.getCity() + ", " + this.getState() + "\n    " + 
                    this.getZip();
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
    var contactFormatter = (function() {
        /* private variables */
        var _dataParser;
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
            setDataParser : function(dataParser) { 
                _dataParser = dataParser; 
            },
            setEncodeSpecialCharactersFlag : function(encodeSpecialCharactersFlag) { 
                _encodeSpecialCharactersFlag = encodeSpecialCharactersFlag;
            },
            getMarkup : function() { 
                var markup = "";
                markup += "<dt class='name'>"+ _dataParser.getName() +"</dt>\n"; 
                markup += "<dd class='email'>"+ _dataParser.getEmail() +"</dd>\n"; 
                markup += "<dd class='phone'>"+ _dataParser.getPhone() +"</dd>\n"; 
                markup += "<dd class='address'>"+ _dataParser.getAddress() +"\n</dd>\n"; 
                markup += "<dd><a href='"+ _dataParser.getMapUrl() +"'>map</a></dd>\n"; 
                markup += "<dd><a href='"+ _dataParser.getChatsUrl() +"'>Chats</a></dd>\n"; 
                markup += "<dd><a href='"+ _dataParser.getEmailsUrl() +"'>Emails</a></dd>\n"; 
               
                return _encodeSpecialCharactersFlag ? encodeSpecialCharacters(markup + "\n") : markup;    
            },
            getJSON : function() {
                var formatJSONString = function(key, value, omitComma) {
                    var str = '"'+ key +'":"'+ value +'"';
                    return omitComma ? str: str  + ",";
                };
                var formatJSONObject = function(key, value, omitComma) {
                    var str = '"'+ key +'":'+ value +'';
                    return omitComma ? str: str  + ",";
                };
                
                var json = "{";
                json += formatJSONString("name", _dataParser.getName());
                json += formatJSONString("email", _dataParser.getEmail());
                json += formatJSONString("phone", _dataParser.getPhone());
                json += formatJSONObject("address", "{" 
                                    + formatJSONString("line1", _dataParser.getAddressLine1())
                                    + formatJSONString("line2", _dataParser.getAddressLine2())
                                    + formatJSONString("city", _dataParser.getCity())
                                    + formatJSONString("state", _dataParser.getState())
                                    + formatJSONString("zip", _dataParser.getZip(), "omitComma")
                                    + "}");
                json += formatJSONString("mapUrl", _dataParser.getMapUrl());
                json += formatJSONString("chatsUrl", _dataParser.getChatsUrl());
                json += formatJSONString("emailsUrl", _dataParser.getEmailsUrl(), "omitComma");
                json += "}";
                
                return _encodeSpecialCharactersFlag ? encodeSpecialCharacters(json + "\n") : json;    
            }
        };            


    })();

    /**
     * Return the function we will be using to convert the data.
     */
    return function(str, encodeSpecialCharactersFlag, asJSON) {
        
        var formattedContacts = asJSON ? "[" : "";
        
        for (var i = 1, entries = str.split("<tr>"); i < entries.length ; i++) {
            dataParser.setDataToParse(entries[i]);

            contactFormatter.setDataParser(dataParser);
            contactFormatter.setEncodeSpecialCharactersFlag(encodeSpecialCharactersFlag);
            
            formattedContacts += asJSON 
                ? contactFormatter.getJSON() + ","
                : contactFormatter.getMarkup();
        }
        
        if (formattedContacts.length > 1) {
            return asJSON 
                ? formattedContacts.substring(0, formattedContacts.length - 1) + "]"
                : formattedContacts;
        } else {
            return "";
        }
    };
})();
