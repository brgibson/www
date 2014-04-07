/**
 * A function which takes a string of tabular contact data and returns the
 * list of contacts as semantic markup or JSON.
 * 
 * @param {string} tabularContactsStr - example string: <tr><td class="hd"><p style="height: 16px;">.</p></td><td class="s2">Amar</td><td class="s3">amardeep@live.com</td><td class="s3">408-555-1234</td><td class="s3">555 Halford Ave.</td><td class="s3">Apartment #43C</td><td class="s3">Santa Clara</td><td class="s3">CA</td><td class="s4">95051</td></tr>
 * @param {*} [asJSON] - a flag to return the output as JSON
 * @param {*} [encodeSpecialCharacters] - a flag to encode html characters for display in a pre tag
 */
var convertTabularContactData = (function() {

    /**
     * Initialization section
     */

    /* an object to parse the tabular entries in data.html */
    var dataParser = (function() {
        
        /* private variable */
        var _dataToParse = "";

        /* helper functions */
        var removeNewlines = function(str) {
            return str.replace(/\n/g, " ");
        };

        var get = function(type) {
            var tdIndex;
            switch (type) {
                case  "name": tdIndex = 2; break;
                case "email": tdIndex = 3; break;
                case "phone": tdIndex = 4; break;
                case "line1": tdIndex = 5; break;
                case "line2": tdIndex = 6; break;
                case  "city": tdIndex = 7; break;
                case "state": tdIndex = 8; break;
                case   "zip": tdIndex = 9; break;
            }
            
            var getRegex = function(tdIndex) {
                var regexStr = ""
                for (var i = 1; i < tdIndex; i++) {
                    regexStr += "td.+?td.+?";
                }
                regexStr += ">(.+?)<.+?";
                return new RegExp(regexStr, "g");
            };
            
            var result = getRegex(tdIndex).exec(_dataToParse);
            return result && result[1];
        };
        
        /* object to be returned */
        return {
            setDataToParse : function (dataStr) {
                _dataToParse = removeNewlines(dataStr);
            },
            getName : function() {
                return get("name");
            },
            getEmail : function() {
                return get("email");
            },
            getPhone : function() {
                return get("phone");
            },
            getAddressLine1 : function() {
                return get("line1");
            },
            getAddressLine2 : function() {
                return get("line2");
            },
            getCity : function() {
                return get("city");
            },
            getState : function() {
                return get("state");
            },
            getZip : function() {
                return get("zip");
            },
            getAddress : function() {
                return "" || "\n    " + 
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
        var encodeSpecialCharacters = function(str) {
            return str
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/\//g, "&frasl;")
                    ;
        };

        /* object to be returned */
        return {
            setDataParser : function(dataParser) { 
                _dataParser = dataParser; 
            },
            setEncodeSpecialCharactersFlag : function(encodeSpecialCharactersFlag) { 
                _encodeSpecialCharactersFlag = encodeSpecialCharactersFlag;
            },
            getMarkup : function() { 
                var markup = "<li>" +
                                "<dl class='singleContact' itemscope itemtype='http://schema.org/Person'>" + 
                                    "<dt class='name' data-type='name' itemprop='name'>"+ _dataParser.getName() +"</dt>" + 
                                    "<dd class='details'>" + //wrapping the details in one term so styling can be easily applied
                                        "<dl>" +
                                            "<dt>Photo</dt>" +
                                            "<dd class='image'><img src='./images/"+ _dataParser.getName().toLowerCase() +".gif' itemprop='image'></dd>" +                     

                                            "<dt>Email</dt>" + 
                                            "<dd class='email' data-type='email'>" +
                                                "<a href='mailto:"+ _dataParser.getEmail() +"' itemprop='email'>"+ _dataParser.getEmail() +"</a>" + 
                                            "</dd>" + 

                                            "<dt>Phone Number</dt>" + 
                                            "<dd class='phone' data-type='phone'>" + 
                                                "<a href='tel:"+ _dataParser.getPhone() +" itemprop='telephone'>"+ _dataParser.getPhone() +"</a>" +
                                            "</dd>" + 

                                            "<dt>Address</dt>" + 
                                            "<dd class='address' itemprop='address' itemscope itemtype='http://schema.org/PostalAddress'>" +
                                                "<meta class='none' itemprop='streetAddress' content='" + _dataParser.getAddressLine1() + " " + _dataParser.getAddressLine2() + "'>" + // added for schema.org microcontent
                                                "<span>" + _dataParser.getAddressLine1() + " - <a href='"+ _dataParser.getMapUrl() +"'>map</a></span>" + 
                                                (_dataParser.getAddressLine2() ? "<span>" + _dataParser.getAddressLine2() + "</span>" : "") + 
                                                "<span class='city' itemprop='addressLocality'>"+ _dataParser.getCity() +"</span>, " + 
                                                "<span class='state' itemprop='addressRegion '>"+ _dataParser.getState() +"</span>" + 
                                                "<span itemprop='postalCode'>"+ _dataParser.getZip() +"</span>" + 
                                            "</dd>" +

                                            "<dt>Chats</dt>" +
                                            "<dd><a href='"+ _dataParser.getChatsUrl() +"'>Chats</a></dd>" + 

                                            "<dt>Emails</dt>" + 
                                            "<dd><a href='"+ _dataParser.getEmailsUrl() +"'>Emails</a></dd>" + 
                                        "</dl>" + 
                                    "</dd>" + 
                                "</dl>" + 
                             "</li>"
                
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
    return function(tabularContactsStr, asJSON, encodeSpecialCharacters) {
        
        var formattedContacts = asJSON ? "[" : "";
        
        for (var i = 1, entries = tabularContactsStr.split("<tr>"); i < entries.length ; i++) {
            dataParser.setDataToParse(entries[i]);

            contactFormatter.setDataParser(dataParser);
            contactFormatter.setEncodeSpecialCharactersFlag(encodeSpecialCharacters);
            
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
