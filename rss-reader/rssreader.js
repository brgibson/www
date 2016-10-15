var BRG = BRG || {};
BRG.RSS = BRG.RSS || {};

(function() {
    var RSS = BRG.RSS;
    var PROMISES;

    RSS.render = function(elements, rssFeedUrl) {
        PROMISES = PROMISES || BRG.PROMISES;
        if (!PROMISES) {
            window.console.error("The Promise library is not included on this page.")
            return false;
        }

        var containerElement = elements.containerElement;
        var titleContainerElement = elements.titleContainerElement;

        PROMISES.get(rssFeedUrl, {}, {isXmlRequest: true}).then(function(responseXml) {
            var xmlDocument = responseXml.documentElement;

            var blogTitle = xmlDocument.getElementsByTagName("title")[0].firstChild.nodeValue;
            var blogLink = xmlDocument.getElementsByTagName("link")[0].firstChild.nodeValue;
            var blogPosts = xmlDocument.getElementsByTagName("item");

            titleContainerElement.innerHTML += " - " + blogTitle;

            function formatCategories(blogPostCategories) {
                var categoriesMarkup = "";
                for (var i = 0; i < blogPostCategories.length; i++) {
                    categoriesMarkup += ", " + blogPostCategories[i].firstChild.nodeValue;
                }
                return categoriesMarkup.substring(2);
            }

            function formatBlogPost(blogPost) {
                var postTitle, postDescription, postLink, postCategories, postDate;

                postTitle = blogPost.getElementsByTagName("title")[0].firstChild.nodeValue;
                postDescription = blogPost.getElementsByTagName("description")[0].firstChild.nodeValue;
                postLink = blogPost.getElementsByTagName("link")[0].firstChild.nodeValue;
                postCategories = blogPost.getElementsByTagName("category");
                postDate = blogPost.getElementsByTagName("pubDate")[0].firstChild.nodeValue;

                return "<div>"
                    + "<a href='" + postLink + "'>" + "<h2>" + postTitle + "</h2>"
                    + formatCategories(postCategories)
                    + "<br/>" + postDate
//                    + "<br/>" + postDescription + "..."
                    + "</a></div>";
            }

            var container = document.createElement("div");

            var postElem;
            for (var i = 0; i < blogPosts.length; i++) {
                postElem = document.createElement("p");
                postElem.innerHTML = formatBlogPost(blogPosts[i]);
                container.appendChild(postElem);
            }

            containerElement.appendChild(container);
        });




        return true;
    }
})();