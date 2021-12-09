# New Relic Logout Alert Bookmarklet

[timer-bookmarklet.js](/timer-bookmarklet/timer-bookmarklet.js)

A timer bookmarklet to help alert you that a certain amount of time has passed (or anything else that you want to set an alarm for).
  
In my case I was trying to prevent new-relic logouts, which would catch me by surprise

## Default Configuration

- *ENABLE_FIVE_SECOND_TESTING*: **true** `/* toggle this to false when you are done testing locally */`
- *ENABLE_SOUNDS*: **true**
- *ENABLE_ALERTS_IN_TAB*: **false**
- *ENABLE_USE_A_NEW_WINDOW_AS_AN_ALERT*: **true**
- *ENABLE_UPDATE_TAB_TITLE*: **true**
- *TAB_TITLE_OPTION*: **TAB_TITLE_OPTIONS_ENUM.TIMER_WITH_AUTO_STOP** (enum options: `TIMER_WITH_AUTO_STOP`, `TIMER_WITH_NEGATIVE`, `INITIAL_TIME`)
- *MINUTES_UNTIL_ALERT*: **50**

## Default Usage

<em>See [Installation Instruction](#installation-instruction) section below on how to install the bookmarklet</em>

1. Click the bookmarklet to set a timer for your specified duration.  Notice the timer will appear in your tab name (Note: you can click the bookmarklet again to cancel your timers).
2. When your timer is done counting down, it will stop at zero and display the timestamp of when it stopped.  It will also play the default sound three times before opening the reminder window.
3. A popup will appear to remind you to re-login to new relic so you don't lose your work.
4. You can click the bookmarklet again to clear the timers and stop the pending alert.

## Installation Instruction

Installs like any other bookmarklet.

1. Create a placeholder bookmark.
2. Edit your bookmark and add the script where the url would normally go.
3. Give it a test from the webpage you want to execute the JS from.
4. Make sure sounds and popups are working (if you want those configurations).
5. Adjust any other configurations (see code).

## Troubleshooting
- Make sure you are clicking the bookmarklet from an actual webpage and not a blank tab.  I have run into issue where it doesn't do anything.
- Be careful when editing bookmarklets.  You must use `/* ... */` style comments because often the code gets squashed into a single line and `//` would comment out ALL code after it, not just until the newline character.  Check your developer tools console.
- Be careful when editing bookmarklets.  You need semi-colons at the end of every line.  This is because the browser will typically strip all newlines from your script when you save the bookmarklet. Check your developer tools console.
- There are certain websites that will have problems playing the sound. Check your developer tools console.
