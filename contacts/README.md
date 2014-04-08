## Solution

### Summary

I believe I have good documentation in my code, but I will quickly summarize the files here and mention any
decisions that I think are noteworthy.  When you are ready to view the solution, please look at the 
`contacts.html` file.

#### Things to note

As i started development I wanted a way to generate the markup based on the contact entries from the data file
you provided me with.  This was important to me, because I didn't want to do a bunch of find/replace logic in
my editor each time I wanted to refactor my HTML, which is what would have happened had I hardcoded my markup
in the `contacts.html` file.  

While this was quite a bit of work upfront, it saved me enormous amounts of time
in the long run by allowing me to iterate quickly on my markup as I thought of more semantic ways to build it.
The js also supports returning the contacts as JSON, which I was planning to use to create a search box, but 
did not have time to implement (although I think it would only take an hour or two more to implement now that
the framework is built out).
- `convertTabularContactData.js` 
    - The file that creates the markup for the contacts list. A single update here will update all of the contacts.
    - Also supports returning the contacts as JSON, which I was planning to use to create a search box, but I did 
      not have time to implement (although I think it would only take an hour or two more to implement now that 
      the framework is built out).
- `formatContactData.html` - A test page I used while I was building the `convertTabularContactData.js.`
- `tabularContactData.js` - Containins a string version of the table rows from original contact data file.

To add the event handlers to the contacts list, I originally had one big anonymous function in contacts.html so 
that I would avoid having extra variables hanging around in my global scope, but I decided it was better to 
refactor these out into their own .js files for easier maintainability.  I feel this is a good trade-off.
- `attachClickHandlers.js` - Attaches the click handler to support seeing the contact details on touch devices.
- `buildDefaultDisplayEventHandler.js` - Builds the event handler for the email/phone default display select list.
- `getEmailAndPhoneElements.js` - Gets the email and phone DOM elements that are contained in the contact list.

Two quick helper functions I wrote to deal with adding and removing selectors
- `appendSelector.js`
- `removeSelector.js` 

#### Code design decisions

Even though it would probably not be necessary for a contacts widget, I added [schema.org microdata](http://schema.org/)
for each entry because it is important for any customer facing website to use microdata.

For EI8, the graying out of the non-highlighted contacts on click/hover does not work.  Since it still looked fine to me,
I didn't think it was necessary to add extra css or javascript to support for feature for IE8.  It works well in IE9.

I decided not to spend time adding hacks for IE7, in favor of adding a click event handler to support touch
devices.  Also, I was told IE7 is no longer supported and that I could ignore this requirement.

#### Things I would do differently

While trying to be clever, I believe I unintentionally started the Great Specificity War of 2014.  Initially I 
thought it would be good to specify my styles in terms of html elements (so I could save some bytes on selectors)
but this made my css dependent on my markup (duh!). For behavior like graying out the contacts and hiding/showing
elements it was a poor decision to to use html elements.  I also thought it would be clever to use the child selector,
`>`, to target specific definition lists instead of using selectors, but it turned into a giant headache.
Doing this again (or taking a bit more time to refactor), I would make sure to use the least specific selectors 
possible and depend on classnames instead of the html markup for my styling.

Also, if this were not in a challenge setting, I would have reached out to my co-workers with a couple of css questions.
For example, I'm wondering if there is a better and more maintainable way to partially hide the top-left border for the
contact details (so when the contact is expanded, it appears that the name flows into the full contact details. I 
implemented this with the :after pseudo-selector, but I'm curious if there is a better solution.

## Challenge Description

In [mockup.png](./mockup.png?raw=true) are three states of a new contacts widget that could be used on
a hypothetical consumer-facing website.  The widget may be anywhere on the
page. Designers will also use this in mocks for usability tests.
 
Please create the HTML, CSS, and JavaScript for the widget as described in the
image. Your solution must work in Firefox 3.5+ and IE7+.  

Do not use any JavaScript libraries that you did not write yourself. Bonus 
points will be given to a solution that degrades nicely on older browsers and
is reusable across multiple pages and sites.

The data is provided in [data.html](./data.html)

The mockup is included below.

![Contacts Mockup](./mockup.png?raw=true)