javascript:(function () {

    /* options */
    const ENABLE_FIVE_SECOND_TESTING = true; /* toggle this to false when you are done testing locally */
    const ENABLE_SOUNDS = true;
    const ENABLE_ALERTS_IN_TAB = false;
    const ENABLE_USE_A_NEW_WINDOW_AS_AN_ALERT = true;
    const ENABLE_UPDATE_TAB_TITLE = true;

    const TAB_TITLE_OPTIONS_ENUM = { TIMER_WITH_AUTO_STOP: 'timerWithAutoStop', TIMER_WITH_NEGATIVE: 'timerWithNegative',  INITIAL_TIME: 'initialTime' };
    const TAB_TITLE_OPTION = ENABLE_UPDATE_TAB_TITLE && TAB_TITLE_OPTIONS_ENUM.TIMER_WITH_AUTO_STOP;

    let MINUTES_UNTIL_ALERT;
    if (ENABLE_FIVE_SECOND_TESTING) {
        MINUTES_UNTIL_ALERT = (1 / 60 * 5); /* 5 seconds for testing purposes */
    } else {
        MINUTES_UNTIL_ALERT = 50; /* in minutes */
    }

    const ALERT_TEXT = `It's been ${Math.ceil(MINUTES_UNTIL_ALERT)} min, re-login so you don't lose your work!`;

    const NEW_TAB_URL = `https://www.google.com/?q=${ALERT_TEXT}`;
    const NEW_TAB_NAME = "Timeout Alert";

    const SELECTED_SOUND = ENABLE_SOUNDS && new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    const TIME_BETWEEN_SOUNDS = ENABLE_SOUNDS && 500; /* in milliseconds */
    const NUM_TIMES_SOUND_PLAYED = ENABLE_SOUNDS && 3;
    /* end options */

    /* handle cancelling */
    let shouldCancelTimers = false;
    window._TIMER_BOOKMARKLET = window._TIMER_BOOKMARKLET || {};
    window._TIMER_BOOKMARKLET.timeouts = window._TIMER_BOOKMARKLET.timeouts || [];
    window._TIMER_BOOKMARKLET.intervals = window._TIMER_BOOKMARKLET.intervals || [];

    if (window._TIMER_BOOKMARKLET.timerId) {
        clearInterval(window._TIMER_BOOKMARKLET.timerId);
        window._TIMER_BOOKMARKLET.timerId = undefined;
        shouldCancelTimers = true;
    }

    if (window._TIMER_BOOKMARKLET.timeouts && window._TIMER_BOOKMARKLET.timeouts.length > 0) {
        while (window._TIMER_BOOKMARKLET.timeouts.length > 0) {
            let timeoutId = window._TIMER_BOOKMARKLET.timeouts.pop();
            clearTimeout(timeoutId);
        }
        shouldCancelTimers = true;
    }

    if (shouldCancelTimers) {
        if (ENABLE_UPDATE_TAB_TITLE) {
            document.title = `Timers cleared`;
        }
        return;
    }
    /* end handle cancelling */

    function doAlert() {
        if (ENABLE_USE_A_NEW_WINDOW_AS_AN_ALERT) {
            var win = window.open(NEW_TAB_URL, NEW_TAB_NAME, "modal=yes");
            win.focus();
        }

        if (ENABLE_ALERTS_IN_TAB) {
            window.alert(ALERT_TEXT);
        }
    }

    const msToAlert = MINUTES_UNTIL_ALERT * 60000;

    function beep() {
        SELECTED_SOUND.play();
    }

    function addTimerToTitle({ isAutoStop } = {}) {
        let minutesLeft = MINUTES_UNTIL_ALERT >= 1 ? MINUTES_UNTIL_ALERT - 1 : 0;
        let secondsLeft = MINUTES_UNTIL_ALERT >= 1 ? 59 : (MINUTES_UNTIL_ALERT * 60);
        let timerExpired = false;

        const timerHandler = () => {
            document.title = `${timerExpired ? '-' : ''}${minutesLeft}:${secondsLeft > 9 ? secondsLeft : `0${secondsLeft}`}`;

            if (!timerExpired) {
                if (secondsLeft === 1) {
                    if (minutesLeft === 0) {
                        timerExpired = true;
                    } else {
                        minutesLeft--;
                    }
                }

                if (secondsLeft === 0) {
                    secondsLeft = 59;
                } else {
                    secondsLeft--;
                }
            } else {
                if (isAutoStop && window._TIMER_BOOKMARKLET.timerId) {
                    clearInterval(window._TIMER_BOOKMARKLET.timerId);
                    window._TIMER_BOOKMARKLET.timerId = undefined;
                    document.title = `0:00 (${new Date().toLocaleTimeString('en-US')})`
                }

                if (secondsLeft === 59) {
                    minutesLeft++;
                    secondsLeft = 0;
                } else {
                    secondsLeft++;
                }
            }
        };

        timerHandler();
        window._TIMER_BOOKMARKLET.timerId = setInterval(timerHandler, 1000);
    }

    function fireAlert() {
        let i = 0;
        if (ENABLE_SOUNDS) {
            for (i = 0; i < NUM_TIMES_SOUND_PLAYED; i++) {
                window._TIMER_BOOKMARKLET.timeouts.push(setTimeout(beep, i * TIME_BETWEEN_SOUNDS));
            }
        }

        window._TIMER_BOOKMARKLET.timeouts.push(setTimeout(doAlert, i * TIME_BETWEEN_SOUNDS));
    }

    window._TIMER_BOOKMARKLET.timeouts.push(setTimeout(fireAlert, msToAlert));

    switch (TAB_TITLE_OPTION) {
        case TAB_TITLE_OPTIONS_ENUM.TIMER_WITH_AUTO_STOP:
            addTimerToTitle({ isAutoStop: true });
            break;
        case TAB_TITLE_OPTIONS_ENUM.TIMER_WITH_NEGATIVE:
            addTimerToTitle({ isAutoStop: false });
            break;
        case TAB_TITLE_OPTIONS_ENUM.INITIAL_TIME:
            document.title = `${new Date().toLocaleTimeString('en-US')} (${Math.round(MINUTES_UNTIL_ALERT)} min timer set)`;
            break;
        default:
            break;
    }
})();
