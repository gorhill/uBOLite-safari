/*******************************************************************************

    uBlock Origin Lite - a comprehensive, MV3-compliant content blocker
    Copyright (C) 2014-present Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock

*/

// ruleset: annoyances-cookies

// Important!
// Isolate from global scope

// Start of local scope
(function uBOL_trustedClickElement() {

/******************************************************************************/

function trustedClickElement(
    selectors = '',
    extraMatch = '',
    delay = ''
) {
    const safe = safeSelf();
    const logPrefix = safe.makeLogPrefix('trusted-click-element', selectors, extraMatch, delay);

    if ( extraMatch !== '' ) {
        const assertions = safe.String_split.call(extraMatch, ',').map(s => {
            const pos1 = s.indexOf(':');
            const s1 = pos1 !== -1 ? s.slice(0, pos1) : s;
            const not = s1.startsWith('!');
            const type = not ? s1.slice(1) : s1;
            const s2 = pos1 !== -1 ? s.slice(pos1+1).trim() : '';
            if ( s2 === '' ) { return; }
            const out = { not, type };
            const match = /^\/(.+)\/(i?)$/.exec(s2);
            if ( match !== null ) {
                out.re = new RegExp(match[1], match[2] || undefined);
                return out;
            }
            const pos2 = s2.indexOf('=');
            const key = pos2 !== -1 ? s2.slice(0, pos2).trim() : s2;
            const value = pos2 !== -1 ? s2.slice(pos2+1).trim() : '';
            out.re = new RegExp(`^${this.escapeRegexChars(key)}=${this.escapeRegexChars(value)}`);
            return out;
        }).filter(details => details !== undefined);
        const allCookies = assertions.some(o => o.type === 'cookie')
            ? getAllCookiesFn()
            : [];
        const allStorageItems = assertions.some(o => o.type === 'localStorage')
            ? getAllLocalStorageFn()
            : [];
        const hasNeedle = (haystack, needle) => {
            for ( const { key, value } of haystack ) {
                if ( needle.test(`${key}=${value}`) ) { return true; }
            }
            return false;
        };
        for ( const { not, type, re } of assertions ) {
            switch ( type ) {
            case 'cookie':
                if ( hasNeedle(allCookies, re) === not ) { return; }
                break;
            case 'localStorage':
                if ( hasNeedle(allStorageItems, re) === not ) { return; }
                break;
            }
        }
    }

    const getShadowRoot = elem => {
        // Firefox
        if ( elem.openOrClosedShadowRoot ) {
            return elem.openOrClosedShadowRoot;
        }
        // Chromium
        if ( typeof chrome === 'object' ) {
            if ( chrome.dom && chrome.dom.openOrClosedShadowRoot ) {
                return chrome.dom.openOrClosedShadowRoot(elem);
            }
        }
        return null;
    };

    const querySelectorEx = (selector, context = document) => {
        const pos = selector.indexOf(' >>> ');
        if ( pos === -1 ) { return context.querySelector(selector); }
        const outside = selector.slice(0, pos).trim();
        const inside = selector.slice(pos + 5).trim();
        const elem = context.querySelector(outside);
        if ( elem === null ) { return null; }
        const shadowRoot = getShadowRoot(elem);
        return shadowRoot && querySelectorEx(inside, shadowRoot);
    };

    const selectorList = safe.String_split.call(selectors, /\s*,\s*/)
        .filter(s => {
            try {
                void querySelectorEx(s);
            } catch {
                return false;
            }
            return true;
        });
    if ( selectorList.length === 0 ) { return; }

    const clickDelay = parseInt(delay, 10) || 1;
    const t0 = Date.now();
    const tbye = t0 + 10000;
    let tnext = selectorList.length !== 1 ? t0 : t0 + clickDelay;

    const terminate = ( ) => {
        selectorList.length = 0;
        next.stop();
        observe.stop();
    };

    const next = notFound => {
        if ( selectorList.length === 0 ) {
            safe.uboLog(logPrefix, 'Completed');
            return terminate();
        }
        const tnow = Date.now();
        if ( tnow >= tbye ) {
            safe.uboLog(logPrefix, 'Timed out');
            return terminate();
        }
        if ( notFound ) { observe(); }
        const delay = Math.max(notFound ? tbye - tnow : tnext - tnow, 1);
        next.timer = setTimeout(( ) => {
            next.timer = undefined;
            process();
        }, delay);
        safe.uboLog(logPrefix, `Waiting for ${selectorList[0]}...`);
    };
    next.stop = ( ) => {
        if ( next.timer === undefined ) { return; }
        clearTimeout(next.timer);
        next.timer = undefined;
    };

    const observe = ( ) => {
        if ( observe.observer !== undefined ) { return; }
        observe.observer = new MutationObserver(( ) => {
            if ( observe.timer !== undefined ) { return; }
            observe.timer = setTimeout(( ) => {
                observe.timer = undefined;
                process();
            }, 20);
        });
        observe.observer.observe(document, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    };
    observe.stop = ( ) => {
        if ( observe.timer !== undefined ) {
            clearTimeout(observe.timer);
            observe.timer = undefined;
        }
        if ( observe.observer ) {
            observe.observer.disconnect();
            observe.observer = undefined;
        }
    };

    const process = ( ) => {
        next.stop();
        if ( Date.now() < tnext ) { return next(); }
        const selector = selectorList.shift();
        if ( selector === undefined ) { return terminate(); }
        const elem = querySelectorEx(selector);
        if ( elem === null ) {
            selectorList.unshift(selector);
            return next(true);
        }
        safe.uboLog(logPrefix, `Clicked ${selector}`);
        elem.click();
        tnext += clickDelay;
        next();
    };

    runAtHtmlElementFn(process);
}

function getAllCookiesFn() {
    const safe = safeSelf();
    return safe.String_split.call(document.cookie, /\s*;\s*/).map(s => {
        const pos = s.indexOf('=');
        if ( pos === 0 ) { return; }
        if ( pos === -1 ) { return `${s.trim()}=`; }
        const key = s.slice(0, pos).trim();
        const value = s.slice(pos+1).trim();
        return { key, value };
    }).filter(s => s !== undefined);
}

function getAllLocalStorageFn(which = 'localStorage') {
    const storage = self[which];
    const out = [];
    for ( let i = 0; i < storage.length; i++ ) {
        const key = storage.key(i);
        const value = storage.getItem(key);
        return { key, value };
    }
    return out;
}

function runAtHtmlElementFn(fn) {
    if ( document.documentElement ) {
        fn();
        return;
    }
    const observer = new MutationObserver(( ) => {
        observer.disconnect();
        fn();
    });
    observer.observe(document, { childList: true });
}

function safeSelf() {
    if ( scriptletGlobals.safeSelf ) {
        return scriptletGlobals.safeSelf;
    }
    const self = globalThis;
    const safe = {
        'Array_from': Array.from,
        'Error': self.Error,
        'Function_toStringFn': self.Function.prototype.toString,
        'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
        'Math_floor': Math.floor,
        'Math_max': Math.max,
        'Math_min': Math.min,
        'Math_random': Math.random,
        'Object': Object,
        'Object_defineProperty': Object.defineProperty.bind(Object),
        'Object_defineProperties': Object.defineProperties.bind(Object),
        'Object_fromEntries': Object.fromEntries.bind(Object),
        'Object_getOwnPropertyDescriptor': Object.getOwnPropertyDescriptor.bind(Object),
        'Object_hasOwn': Object.hasOwn.bind(Object),
        'RegExp': self.RegExp,
        'RegExp_test': self.RegExp.prototype.test,
        'RegExp_exec': self.RegExp.prototype.exec,
        'Request_clone': self.Request.prototype.clone,
        'String': self.String,
        'String_fromCharCode': String.fromCharCode,
        'String_split': String.prototype.split,
        'XMLHttpRequest': self.XMLHttpRequest,
        'addEventListener': self.EventTarget.prototype.addEventListener,
        'removeEventListener': self.EventTarget.prototype.removeEventListener,
        'fetch': self.fetch,
        'JSON': self.JSON,
        'JSON_parseFn': self.JSON.parse,
        'JSON_stringifyFn': self.JSON.stringify,
        'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
        'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
        'log': console.log.bind(console),
        // Properties
        logLevel: 0,
        // Methods
        makeLogPrefix(...args) {
            return this.sendToLogger && `[${args.join(' \u205D ')}]` || '';
        },
        uboLog(...args) {
            if ( this.sendToLogger === undefined ) { return; }
            if ( args === undefined || args[0] === '' ) { return; }
            return this.sendToLogger('info', ...args);
            
        },
        uboErr(...args) {
            if ( this.sendToLogger === undefined ) { return; }
            if ( args === undefined || args[0] === '' ) { return; }
            return this.sendToLogger('error', ...args);
        },
        escapeRegexChars(s) {
            return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },
        initPattern(pattern, options = {}) {
            if ( pattern === '' ) {
                return { matchAll: true, expect: true };
            }
            const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
            if ( expect === false ) {
                pattern = pattern.slice(1);
            }
            const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
            if ( match !== null ) {
                return {
                    re: new this.RegExp(
                        match[1],
                        match[2] || options.flags
                    ),
                    expect,
                };
            }
            if ( options.flags !== undefined ) {
                return {
                    re: new this.RegExp(this.escapeRegexChars(pattern),
                        options.flags
                    ),
                    expect,
                };
            }
            return { pattern, expect };
        },
        testPattern(details, haystack) {
            if ( details.matchAll ) { return true; }
            if ( details.re ) {
                return this.RegExp_test.call(details.re, haystack) === details.expect;
            }
            return haystack.includes(details.pattern) === details.expect;
        },
        patternToRegex(pattern, flags = undefined, verbatim = false) {
            if ( pattern === '' ) { return /^/; }
            const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
            if ( match === null ) {
                const reStr = this.escapeRegexChars(pattern);
                return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
            }
            try {
                return new RegExp(match[1], match[2] || undefined);
            }
            catch {
            }
            return /^/;
        },
        getExtraArgs(args, offset = 0) {
            const entries = args.slice(offset).reduce((out, v, i, a) => {
                if ( (i & 1) === 0 ) {
                    const rawValue = a[i+1];
                    const value = /^\d+$/.test(rawValue)
                        ? parseInt(rawValue, 10)
                        : rawValue;
                    out.push([ a[i], value ]);
                }
                return out;
            }, []);
            return this.Object_fromEntries(entries);
        },
        onIdle(fn, options) {
            if ( self.requestIdleCallback ) {
                return self.requestIdleCallback(fn, options);
            }
            return self.requestAnimationFrame(fn);
        },
        offIdle(id) {
            if ( self.requestIdleCallback ) {
                return self.cancelIdleCallback(id);
            }
            return self.cancelAnimationFrame(id);
        }
    };
    scriptletGlobals.safeSelf = safe;
    if ( scriptletGlobals.bcSecret === undefined ) { return safe; }
    // This is executed only when the logger is opened
    safe.logLevel = scriptletGlobals.logLevel || 1;
    let lastLogType = '';
    let lastLogText = '';
    let lastLogTime = 0;
    safe.toLogText = (type, ...args) => {
        if ( args.length === 0 ) { return; }
        const text = `[${document.location.hostname || document.location.href}]${args.join(' ')}`;
        if ( text === lastLogText && type === lastLogType ) {
            if ( (Date.now() - lastLogTime) < 5000 ) { return; }
        }
        lastLogType = type;
        lastLogText = text;
        lastLogTime = Date.now();
        return text;
    };
    try {
        const bc = new self.BroadcastChannel(scriptletGlobals.bcSecret);
        let bcBuffer = [];
        safe.sendToLogger = (type, ...args) => {
            const text = safe.toLogText(type, ...args);
            if ( text === undefined ) { return; }
            if ( bcBuffer === undefined ) {
                return bc.postMessage({ what: 'messageToLogger', type, text });
            }
            bcBuffer.push({ type, text });
        };
        bc.onmessage = ev => {
            const msg = ev.data;
            switch ( msg ) {
            case 'iamready!':
                if ( bcBuffer === undefined ) { break; }
                bcBuffer.forEach(({ type, text }) =>
                    bc.postMessage({ what: 'messageToLogger', type, text })
                );
                bcBuffer = undefined;
                break;
            case 'setScriptletLogLevelToOne':
                safe.logLevel = 1;
                break;
            case 'setScriptletLogLevelToTwo':
                safe.logLevel = 2;
                break;
            }
        };
        bc.postMessage('areyouready?');
    } catch {
        safe.sendToLogger = (type, ...args) => {
            const text = safe.toLogText(type, ...args);
            if ( text === undefined ) { return; }
            safe.log(`uBO ${text}`);
        };
    }
    return safe;
}

/******************************************************************************/

const scriptletGlobals = {}; // eslint-disable-line
const argsList = [["form[action] button[jsname=\"tWT92d\"]"],["[action=\"https://consent.youtube.com/save\"][style=\"display:inline;\"] [name=\"set_eom\"][value=\"true\"] ~ .basebuttonUIModernization[value][aria-label]"],["[aria-labelledby=\"manage_cookies_title\"] [aria-hidden=\"true\"]:has(> [aria-disabled=\"true\"][role=\"button\"]) + [aria-label][role=\"button\"][tabindex=\"0\"]","","1000"],["button._a9_1","","1000"],["[title=\"Manage Cookies\"]"],["[title=\"Reject All\"]","","1000"],["button.sp_choice_type_11"],["button[aria-label=\"Accept All\"]","","1000"],[".sp_choice_type_12[title=\"Options\"]"],["[title=\"REJECT ALL\"]","","500"],[".sp_choice_type_12[title=\"OPTIONS\"]"],["[title=\"Reject All\"]","","500"],["button[title=\"READ FOR FREE\"]","","1000"],[".terms-conditions button.transfer__button"],[".fides-consent-wall .fides-banner-button-group > button.fides-reject-all-button"],["button[title^=\"Consent\"]"],["button[title^=\"Einwilligen\"]"],["button.fides-reject-all-button","","500"],["button.reject-all"],[".cmp__dialog-footer-buttons > .is-secondary"],["button[onclick=\"IMOK()\"]","","500"],["a.btn--primary"],[".message-container.global-font button.message-button.no-children.focusable.button-font.sp_choice_type_12[title=\"MORE OPTIONS\""],["[data-choice=\"1683026410215\"]","","500"],["button[aria-label=\"close button\"]","","1000"],["button[class=\"w_eEg0 w_OoNT w_w8Y1\"]","","1000"],["#usercentrics-root >>> button[data-testid=\"uc-deny-all-button\"]"],["button.sp_choice_type_12[title$=\"Settings\"]","","500"],["button[title=\"REJECT ALL\"]","","1000"],["button.iubenda-cs-customize-btn, button.iub-cmp-reject-btn, button#iubFooterBtn","","1000"],[".accept[onclick=\"cmpConsentWall.acceptAllCookies()\"]","","1000"],[".sp_choice_type_12[title=\"Manage Cookies\"]"],[".sp_choice_type_REJECT_ALL","","500"],["button[title=\"Accept Cookies\"]","","1000"],["a.cc-dismiss","","1000"],["button[data-test=\"pwa-consent-layer-save-settings\"]","","1000"],["button.denyAll","","1000"],["button[data-tracking-name=\"cookie-preferences-mloi-initial-opt-out\"]"],["button[kind=\"secondary\"][data-test=\"cookie-necessary-button\"]","","1000"],["button[data-cookiebanner=\"accept_only_essential_button\"]","","1000"],["button.cassie-reject-all","","1000"],["#CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll"],["button.alma-cmp-button[title=\"Hyväksy\"]"],[".sanoma-logo-container ~ .message-component.sticky-buttons button.sp_choice_type_12[title=\"Asetukset\"]"],[".sanoma-logo-container ~ .message-component.privacy-manager-tcfv2 .tcfv2-stack[title=\"Sanoman sisällönjakelukumppanit\"] button.pm-switch[aria-checked=\"false\"]"],[".sanoma-logo-container ~ .message-component button.sp_choice_type_SAVE_AND_EXIT[title=\"Tallenna\"]","","1500"],["button[id=\"rejectAll\"]","","1000"],["#onetrust-accept-btn-handler","","1000"],["button[title=\"Accept and continue\"]"],["button[title=\"Accept All Cookies\"]"],[".accept-all"],["#CybotCookiebotDialogBodyButtonAccept"],["[data-paywall-notifier=\"consent-agreetoall\"]","","1000"],["ytd-button-renderer.ytd-consent-bump-v2-lightbox + ytd-button-renderer.ytd-consent-bump-v2-lightbox button[style][aria-label][title]","","1000"],["kpcf-cookie-toestemming >>> button[class=\"ohgs-button-primary-green\"]","","1000"],[".privacy-cp-wall #privacy-cp-wall-accept"],["button[aria-label=\"Continua senza accettare\"]"],["label[class=\"input-choice__label\"][for=\"CookiePurposes_1_\"], label[class=\"input-choice__label\"][for=\"CookiePurposes_2_\"], button.js-save[type=\"submit\"]"],["[aria-label=\"REJECT ALL\"]","","500"],["[href=\"/x-set-cookie/\"]"],["#dialogButton1"],["#overlay > div > #banner:has([href*=\"privacyprefs/\"]) music-button:last-of-type"],[".call"],["#cl-consent button[data-role=\"b_decline\"]"],["#privacy-cp-wall-accept"],["button.js-cookie-accept-all","","2000"],["button[data-label=\"accept-button\"]","","1000"],["#cmp-btn-accept","!cookie:/^gpt_ppid[^=]+=/","5000"],["button#pt-accept-all"],["[for=\"checkbox_niezbedne\"], [for=\"checkbox_spolecznosciowe\"], .btn-primary"],["[aria-labelledby=\"banner-title\"] > div[class^=\"buttons_\"] > button[class*=\"secondaryButton_\"] + button"],["#cmpwrapper >>> #cmpbntyestxt","","1000"],["#cmpwrapper >>> .cmptxt_btn_no","","1000"],["#cmpwrapper >>> .cmptxt_btn_save","","1000"],[".iubenda-cs-customize-btn, #iubFooterBtn"],[".privacy-popup > div > button","","2000"],["#pubtech-cmp #pt-close"],[".didomi-continue-without-agreeing","","1000"],["#ccAcceptOnlyFunctional","","4000"],["button.optoutmulti_button","","2000"],["button[title=\"Accepter\"]"],["button[title=\"Godta alle\"]","","1000"],[".btns-container > button[title=\"Tilpass cookies\"]"],[".message-row > button[title=\"Avvis alle\"]","","2000"],["button[data-gdpr-expression=\"acceptAll\"]"],["button[title=\"Accept all\"i]"],["span.as-oil__close-banner"],["button[data-cy=\"cookie-banner-necessary\"]"],["h2 ~ div[class^=\"_\"] > div[class^=\"_\"] > a[rel=\"noopener noreferrer\"][target=\"_self\"][class^=\"_\"]:only-child"],[".cky-btn-accept"],["button[aria-label=\"Agree\"]"],["button[onclick=\"Didomi.setUserAgreeToAll();\"]","","1800"],["button[title^=\"Alle akzeptieren\"]"],["button[aria-label=\"Alle akzeptieren\"]"],["button[data-label=\"Weigeren\"]","","500"],["button.decline-all","","1000"],["button[aria-label=\"I Accept\"]","","1000"],[".button--necessary-approve","","2000"],[".button--necessary-approve","","4000"],["button.agree-btn","","2000"],[".ReactModal__Overlay button[class*=\"terms-modal_done__\"]"],["button.cookie-consent__accept-button","","2000"],["button[id=\"ue-accept-notice-button\"]","","2000"],["#usercentrics-root >>> button[data-testid=\"uc-deny-all-button\"]","","1000"],["#usercentrics-root >>> button[data-testid=\"uc-accept-all-button\"]","","1000"],["[data-testid=\"cookie-policy-banner-accept\"]","","500"],["button.accept-all","1000"],[".szn-cmp-dialog-container >>> button[data-testid=\"cw-button-agree-with-ads\"]","","2000"],["button[id=\"ue-accept-notice-button\"]","","1000"],[".as-oil__close-banner","","1000"],["button[title=\"Einverstanden\"]","","1000"],["button.iubenda-cs-accept-btn","","1000"],["button.iubenda-cs-close-btn"],["button[title=\"Akzeptieren und weiter\"]","","1000"],[".qc-cmp2-summary-buttons > button[mode=\"secondary\"]"],["[class^=\"qc-cmp2-buttons\"] > [data-tmdatatrack=\"privacy-other-save\"]","","1000"],["button[mode=\"primary\"][data-tmdatatrack=\"privacy-cookie\"]","","1000"],["button[class*=\"cipa-accept-btn\"]","","1000"],["a[href=\"javascript:Didomi.setUserAgreeToAll();\"]","","1000"],["#didomi-notice-agree-button","","1000"],["#onetrust-pc-btn-handler"],[".save-preference-btn-handler","","1000"],["button[data-testid=\"granular-banner-button-decline-all\"]","","1000"],["button[aria-label*=\"Aceptar\"]","","1000"],["button[title*=\"Accept\"]","","1000"],["button[title*=\"AGREE\"]","","1000"],["button[title=\"Alles akzeptieren\"]","","1000"],["button[title=\"Godkänn alla cookies\"]","","1000"],["button[title=\"ALLE AKZEPTIEREN\"]","","1000"],["button[title=\"Reject all\"]","","1000"],["button[title=\"I Agree\"]","","1000"],["button[title=\"AKZEPTIEREN UND WEITER\"]","","1000"],["button[title=\"Hyväksy kaikki\"]","","1000"],["button[title=\"TILLAD NØDVENDIGE\"]","","1000"],["button[title=\"Accept All & Close\"]","","1000"],["#CybotCookiebotDialogBodyButtonDecline","","1000"],["button#consent_wall_optin"],["span#cmpbntyestxt","","1000"],["button[title=\"Akzeptieren\"]","","1000"],["button#btn-gdpr-accept"],["a[href][onclick=\"ov.cmp.acceptAllConsents()\"]","","1000"],["button.fc-primary-button","","1000"],["button[data-id=\"save-all-pur\"]","","1000"],["button.button__acceptAll","","1000"],["button.button__skip"],["button.accept-button"],["custom-button[id=\"consentAccept\"]","","1000"],["button[mode=\"primary\"]"],["a.cmptxt_btn_no","","1000"],["button[data-test=\"pwa-consent-layer-save-settings\"]","","1000]"],["[target=\"_self\"][type=\"button\"][class=\"_3kalix4\"]","","1000"],["button[type=\"button\"][class=\"_button_15feu_3\"]","","1000"],["[target=\"_self\"][type=\"button\"][class=\"_10qqh8uq\"]","","1000"],["button[data-reject-all]","","1000"],["button[title=\"Einwilligen und weiter\"]","","1000"],["button[title=\"Dismiss\"]"],["button.refuseAll","","1000"],["button[data-cc-action=\"accept\"]","","1000"],["button[id=\"teal-consent-prompt-submit\"]","","1000"],["button[id=\"consent_prompt_submit\"]","","1000"],["button[name=\"accept\"]","","1000"],["button[id=\"consent_prompt_decline\"]","","1000"],["button[data-tpl-type=\"Button\"]","","1000"],["button[data-tracking-name=\"cookie-preferences-sloo-opt-out\"]","","1000"],["button[title=\"ACCEPT\"]"],["button[title=\"SAVE AND EXIT\"]"],["button[aria-label=\"Reject All\"]","","1000"],["button[id=\"explicit-consent-prompt-reject\"]","","1000"],["button[data-purpose=\"cookieBar.button.accept\"]","","1000"],["button[data-testid=\"uc-button-accept-and-close\"]","","1000"],["[data-testid=\"submit-login-button\"].decline-consent","","1000"],["button[type=\"submit\"].btn-deny","","1000"],["a.cmptxt_btn_yes"],["button[data-action=\"adverts#accept\"]","","1000"],[".cmp-accept","","2500"],["[data-testid=\"consent-necessary\"]"],["button[id=\"onetrust-reject-all-handler\"]","","1000"],["button.onetrust-close-btn-handler","","1000"],["div[class=\"t_cm_ec_reject_button\"]","","1000"],["button[aria-label=\"نعم انا موافق\"]"],["button[title=\"Agree\"]","","1000"],["button[aria-label=\"Close\"]","","1000"],["button.sc-9a9fe76b-0.jgpQHZ","","1000"],["button[data-auto-id=\"glass-gdpr-default-consent-reject-button\"]","","1000"],["button[aria-label=\"Prijať všetko\"]"],["a.cc-btn.cc-allow","","1000"],[".qc-cmp2-summary-buttons > button[mode=\"primary\"]","","2000"],["button[class*=\"cipa-accept-btn\"]","","2000"],["button[data-js=\"cookieConsentReject\"]","","1000"],["button[title*=\"Jetzt zustimmen\"]","","1600"],["a[id=\"consent_prompt_decline\"]","","1000"],["button[id=\"cm-acceptNone\"]","","1000"],["button.brlbs-btn-accept-only-essential","","1000"],["button[id=\"didomi-notice-disagree-button\"]","","1000"],["a[href=\"javascript:Didomi.setUserDisagreeToAll()\"]","","1000"],["button[onclick=\"Didomi.setUserDisagreeToAll();\"]","","1000"],["a#cookie-accept","","1000"],["button.decline-button","","1000"],["button.inv-cmp-button.inv-font-btn","","1800"],["button.cookie-notice__button--dismiss","","1000"],["button[data-testid=\"cookies-politics-reject-button--button\"]","","1000"],["cds-button[id=\"cookie-allow-necessary-et\"]","","1000"],["button[title*=\"Zustimmen\" i]","","1000"],["button[title=\"Ich bin einverstanden\"]","","","1000"],["button[id=\"userSelectAll\"]","","1000"],["button[title=\"Consent and continue\"]","","1000"],["button[title=\"Accept all\"]","","1000"],["button[title=\"Save & Exit\"]","","1000"],["button[title=\"Akzeptieren & Schließen\"]","","1000"],["button.button-reject","","1000"],["button[data-cookiefirst-action=\"accept\"]","","1000"],["button[data-cookiefirst-action=\"reject\"]","","1000"],["button.mde-consent-accept-btn","","2600"],[".gdpr-modal .gdpr-btn--secondary, .gdpr-modal .gdpr-modal__box-bottom-dx > button.gdpr-btn--br:first-child"],["button#consent_prompt_decline","","1000"],["button[id=\"save-all-pur\"]","","1000"],["button[id=\"save-all-conditionally\"]","","1000"],["a[onclick=\"AcceptAllCookies(true); \"]","","1000"],["button[title=\"Akzeptieren & Weiter\"]","","1000"],["button#ensRejectAll","","1500"],["a.js-cookie-popup","","650"],["button.button_default","","800"],["button.CybotCookiebotDialogBodyButton","","1000"],["a#CybotCookiebotDialogBodyButtonAcceptAll","","1000"],["button[title=\"Kun nødvendige\"]","","2500"],["button[title=\"Accept\"]","","1000"],["button.js-decline-all-cookies","","1000"],["button.cookieselection-confirm-selection","","1000"],["button#btn-reject-all","","1000"],["button[data-consent-trigger=\"1\"]","","1000"],["button#cookiebotDialogOkButton","","1000"],["button.reject-btn","","1000"],["button.accept-btn","","1000"],["button.js-deny","","1500"],["a.jliqhtlu__close","","1000"],["a.cookie-consent--reject-button","","1000"],["button[title=\"Alle Cookies akzeptieren\"]","","1000"],["button[data-test-id=\"customer-necessary-consents-button\"]","","1000"],["button.ui-cookie-consent__decline-button","","1000"],["button.cookies-modal-warning-reject-button","","1000"],["button[data-type=\"nothing\"]","","1000"],["button.cm-btn-accept","","1000"],["button[data-dismiss=\"modal\"]","","1000"],["button#js-agree-cookies-button","","1000"],["button[data-testid=\"cookie-popup-reject\"]","","1000"],["button#truste-consent-required","","1000"],["button[data-testid=\"button-core-component-Avslå\"]","","1000"],["epaas-consent-drawer-shell >>> button.reject-button","","1000"],["button.ot-bnr-save-handler","","1000"],["button#button-accept-necessary","","1500"],["button[data-cookie-layer-accept=\"selected\"]","","1000"],[".open > ng-transclude > footer > button.accept-selected-btn","","1000"],[".open_modal .modal-dialog .modal-content form .modal-header button[name=\"refuse_all\"]","","1000"],["div.button_cookies[onclick=\"RefuseCookie()\"]"],["button[onclick=\"SelectNone()\"]","","1000"],["button[data-tracking-element-id=\"cookie_banner_essential_only\"]","","1600"],["button[name=\"decline_cookie\"]","","1000"],["button.cmpt_customer--cookie--banner--continue","","1000"],["button.cookiesgdpr__rejectbtn","","1000"],["button[onclick=\"confirmAll('theme-showcase')\"]","","1000"],["button.oax-cookie-consent-select-necessary","","1000"],["button#cookieModuleRejectAll","","1000"],["button.js-cookie-accept-all","","1000"],["label[for=\"ok\"]","","500"],["button.payok__submit","","750"],["button.btn-outline-secondary","","1000"],["button#footer_tc_privacy_button_2","","1000"],["input[name=\"pill-toggle-external-media\"]","","500"],["button.p-layer__button--selection","","750"],["button[data-analytics-cms-event-name=\"cookies.button.alleen-noodzakelijk\"]","","2600"],["button[aria-label=\"Vypnúť personalizáciu\"]","","1000"],[".cookie-text > .large-btn","","1000"],["button#zenEPrivacy_acceptAllBtn","","1000"],["button[title=\"OK\"]","","1000"],[".l-cookies-notice .btn-wrapper button[data-name=\"accept-all-cookies\"]","","1000"],["button.btn-accept-necessary","","1000"],["button#popin_tc_privacy_button","","1000"],["button#cb-RejectAll","","1000"],["button#DenyAll","","1000"],["button[name=\"decline-all\"]","","1000"],["button#saveCookieSelection","","1000"],["input.cookieacceptall","","1000"],["button[data-role=\"necessary\"]","","1000"],["input[value=\"Acceptér valgte\"]","","1000"],["button[aria-label=\"Accepter kun de nødvendige cookies\"]","","1000"],["cookie-consent-element >>> button[aria-label=\"Accepter kun de nødvendige cookies\"]","","1000"],[".dmc-accept-all","","1000"],["button#hs-eu-decline-button","","1000"],["button[onclick=\"wsSetAcceptedCookies(this);\"]","","1000"],["button[data-tid=\"banner-accept\"]","","1000"],["div#cookiescript_accept","","1000"],["button#popin-cookies-btn-refuse","","1000"],["button.AP_mdf-accept","","1500"],["button#cm-btnRejectAll","","1000"],["button[data-cy=\"iUnderstand\"]","","1000"],["button[data-cookiebanner=\"accept_button\"]","","1000"],["button.cky-btn-reject","","1000"],["button#consentDisagreeButton","","1000"],[".logoContainer > .modalBtnAccept","","1000"],["button.js-cookie-banner-decline-all","","1000"],["div#consent_prompt_decline_submit","","1000"],["button.js-acceptNecessaryCookies","","1000"],[".show.modal .modal-dialog .modal-content .modal-footer a.s-cookie-transparency__link-reject-all","","1000"],["button#UCButtonSettings","500"],["button#CybotCookiebotDialogBodyLevelButtonAccept","750"],["button[name=\"rejectAll\"]","","1000"],["button.env-button--primary","","1000"],["div#consent_prompt_reject","","1000"],["button#js-ssmp-clrButtonLabel","","1000"],[".modal.in .modal-dialog .modal-content .modal-footer button#saveGDPR","","2000"],["button#btnAcceptAllCookies","","1000"],["button[class=\"amgdprcookie-button -decline\"]","","3000"],["button[data-t=\"continueWithoutAccepting\"]","","1000"],["button.si-cookie-notice__button--reject","","1000"],["button.btn--white.l-border.cookie-notice__btn","","1000"],["a#bstCookieAlertBtnNecessary","","1000"],["button.save.btn-form.btn-inverted","","1000"],["button.manage-cookies","","500"],["button.save.primary-button","","750"],["button.ch2-deny-all-btn","","1500"],["button[data-testid=\"cookie-modal-actions-decline\"]","","1000"],["span.cookies_rechazo","","1000"],["button.ui-button-secondary.ui-button-secondary-wide","","500"],["button.ui-button-primary-wide.ui-button-text-only","","750"],["button#shopify-pc__banner__btn-decline","","1000"],["button.consent-info-cta.more","","500"],["button.consent-console-save.ko","","750"],["button[data-testid=\"reject-all-cookies-button\"]","","1000"],["button#show-settings-button","","500"],["button#save-settings-button","","750"],["button[title=\"Jag godkänner\"]","","1000"],["label[title=\"Externe Medien\"]","","1000"],["button.save-cookie-settings","","1200"],["button#gdpr-btn-refuse-all","","1000"],["a[aria-label=\"Continue without accepting\"]","","1000"],["button#tarteaucitronAllDenied2","","1000"],["button.ccm--decline-cookies","","1000"],["button#c-s-bn","","1000"],["button.cm-btn-success","","1000"],["a.p-cookie-layer__accept-selected-cookies-button[nb-cmp=\"button\"]","","1500"],["a.cc-btn-decline","","1000"],["button.cc-btn.save","","1000"],["button.btn-reject-additional-cookies","","1000"],["button#c-s-bn","","700"],["button#s-sv-bn","","850"],["button#btn-accept-banner","","1000"],["a.disable-cookies","","1000"],["button[aria-label=\"Accept all\"]","","1000"],["button#ManageCookiesButton","","500"],["button#SaveCookiePreferencesButton","","750"],["button[type=\"submit\"].btn--cookie-consent","","1000"],["button.btn_cookie_savesettings","","500"],["button.btn_cookie_savesettings","","750"],["a[data-cookies-action=\"accept\"]","","1000"],["button.xlt-modalCookiesBtnAllowNecessary","","1000"],["button[data-closecause=\"close-by-submit\"]","","1000"],["span[data-qa-selector=\"gdpr-banner-configuration-button\"]","","300"],["span[data-qa-selector=\"gdpr-banner-accept-selected-button\"]","","500"],["button[data-cookies=\"disallow_all_cookies\"]","","1000"],["button#CookieBoxSaveButton","","1000"],["button#acceptNecessaryCookiesBtn","","1000"],["a.cc-deny","","1000"],["button[aria-label=\"Accept selected cookies\"]","","1000"],["button.orejime-Modal-saveButton","","1000"],["a[data-tst=\"reject-additional\"]","","1000"],["button.cookie-select-mandatory","","1000"],["a#obcookies_box_close","","1000"],["a[data-button-action=\"essential\"]","","1000"],["button[data-test=\"cookiesAcceptMandatoryButton\"]","","1000"],["button[data-test=\"button-customize\"]","","500"],["button[data-test=\"button-save\"]","","750"],["button.cc-decline","","1000"],["div.approve.button","","1000"],["button[onclick=\"CookieConsent.apply(['ESSENTIAL'])\"]","","1000"],["label[for=\"privacy_pref_optout\"]","","800"],["div#consent_prompt_submit","","1000"],["button.dp_accept","","1000"],["button.cookiebanner__buttons__deny","","1000"],["button.button-refuse","","1000"],["a[onclick=\"cmp_pv.cookie.saveConsent('onlyLI');\"]","","1000"],["button[title=\"Hyväksy\"]","","1000"],["button[title=\"Pokračovať s nevyhnutnými cookies →\"]","","1000"],["button[name=\"saveCookiesPlusPreferences\"]","","1000"],["div[onclick=\"javascript:ns_gdpr();\"]","","1000"],["button.cookies-banner__button","","1000"],["div#close_button.btn","","1000"],["pie-cookie-banner >>> pie-button[data-test-id=\"actions-necessary-only\"]","","1000"],["button#cmCloseBanner","","1000"],["button#popin_tc_privacy_button_2","","1000"],["button#popin_tc_privacy_button_3","","1000"],["span[aria-label=\"dismiss cookie message\"]","","1000"],["button[aria-label=\"Rechazar todas las cookies\"]","","1000"],["button.CookieBar__Button-decline","","600"],["button.btn.btn-success","","750"],["a[aria-label=\"settings cookies\"]","","600"],["a[onclick=\"Pandectes.fn.savePreferences()\"]","","750"],["a[aria-label=\"allow cookies\"]","","1000"],["div.privacy-more-information","","600"],["div#preferences_prompt_submit","","750"],["a#CookieBoxSaveButton","","1000"],["span[data-content=\"WEIGEREN\"]","","1000"],[".is-open .o-cookie__overlay .o-cookie__container .o-cookie__actions .is-space-between button[data-action=\"save\"]","","1000"],["a[onclick=\"consentLayer.buttonAcceptMandatory();\"]","","1000"],["button[id=\"confirmSelection\"]","","2000"],["button[data-action=\"disallow-all\"]","","1000"],["div#cookiescript_reject","","1000"],["button#acceptPrivacyPolicy","","1000"],["button#consent_prompt_reject","","1000"],["dock-privacy-settings >>> bbg-button#decline-all-modal-dialog","","1000"],["button.js-deny","","1000"],["a[role=\"button\"][data-cookie-individual]","","3200"],["a[role=\"button\"][data-cookie-accept]","","3500"],["button[title=\"Deny all cookies\"]","","1000"],["button#cookieconsent-banner-accept-necessary-button","","1000"],["div[data-vtest=\"reject-all\"]","","1000"],["button#consentRefuseAllCookies","","1000"],["button.cookie-consent__button--decline","","1000"],["button#saveChoice","","1000"],["button#refuseCookiesBtn","","1000"],["button.p-button.p-privacy-settings__accept-selected-button","","2500"],["button.cookies-ko","","1000"],["button.reject","","1000"],["button.ot-btn-deny","","1000"],["button.js-ot-deny","","1000"],["button.cn-decline","","1000"],["button#js-gateaux-secs-deny","","1500"],["button[data-cookie-consent-accept-necessary-btn]","","1000"],["button.qa-cookie-consent-accept-required","","1500"],[".cvcm-cookie-consent-settings-basic__learn-more-button","","600"],[".cvcm-cookie-consent-settings-detail__footer-button","","750"],["button.accept-all"],[".btn-primary"],["div.tvp-covl__ab","","1000"],["span.decline","","1500"],["a.-confirm-selection","","1000"],["button[data-role=\"reject-rodo\"]","","2500"],["button#moreSettings","","600"],["button#saveSettings","","750"],["button#modalSettingBtn","","1500"],["button#allRejectBtn","","1750"],["button[data-stellar=\"Secondary-button\"]","","1500"],["span.ucm-popin-close-text","","1000"],["a.cookie-essentials","","1800"],["button.Avada-CookiesBar_BtnDeny","","1000"],["button#ez-accept-all","","1000"],["a.cookie__close_text","","1000"],["button[class=\"consent-button agree-necessary-cookie\"]","","1000"],["button#accept-all-gdpr","","1000"],["a#eu-cookie-details-anzeigen-b","","600"],["button.consentManagerButton__NQM","","750"],["span.gtm-cookies-close","","1000"],["button[data-accept-cookie=\"true\"]","","2000"],["button#consent_config","","600"],["button#consent_saveConfig","","750"],["button#declineButton","","1000"],["button#wp-declineButton","","1000"],["button.cookies-overlay-dialog__save-btn","","1000"],["button.iubenda-cs-reject-btn","1000"],["span.macaronbtn.refuse","","1000"],["a.fs-cc-banner_button-2","","1000"],["a.reject--cookies","","1000"],["button[aria-label=\"LET ME CHOOSE\"]","","2000"],["button[aria-label=\"Save My Preferences\"]","","2300"],[".dsgvo-cookie-modal .content .dsgvo-cookie .cookie-permission--content .dsgvo-cookie--consent-manager .cookie-removal--inline-manager .cookie-consent--save .cookie-consent--save-button","","1000"],["div[data-test-id=\"CookieConsentsBanner.Root\"] button[data-test-id=\"decline-button\"]","","1000"],["#pg-host-shadow-root >>> button#pg-configure-btn, #pg-host-shadow-root >>> #purpose-row-SOCIAL_MEDIA input[type=\"checkbox\"], #pg-host-shadow-root >>> button#pg-save-preferences-btn"],["button.cc-button--rejectAll","","","1000"],["a.eu-cookie-compliance-rocketship--accept-minimal.button","","1000"],["button[class=\"cookie-disclaimer__button-save | button\"]","","1000"],["button[class=\"cookie-disclaimer__button | button button--secondary\"]","","1000"],["button#tarteaucitronDenyAll","","1000"],["button#footer_tc_privacy_button_3","","1000"],["button#saveCookies","","1800"],["button[aria-label=\"dismiss cookie message\"]","","1000"],["div#cookiescript_button_continue_text","","1000"],["div.modal-close","","1000"],["button#wi-CookieConsent_Selection","","1000"],["button#c-t-bn","","1000"],["button#CookieInfoDialogDecline","","1000"],["button[aria-label=\"vypnout personalizaci\"]","","1800"],["button#cookie-donottrack","","1000"],["div.agree-mandatory","","1000"],["button[data-cookiefirst-action=\"adjust\"]","","600"],["button[data-cookiefirst-action=\"save\"]","","750"],["a[data-ga-action=\"disallow_all_cookies\"]","","1000"],["span.sd-cmp-2jmDj","","1000"],["div.rgpdRefuse","","1000"],["button.modal-cookie-consent-btn-reject","","1000"],["button#myModalCookieConsentBtnContinueWithoutAccepting","","1000"],["button.cookiesBtn__link","","1000"],["button[data-action=\"basic-cookie\"]","","1000"],["button.CookieModal--reject-all","","1000"],["button.consent_agree_essential","","1000"],["span[data-cookieaccept=\"current\"]","","1000"],["button.tarteaucitronDeny","","1000"],["button[data-cookie_version=\"true3\"]","","1000"],["a#DeclineAll","","1000"],["div.new-cookies__btn","","1000"],["button.button-tertiary","","600"],["button[class=\"focus:text-gray-500\"]","","1000"],[".cookie-overlay[style] .cookie-consent .cookie-button-group .cookie-buttons #cookie-deny","","1000"],["button#show-settings-button","","650"],["button#save-settings-button","","800"],["div.cookie-reject","","1000"],["li#sdgdpr_modal_buttons-decline","","1000"],["div#cookieCloseIcon","","1000"],["button#cookieAccepted","","1000"],["button#cookieAccept","","1000"],["div.show-more-options","","500"],["div.save-options","","650"],["button#btn-accept-required-banner","","1000"],["button#elc-decline-all-link","","1000"],["button[title=\"القبول والمتابعة\"]","","1800"],["button#consent-reject-all","","1000"],["a[role=\"button\"].button--secondary","","1000"],["button#denyBtn","","1000"],["button#accept-all-cookies","","1000"],["button[data-testid=\"zweiwegen-accept-button\"]","","1000"],["button[data-selector-cookie-button=\"reject-all\"]","","500"],["button[aria-label=\"Reject\"]","","1000"],["button.ens-reject","","1000"],["a#reject-button","","700"],["a#reject-button","","900"],["mon-cb-main >>> mon-cb-home >>> mon-cb-button[e2e-tag=\"acceptAllCookiesButton\"]","","1000"],["button#gdpr_consent_accept_essential_btn","","1000"],["button.essentialCat-button","","3600"],["button#denyallcookie-btn","","1000"],["button#cookie-accept","","1800"],["button[title=\"Close cookie notice without specifying preferences\"]","","1000"],["button[title=\"Adjust cookie preferences\"]","","500"],["button[title=\"Deny all cookies\"]","","650"],["button[data-role=\"reject-rodo\"]","","1500"],["button#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll","","1000"],["button[aria-label=\"Rechazar\"]","","1000"],["a[data-vtest=\"reject-all\"]","","1600"],["a.js-cookies-info-reject","","1000"],["button[title=\"Got it\"]","","1000"],["button#gr-btn-agree","","1000"],["button#_tealiumModalClose","","1000"],["button.Cmp__action--yes","","1000"],["button.fig-consent-banner__accept","","1000"],["button[onclick*=\"setTimeout(Didomi.setUserAgreeToAll","0);\"]","","1800"],["button#zdf-cmp-deny-btn","","1000"],["button#axeptio_btn_dismiss","","1000"],["a#setCookieLinkIn","","400"],["span.as-js-close-banner","","1000"],["button[value=\"popup_decline\"]","","1000"],["button.cc-nb-reject","","1000"],["a.weigeren.active","","1000"],["a.aanvaarden.green.active","","1000"],["button.button--preferences","","900"],["button.button--confirm","","1100"],["button.js-btn-reject-all","","1300"],["button[aria-label=\"Nur notwendige\"]","","1000"],["button[aria-label=\"Only necessary\"]","","1000"],["button[aria-label=\"Seulement nécessaire\"]","","1000"],["button[aria-label=\"Alleen noodzakelijk\"]","","1000"],["button[aria-label=\"Solo necessario\"]","","1000"],["a#optout_link","","1000"],["button[kind=\"purple\"]","","1000"],["button#cookie-consent-decline","","1000"],["button.tiko-btn-primary.tiko-btn-is-small","","1000"],["span.cookie-overlay__modal__footer__decline","","1000"],["button[title=\"Continue without accepting\"]","","1000"],["button[onclick=\"setCOOKIENOTIFYOK()\"]","","1000"],["button#s-rall-bn","","1000"],["button#privacy_pref_optout","","1000"],["button[data-action=\"reject\"]","","1000"],["button.osano-cm-denyAll","","1000"],["button.bh-cookies-popup-save-selection","","1000"],["a.avg-btn-allow","","1000"],["button[title=\"ACEPTAR Y GUARDAR\"]","","1000"],["#cookiescript_reject","","500"],["button[title=\"Essential cookies only\"]","","1000"],["#redesignCmpWrapper > div > div > a[href^=\"https://cadenaser.com/\"]"],["#cookietoggle, input[id=\"CookieFunctional\"], [value=\"Hyväksy vain valitut\"]"],["button.tm-button.secondary-invert","","1000"],["div[aria-labelledby=\"dialog-heading\"] div[class^=\"StyledButtonsWrapper\"] > button + button, #dialog-dynamic-section div[class^=\"StyledButtonsWrapper\"] > button + button","","500"],["#onetrust-consent-sdk button.ot-pc-refuse-all-handler"],["body > div[class=\"x1n2onr6 x1vjfegm\"] div[aria-hidden=\"false\"] > .x1o1ewxj div[class]:last-child > div[aria-hidden=\"true\"] + div div[role=\"button\"] > div[role=\"none\"][class^=\"x1ja2u2z\"][class*=\"x1oktzhs\"]"],["button.Distribution-Close"],["div[class]:has(a[href*=\"holding.wp.pl\"]) div[class]:only-child > button[class*=\" \"] + button:not([class*=\" \"])","","2300"]];
const hostnamesMap = new Map([["consent.google.*",0],["consent.youtube.com",[0,1]],["facebook.com",2],["instagram.com",3],["sourcepointcmp.bloomberg.com",[4,5,6]],["sourcepointcmp.bloomberg.co.jp",[4,5,6]],["giga.de",6],["theguardian.com",6],["bloomberg.com",7],["forbes.com",[7,70]],["nike.com",7],["consent.fastcar.co.uk",7],["cmpv2.standard.co.uk",[8,9]],["cmpv2.independent.co.uk",[10,11,12,166]],["wetransfer.com",[13,14]],["spiegel.de",[15,16]],["nytimes.com",[17,162]],["consent.yahoo.com",18],["tumblr.com",19],["fplstatistics.co.uk",20],["e-shop.leonidas.com",21],["cdn.privacy-mgmt.com",[22,23,42,43,44,45,85,90,92,99,106,113,123,124,125,128,130,131,138,155,179,189,202,203,206,207,208,273,380,512,536,571]],["walmart.ca",24],["sams.com.mx",25],["cambio-carsharing.de",26],["festool.*",26],["festoolcanada.com",26],["fuso-trucks.*",26],["tracker.fressnapf.de",26],["consent.ladbible.com",[27,28]],["consent.unilad.com",[27,28]],["consent.uniladtech.com",[27,28]],["consent.gamingbible.com",[27,28]],["consent.sportbible.com",[27,28]],["consent.tyla.com",[27,28]],["consent.ladbiblegroup.com",[27,28]],["m2o.it",29],["deejay.it",29],["capital.it",29],["ilmattino.it",[29,30]],["leggo.it",[29,30]],["libero.it",29],["tiscali.it",29],["consent-manager.ft.com",[31,32,33]],["hertz.*",34],["mediaworld.it",35],["mediamarkt.*",35],["mediamarktsaturn.com",36],["uber.com",[37,163]],["ubereats.com",[37,163]],["lego.com",38],["ai.meta.com",39],["lilly.com",40],["cosmo-hairshop.de",41],["storyhouseegmont.no",41],["telekom.com",46],["telekom.net",46],["telekom.de",46],["abola.pt",47],["flytap.com",47],["ansons.de",47],["blick.ch",47],["buienradar.be",47],["crunchyroll.com",47],["digi24.ro",47],["digisport.ro",47],["digitalfoundry.net",47],["egx.net",47],["emirates.com",47],["eurogamer.it",47],["gmx.*",47],["mail.com",47],["mcmcomiccon.com",47],["nachrichten.at",47],["nintendolife.com",47],["oe24.at",47],["paxsite.com",47],["peacocktv.com",47],["player.pl",47],["plus500.*",47],["pricerunner.com",47],["pricerunner.se",47],["pricerunner.dk",47],["proximus.be",[47,567]],["proximus.com",47],["purexbox.com",47],["pushsquare.com",47],["rugbypass.com",47],["southparkstudios.com",47],["southwest.com",47],["starwarscelebration.com",47],["sweatybetty.com",47],["thehaul.com",47],["timeextension.com",47],["travelandleisure.com",47],["tunein.com",47],["videoland.com",47],["wizzair.com",47],["wetter.at",47],["dicebreaker.com",[48,49]],["eurogamer.cz",[48,49]],["eurogamer.es",[48,49]],["eurogamer.net",[48,49]],["eurogamer.nl",[48,49]],["eurogamer.pl",[48,49]],["eurogamer.pt",[48,49]],["gamesindustry.biz",[48,49]],["jelly.deals",[48,49]],["reedpop.com",[48,49]],["rockpapershotgun.com",[48,49]],["thepopverse.com",[48,49]],["vg247.com",[48,49]],["videogameschronicle.com",[48,49]],["eurogamer.de",50],["roadtovr.com",51],["jotex.*",51],["mundodeportivo.com",[52,119]],["m.youtube.com",53],["www.youtube.com",53],["ohra.nl",54],["corriere.it",55],["gazzetta.it",55],["oggi.it",55],["cmp.sky.it",56],["tennisassa.fi",57],["formula1.com",58],["f1racing.pl",59],["music.amazon.*",[60,61]],["consent-pref.trustarc.com",62],["highlights.legaseriea.it",63],["calciomercato.com",63],["sosfanta.com",64],["chrono24.*",[65,66]],["wetter.com",67],["youmath.it",68],["pip.gov.pl",69],["dailybuzz.nl",71],["bnn.de",71],["dosenbach.ch",71],["dw.com",71],["kinepolis.*",71],["mediaite.com",71],["winfuture.de",71],["lippu.fi",71],["racingnews365.com",71],["reifendirekt.ch",71],["vaillant.*",71],["bauhaus.no",72],["bauhaus.se",72],["beko-group.de",72],["billiger.de",72],["burda.com",72],["vanharen.nl",72],["deichmann.com",[72,95,402]],["meraluna.de",72],["slashdot.org",72],["hermann-saunierduval.it",72],["protherm.cz",72],["saunierduval.es",72],["protherm.sk",72],["protherm.ua",72],["saunierduval.hu",72],["saunierduval.ro",72],["saunierduval.at",72],["awb.nl",72],["spar.hu",73],["group.vattenfall.com",73],["mediaset.it",74],["fortune.com",75],["ilrestodelcarlino.it",76],["quotidiano.net",76],["lanazione.it",76],["ilgiorno.it",76],["iltelegrafolivorno.it",76],["auto.it",77],["beauxarts.com",77],["beinsports.com",77],["bfmtv.com",77],["boursobank.com",77],["boursorama.com",77],["boursier.com",[77,196]],["brut.media",77],["canalplus.com",77],["diverto.tv",77],["eden-park.com",77],["frandroid.com",77],["jobijoba.*",77],["hotelsbarriere.com",77],["intersport.*",[77,176]],["idealista.it",77],["o2.fr",77],["lejdd.fr",[77,119]],["lechorepublicain.fr",77],["la-croix.com",77],["linfo.re",77],["lamontagne.fr",77],["lesnumeriques.com",77],["lopinion.fr",77],["marieclaire.fr",77],["maville.com",77],["midilibre.fr",77],["meteofrance.com",77],["mondialtissus.fr",77],["orange.fr",77],["oscaro.com",77],["ouest-france.fr",[77,91]],["parismatch.com",77],["programme-television.org",77],["publicsenat.fr",77],["rmcbfmplay.com",77],["science-et-vie.com",[77,119]],["seloger.com",77],["suzuki.fr",77],["sudouest.fr",77],["web-agri.fr",77],["nutri-plus.de",78],["aa.com",79],["americanairlines.*",79],["consent.capital.fr",80],["consent.voici.fr",80],["programme-tv.net",80],["cmpv2.finn.no",81],["cmp.e24.no",[82,83]],["cmp.vg.no",[82,83]],["huffingtonpost.fr",84],["rainews.it",86],["remarkable.com",87],["netzwelt.de",88],["money.it",89],["allocine.fr",91],["jeuxvideo.com",91],["ozap.com",91],["le10sport.com",91],["xataka.com",91],["cmp-sp.tagesspiegel.de",92],["cmp.bz-berlin.de",92],["cmp.cicero.de",92],["cmp.techbook.de",92],["cmp.stylebook.de",92],["cmp2.bild.de",92],["sourcepoint.wetter.de",92],["consent.finanzen.at",92],["consent.up.welt.de",92],["sourcepoint.n-tv.de",92],["sourcepoint.kochbar.de",92],["sourcepoint.rtl.de",92],["cmp.computerbild.de",92],["cmp.petbook.de",92],["cmp-sp.siegener-zeitung.de",92],["cmp-sp.sportbuzzer.de",92],["klarmobil.de",92],["technikum-wien.at",93],["eneco.nl",94],["blackpoolgazette.co.uk",96],["lep.co.uk",96],["northamptonchron.co.uk",96],["scotsman.com",96],["shieldsgazette.com",96],["thestar.co.uk",96],["portsmouth.co.uk",96],["sunderlandecho.com",96],["northernirelandworld.com",96],["3addedminutes.com",96],["anguscountyworld.co.uk",96],["banburyguardian.co.uk",96],["bedfordtoday.co.uk",96],["biggleswadetoday.co.uk",96],["bucksherald.co.uk",96],["burnleyexpress.net",96],["buxtonadvertiser.co.uk",96],["chad.co.uk",96],["daventryexpress.co.uk",96],["derbyshiretimes.co.uk",96],["derbyworld.co.uk",96],["derryjournal.com",96],["dewsburyreporter.co.uk",96],["doncasterfreepress.co.uk",96],["falkirkherald.co.uk",96],["fifetoday.co.uk",96],["glasgowworld.com",96],["halifaxcourier.co.uk",96],["harboroughmail.co.uk",96],["harrogateadvertiser.co.uk",96],["hartlepoolmail.co.uk",96],["hemeltoday.co.uk",96],["hucknalldispatch.co.uk",96],["lancasterguardian.co.uk",96],["leightonbuzzardonline.co.uk",96],["lincolnshireworld.com",96],["liverpoolworld.uk",96],["londonworld.com",96],["lutontoday.co.uk",96],["manchesterworld.uk",96],["meltontimes.co.uk",96],["miltonkeynes.co.uk",96],["newcastleworld.com",96],["newryreporter.com",96],["newsletter.co.uk",96],["northantstelegraph.co.uk",96],["northumberlandgazette.co.uk",96],["nottinghamworld.com",96],["peterboroughtoday.co.uk",96],["rotherhamadvertiser.co.uk",96],["stornowaygazette.co.uk",96],["surreyworld.co.uk",96],["thescarboroughnews.co.uk",96],["thesouthernreporter.co.uk",96],["totallysnookered.com",96],["wakefieldexpress.co.uk",96],["walesworld.com",96],["warwickshireworld.com",96],["wigantoday.net",96],["worksopguardian.co.uk",96],["yorkshireeveningpost.co.uk",96],["yorkshirepost.co.uk",96],["eurocard.com",97],["saseurobonusmastercard.se",98],["tver.jp",100],["linkedin.com",101],["elmundo.es",102],["s-pankki.fi",103],["srf.ch",103],["alternate.de",103],["bayer04.de",103],["douglas.de",103],["dr-beckmann.com",103],["falke.com",103],["fitnessfirst.de",103],["flaschenpost.de",103],["gloeckle.de",103],["hornbach.nl",103],["hypofriend.de",103],["lactostop.de",103],["postbank.de",103],["immowelt.de",104],["joyn.*",104],["morenutrition.de",104],["mapillary.com",105],["cmp.seznam.cz",107],["marca.com",108],["raiplay.it",109],["derstandard.at",110],["derstandard.de",110],["faz.net",110],["ansa.it",111],["delladio.it",111],["huffingtonpost.it",111],["lastampa.it",111],["movieplayer.it",111],["multiplayer.it",111],["repubblica.it",111],["tomshw.it",111],["tuttoandroid.net",111],["tuttotech.net",111],["ilgazzettino.it",112],["ilmessaggero.it",112],["ilsecoloxix.it",112],["privacy.motorradonline.de",113],["consent.watson.de",113],["consent.kino.de",113],["consent.desired.de",113],["dailystar.co.uk",[114,115,116,117]],["mirror.co.uk",[114,115,116,117]],["idnes.cz",118],["20minutes.fr",119],["20minutos.es",119],["24sata.hr",119],["abc.es",119],["actu.fr",119],["antena3.com",119],["antena3internacional.com",119],["atresmedia.com",119],["atresmediapublicidad.com",119],["atresmediastudios.com",119],["atresplayer.com",119],["autopista.es",119],["belfasttelegraph.co.uk",119],["bt.se",119],["bonduelle.it",119],["bonniernews.se",119],["caracol.com.co",119],["charentelibre.fr",119],["ciclismoafondo.es",119],["cnews.fr",119],["cope.es",119],["correryfitness.com",119],["courrier-picard.fr",119],["decathlon.nl",119],["decathlon.pl",119],["di.se",119],["diariocordoba.com",119],["diepresse.com",119],["dn.se",119],["dnevnik.hr",119],["dumpert.nl",119],["ebuyclub.com",119],["edreams.de",119],["edreams.net",119],["elcomercio.es",119],["elconfidencial.com",119],["eldesmarque.com",119],["elespanol.com",119],["elpais.com",119],["elpais.es",119],["engadget.com",119],["euronews.com",119],["europafm.com",119],["expressen.se",119],["filmstarts.de",119],["flooxernow.com",119],["folkbladet.nu",119],["footmercato.net",119],["france.tv",119],["france24.com",119],["francetvinfo.fr",119],["fussballtransfers.com",119],["fyndiq.se",119],["ghacks.net",119],["gva.be",119],["hbvl.be",119],["idealista.pt",119],["k.at",119],["krone.at",119],["kurier.at",119],["lacoste.com",119],["ladepeche.fr",119],["lalibre.be",119],["lanouvellerepublique.fr",119],["lasexta.com",119],["lasprovincias.es",119],["latribune.fr",119],["leboncoin.fr",119],["ledauphine.com",119],["leparisien.fr",119],["lesoir.be",119],["letelegramme.fr",119],["levoixdunord.fr",119],["xpress.fr",119],["libremercado.com",119],["lotoquebec.com",119],["lunion.fr",119],["okdiario.com",119],["marmiton.org",119],["marianne.cz",119],["melodia-fm.com",119],["moviepilot.de",119],["m6.fr",119],["metronieuws.nl",119],["multilife.com.pl",119],["naszemiasto.pl",119],["nicematin.com",119],["nieuwsblad.be",119],["numerama.com",119],["ondacero.es",119],["profil.at",119],["portail.lotoquebec.com",119],["public.fr",119],["radiofrance.fr",119],["rankia.com",119],["rfi.fr",119],["rossmann.pl",119],["rtbf.be",[119,193]],["rtl.lu",119],["sensacine.com",119],["sfgame.net",119],["shure.com",119],["silicon.es",119],["sncf-connect.com",119],["sport.es",119],["sydsvenskan.se",119],["techcrunch.com",119],["telegraaf.nl",119],["telequebec.tv",119],["tf1.fr",119],["trailrun.es",119],["tradingsat.com",119],["video-streaming.orange.fr",119],["ryobitools.eu",[120,121]],["americanexpress.com",122],["consent.radiotimes.com",125],["sp-consent.szbz.de",126],["cmp.omni.se",127],["cmp.svd.se",127],["cmp.aftonbladet.se",127],["consent.economist.com",129],["studentagency.cz",129],["cmpv2.foundryco.com",130],["cmpv2.infoworld.com",130],["cmpv2.arnnet.com.au",130],["sp-cdn.pcgames.de",131],["sp-cdn.pcgameshardware.de",131],["consentv2.sport1.de",131],["cmpv2.tori.fi",132],["cdn.privacy-mgmt.co",133],["consent.spielaffe.de",134],["degiro.*",135],["epochtimes.de",135],["vikingline.com",135],["tfl.gov.uk",135],["drklein.de",135],["volunteer.digitalboost.org.uk",135],["starhotels.com",135],["tefl.com",135],["universumglobal.com",135],["1und1.de",136],["infranken.de",137],["cmp.bunte.de",138],["cmp.chip.de",138],["cmp.focus.de",[138,430]],["estadiodeportivo.com",139],["tameteo.*",139],["tempo.pt",139],["meteored.*",139],["pogoda.com",139],["yourweather.co.uk",139],["tempo.com",139],["tiempo.com",139],["ilmeteo.net",139],["daswetter.com",139],["kicker.de",140],["formulatv.com",141],["web.de",142],["lefigaro.fr",143],["linternaute.com",144],["consent.caminteresse.fr",145],["volksfreund.de",146],["rp-online.de",146],["dailypost.co.uk",147],["the-express.com",147],["bluray-disc.de",148],["elio-systems.com",148],["tarife.mediamarkt.de",148],["lz.de",148],["gaggenau.com",148],["saturn.de",149],["eltiempo.es",[150,151]],["otempo.pt",152],["atlasformen.*",153],["cmp-sp.goettinger-tageblatt.de",154],["cmp-sp.saechsische.de",154],["cmp-sp.ln-online.de",154],["cz.de",154],["dewezet.de",154],["dnn.de",154],["haz.de",154],["gnz.de",154],["landeszeitung.de",154],["lvz.de",154],["maz-online.de",154],["ndz.de",154],["op-marburg.de",154],["ostsee-zeitung.de",154],["paz-online.de",154],["reisereporter.de",154],["rga.de",154],["rnd.de",154],["siegener-zeitung.de",154],["sn-online.de",154],["solinger-tageblatt.de",154],["sportbuzzer.de",154],["szlz.de",154],["tah.de",154],["torgauerzeitung.de",154],["waz-online.de",154],["privacy.maennersache.de",154],["sinergy.ch",156],["agglo-valais-central.ch",156],["biomedcentral.com",157],["hsbc.*",158],["hsbcnet.com",158],["hsbcinnovationbanking.com",158],["create.hsbc",158],["gbm.hsbc.com",158],["hsbc.co.uk",159],["internationalservices.hsbc.com",159],["history.hsbc.com",159],["about.hsbc.co.uk",160],["privatebanking.hsbc.com",161],["independent.co.uk",164],["privacy.crash.net",164],["the-independent.com",165],["argos.co.uk",167],["poco.de",[168,169]],["moebelix.*",168],["moemax.*",168],["xxxlutz.*",168],["xxxlesnina.*",168],["moebel24.ch",169],["meubles.fr",169],["meubelo.nl",169],["moebel.de",169],["lipo.ch",170],["schubiger.ch",171],["aedt.de",172],["berlin-live.de",172],["gutefrage.net",172],["insideparadeplatz.ch",172],["morgenpost.de",172],["play3.de",172],["thueringen24.de",172],["pdfupload.io",173],["gamestar.de",[174,202]],["gamepro.de",174],["verksamt.se",175],["acmemarkets.com",176],["amtrak.com",176],["beko.com",176],["bepanthen.com.au",176],["berocca.com.au",176],["booking.com",176],["centrum.sk",176],["claratyne.com.au",176],["credit-suisse.com",176],["ceskatelevize.cz",176],["de.vanguard",176],["dhl.de",176],["digikey.*",176],["fello.se",176],["flashscore.fr",176],["fnac.es",176],["foodandwine.com",176],["fourseasons.com",176],["khanacademy.org",176],["konami.com",176],["jll.*",176],["jobs.redbull.com",176],["hellenicbank.com",176],["groceries.asda.com",176],["n26.com",176],["nintendo.com",176],["oneweb.net",176],["panasonic.com",176],["parkside-diy.com",176],["pluto.tv",176],["ricardo.ch",176],["rockstargames.com",176],["rte.ie",176],["salesforce.com",176],["samsonite.*",176],["spirit.com",176],["stenaline.co.uk",176],["swisscom.ch",176],["swisspass.ch",176],["technologyfromsage.com",176],["telenet.be",176],["theepochtimes.com",176],["toujeo.com",176],["questdiagnostics.com",176],["wallapop.com",176],["workingtitlefilms.com",176],["vattenfall.de",176],["winparts.fr",176],["yoigo.com",176],["zoominfo.com",176],["hallmarkchannel.com",177],["noovle.com",177],["otter.ai",177],["plarium.com",177],["telsy.com",177],["timenterprise.it",177],["tim.it",177],["tradersunion.com",177],["fnac.*",177],["yeti.com",177],["here.com",178],["vodafone.com",178],["cmp.heise.de",180],["cmp.am-online.com",180],["cmp.motorcyclenews.com",180],["consent.newsnow.co.uk",180],["zara.com",181],["lepermislibre.fr",181],["negociardivida.spcbrasil.org.br",182],["adidas.*",183],["privacy.topreality.sk",184],["privacy.autobazar.eu",184],["vu.lt",185],["adnkronos.com",[186,187]],["cornwalllive.com",[186,187]],["cyprus-mail.com",[186,187]],["einthusan.tv",[186,187]],["informazione.it",[186,187]],["mymovies.it",[186,187]],["tuttoeuropei.com",[186,187]],["video.lacnews24.it",[186,187]],["protothema.gr",186],["flash.gr",186],["taxscouts.com",188],["online.no",190],["telenor.no",190],["austrian.com",191],["lufthansa.com",191],["hornetsecurity.com",192],["kayzen.io",192],["wasserkunst-hamburg.de",192],["bnc.ca",193],["egora.fr",193],["festo.com",193],["standaard.be",193],["engelvoelkers.com",193],["francemediasmonde.com",193],["francebleu.fr",193],["knipex.de",193],["giphy.com",193],["idealista.com",193],["information.tv5monde.com",193],["laprovence.com",193],["lemondeinformatique.fr",193],["mappy.com",193],["marianne.net",193],["orf.at",193],["ing.es",193],["taxfix.de",193],["rtl.be",193],["researchgate.net",193],["stroilioro.com",193],["vistaalegre.com",193],["europe1.fr",194],["usinenouvelle.com",195],["reussir.fr",197],["lesechos.fr",198],["bruendl.at",199],["latamairlines.com",200],["elisa.ee",201],["baseendpoint.brigitte.de",202],["baseendpoint.gala.de",202],["baseendpoint.haeuser.de",202],["baseendpoint.stern.de",202],["baseendpoint.urbia.de",202],["cmp.tag24.de",202],["cmpv2.berliner-zeitung.de",202],["golem.de",202],["consent.t-online.de",202],["cmp-sp.handelsblatt.com",202],["sp-consent.stuttgarter-nachrichten.de",203],["regjeringen.no",204],["sp-manager-magazin-de.manager-magazin.de",205],["consent.11freunde.de",205],["centrum24.pl",209],["replay.lsm.lv",210],["ltv.lsm.lv",210],["bernistaba.lsm.lv",210],["stadt-wien.at",211],["verl.de",211],["cubo-sauna.de",211],["mbl.is",211],["mobile.de",212],["cookist.it",213],["fanpage.it",213],["geopop.it",213],["lexplain.it",213],["royalmail.com",214],["gmx.net",215],["gmx.ch",216],["mojehobby.pl",217],["super-hobby.*",217],["sp.stylevamp.de",218],["cmp.wetteronline.de",218],["audi.*",219],["easyjet.com",219],["experian.co.uk",219],["postoffice.co.uk",219],["tescobank.com",219],["internetaptieka.lv",[220,221]],["wells.pt",222],["dskdirect.bg",223],["cmpv2.dba.dk",224],["spcmp.crosswordsolver.com",225],["thomann.de",226],["landkreis-kronach.de",227],["northcoast.com",228],["chaingpt.org",228],["bandenconcurrent.nl",229],["bandenexpert.be",229],["reserved.com",230],["metro.it",231],["makro.es",231],["metro.sk",231],["metro-cc.hr",231],["makro.nl",231],["metro.bg",231],["metro.at",231],["metro-tr.com",231],["metro.de",231],["metro.fr",231],["makro.cz",231],["metro.ro",231],["makro.pt",231],["makro.pl",231],["sklepy-odido.pl",231],["rastreator.com",231],["metro.ua",232],["metro.rs",232],["metro-kz.com",232],["metro.md",232],["metro.hu",232],["metro-cc.ru",232],["metro.pk",232],["balay.es",233],["constructa.com",233],["dafy-moto.com",234],["akku-shop.nl",235],["akkushop-austria.at",235],["akkushop-b2b.de",235],["akkushop.de",235],["akkushop.dk",235],["batterie-boutique.fr",235],["akkushop-schweiz.ch",236],["evzuttya.com.ua",237],["eobuv.cz",237],["eobuwie.com.pl",237],["ecipele.hr",237],["eavalyne.lt",237],["efootwear.eu",237],["eschuhe.ch",237],["eskor.se",237],["chaussures.fr",237],["ecipo.hu",237],["eobuv.com.ua",237],["eobuv.sk",237],["epantofi.ro",237],["epapoutsia.gr",237],["escarpe.it",237],["eschuhe.de",237],["obuvki.bg",237],["zapatos.es",237],["swedbank.ee",238],["mudanzavila.es",239],["bienmanger.com",240],["gesipa.*",241],["gesipausa.com",241],["beckhoff.com",241],["zitekick.dk",242],["eltechno.dk",242],["okazik.pl",242],["batteryempire.*",243],["maxi.rs",244],["garmin.com",245],["invisalign.*",245],["one4all.ie",245],["osprey.com",245],["wideroe.no",246],["bmw.*",247],["kijk.nl",248],["nordania.dk",249],["danskebank.*",249],["danskeci.com",249],["danicapension.dk",249],["dehn.*",250],["gewerbegebiete.de",251],["cordia.fr",252],["vola.fr",253],["lafi.fr",254],["skyscanner.*",255],["coolblue.*",256],["sanareva.*",257],["atida.fr",257],["bbva.*",258],["bbvauk.com",258],["expertise.unimi.it",259],["altenberg.de",260],["vestel.es",261],["tsb.co.uk",262],["buienradar.nl",[263,264]],["linsenplatz.de",265],["budni.de",266],["erstecardclub.hr",266],["teufel.de",[267,268]],["abp.nl",269],["simplea.sk",270],["flip.bg",271],["kiertokanki.com",272],["leirovins.be",274],["vias.be",275],["edf.fr",276],["virbac.com",276],["diners.hr",276],["squarehabitat.fr",276],["arbitrobancariofinanziario.it",277],["ivass.it",277],["economiapertutti.bancaditalia.it",277],["smit-sport.de",278],["go-e.com",279],["malerblatt-medienservice.de",280],["architekturbuch.de",280],["medienservice-holz.de",280],["leuchtstark.de",280],["casius.nl",281],["coolinarika.com",282],["vakgaragevannunen.nl",282],["fortuluz.es",282],["finna.fi",282],["eurogrow.es",282],["vakgaragevandertholen.nl",282],["whufc.com",282],["envafors.dk",283],["dabbolig.dk",[284,285]],["daruk-emelok.hu",286],["exakta.se",287],["larca.de",288],["roli.com",289],["okazii.ro",290],["lr-shop-direkt.de",290],["tgvinoui.sncf",291],["l-bank.de",292],["interhyp.de",293],["indigoneo.*",294],["transparency.meta.com",295],["eok.ee",296],["safran-group.com",296],["sr-ramenendeuren.be",296],["ilovefreegle.org",296],["tribexr.com",296],["strato.*",297],["strato-hosting.co.uk",297],["auto.de",298],["contentkingapp.com",299],["otterbox.com",300],["stoertebeker-brauquartier.com",301],["stoertebeker.com",301],["stoertebeker-eph.com",301],["aparts.pl",302],["sinsay.com",[303,304]],["benu.cz",305],["stockholmresilience.org",306],["ludvika.se",306],["kammarkollegiet.se",306],["cazenovecapital.com",307],["statestreet.com",308],["beopen.lv",309],["cesukoncertzale.lv",310],["dodo.fr",311],["pepper.it",312],["pepper.pl",312],["preisjaeger.at",312],["mydealz.de",312],["dealabs.com",312],["hotukdeals.com",312],["chollometro.com",312],["makelaarsland.nl",313],["bricklink.com",314],["bestinver.es",315],["icvs2023.conf.tuwien.ac.at",316],["racshop.co.uk",[317,318]],["baabuk.com",319],["sapien.io",319],["app.lepermislibre.fr",320],["multioferta.es",321],["testwise.com",[322,323]],["tonyschocolonely.com",324],["fitplus.is",324],["fransdegrebber.nl",324],["lilliputpress.ie",324],["lexibo.com",324],["marin-milou.com",324],["dare2tri.com",324],["t3micro.*",324],["la-vie-naturelle.com",[325,326]],["inovelli.com",327],["uonetplus.vulcan.net.pl",[328,329]],["consent.helagotland.se",330],["oper.koeln",[331,332]],["deezer.com",333],["hoteldesartssaigon.com",334],["groupeonepoint.com",335],["geneanet.org",335],["carrieres.groupegalerieslafayette.com",335],["clickskeks.at",336],["clickskeks.de",336],["abt-sportsline.de",336],["stores.sk",337],["nerdstar.de",337],["prace.cz",337],["profesia.sk",337],["profesia.cz",337],["pracezarohem.cz",337],["atmoskop.cz",337],["seduo.sk",337],["seduo.cz",337],["teamio.com",337],["arnold-robot.com",337],["cvonline.lt",337],["cv.lv",337],["cv.ee",337],["dirbam.lt",337],["visidarbi.lv",337],["otsintood.ee",337],["webtic.it",337],["pamiatki.pl",338],["initse.com",339],["salvagny.org",340],["stabila.com",341],["stwater.co.uk",342],["suncalc.org",[343,344]],["swisstph.ch",345],["taxinstitute.ie",346],["get-in-it.de",347],["tempcover.com",[348,349]],["guildford.gov.uk",350],["easyparts.*",[351,352]],["easyparts-recambios.es",[351,352]],["easyparts-rollerteile.de",[351,352]],["drimsim.com",353],["canyon.com",[354,355]],["vevovo.be",[356,357]],["vendezvotrevoiture.be",[356,357]],["wirkaufendeinauto.at",[356,357]],["vikoberallebiler.dk",[356,357]],["wijkopenautos.nl",[356,357]],["vikoperdinbil.se",[356,357]],["noicompriamoauto.it",[356,357]],["vendezvotrevoiture.fr",[356,357]],["compramostucoche.es",[356,357]],["wijkopenautos.be",[356,357]],["auto-doc.*",358],["autodoc.*",358],["autodoc24.*",358],["topautoosat.fi",358],["autoteiledirekt.de",358],["autoczescionline24.pl",358],["tuttoautoricambi.it",358],["onlinecarparts.co.uk",358],["autoalkatreszek24.hu",358],["autodielyonline24.sk",358],["reservdelar24.se",358],["pecasauto24.pt",358],["reservedeler24.co.no",358],["piecesauto24.lu",358],["rezervesdalas24.lv",358],["besteonderdelen.nl",358],["recambioscoche.es",358],["antallaktikaexartimata.gr",358],["piecesauto.fr",358],["teile-direkt.ch",358],["lpi.org",359],["refurbed.*",360],["flyingtiger.com",361],["borgomontecedrone.it",361],["recaro-shop.com",361],["gera.de",362],["mfr-chessy.fr",363],["mfr-lamure.fr",363],["mfr-saint-romain.fr",363],["mfr-lapalma.fr",363],["mfrvilliemorgon.asso.fr",363],["mfr-charentay.fr",363],["mfr.fr",363],["nationaltrust.org.uk",364],["hej-natural.*",365],["ib-hansmeier.de",366],["rsag.de",367],["esaa-eu.org",367],["answear.*",368],["theprotocol.it",[369,370]],["lightandland.co.uk",371],["etransport.pl",372],["wohnen-im-alter.de",373],["johnmuirhealth.com",[374,375]],["markushaenni.com",376],["airbaltic.com",377],["gamersgate.com",377],["zorgzaam010.nl",378],["paruvendu.fr",379],["cmpv2.bistro.sk",381],["privacy.bazar.sk",381],["hennamorena.com",382],["newsello.pl",383],["porp.pl",384],["golfbreaks.com",385],["lieferando.de",386],["just-eat.*",386],["justeat.*",386],["pyszne.pl",386],["lieferando.at",386],["takeaway.com",386],["thuisbezorgd.nl",386],["holidayhypermarket.co.uk",387],["atu.de",388],["atu-flottenloesungen.de",388],["but.fr",388],["edeka.de",388],["fortuneo.fr",388],["maif.fr",388],["sparkasse.at",388],["group.vig",388],["tf1info.fr",388],["dpdgroup.com",389],["dpd.fr",389],["dpd.com",389],["cosmosdirekt.de",389],["bstrongoutlet.pt",390],["nobbot.com",391],["isarradweg.de",[392,393]],["finlayson.fi",[394,395]],["cowaymega.ca",[394,395]],["arktis.de",396],["desktronic.de",396],["belleek.com",396],["brauzz.com",396],["cowaymega.com",396],["dockin.de",396],["dryrobe.com",396],["formswim.com",396],["hairtalk.se",396],["hallmark.co.uk",396],["loopearplugs.com",396],["oleus.com",396],["peopleofshibuya.com",396],["pullup-dip.com",396],["sanctum.shop",396],["tartanblanketco.com",396],["beam.co.uk",[397,398]],["malaikaraiss.com",399],["wefashion.com",400],["merkur.dk",401],["ionos.*",403],["omegawatches.com",404],["carefully.be",405],["aerotime.aero",405],["rocket-league.com",406],["dws.com",407],["bosch-homecomfort.com",408],["elmleblanc-optibox.fr",408],["monservicechauffage.fr",408],["boschrexroth.com",408],["home-connect.com",409],["lowrider.at",[410,411]],["mesto.de",412],["veiligverkeer.be",413],["vsv.be",413],["dehogerielen.be",413],["intersport.gr",414],["intersport.bg",414],["intersport.com.cy",414],["intersport.ro",414],["ticsante.com",415],["techopital.com",415],["millenniumprize.org",416],["hepster.com",417],["ellisphere.fr",418],["peterstaler.de",419],["blackforest-still.de",419],["tiendaplayaundi.com",420],["ajtix.co.uk",421],["raja.fr",422],["rajarani.de",422],["rajapack.*",[422,423]],["avery-zweckform.com",424],["1xinternet.de",424],["futterhaus.de",424],["dasfutterhaus.at",424],["frischeparadies.de",424],["fmk-steuer.de",424],["selgros.de",424],["mediapart.fr",425],["athlon.com",426],["alumniportal-deutschland.org",427],["snoopmedia.com",427],["myguide.de",427],["study-in-germany.de",427],["daad.de",427],["cornelsen.de",[428,429]],["vinmonopolet.no",431],["tvp.info",432],["tvp.pl",432],["tvpworld.com",432],["brtvp.pl",432],["tvpparlament.pl",432],["belsat.eu",432],["warnung.bund.de",433],["mediathek.lfv-bayern.de",434],["allegro.*",435],["allegrolokalnie.pl",435],["czc.cz",435],["eon.pl",[436,437]],["ylasatakunta.fi",[438,439]],["mega-image.ro",440],["louisvuitton.com",441],["bodensee-airport.eu",442],["department56.com",443],["allendesignsstudio.com",443],["designsbylolita.co",443],["shop.enesco.com",443],["savoriurbane.com",444],["miumiu.com",445],["church-footwear.com",445],["clickdoc.fr",446],["car-interface.com",447],["monolithdesign.it",447],["smileypack.de",[448,449]],["malijunaki.si",450],["finom.co",451],["orange.es",[452,453]],["fdm-travel.dk",454],["jysk.nl",454],["power.no",454],["skousen.dk",454],["velliv.dk",454],["whiteaway.com",454],["whiteaway.no",454],["whiteaway.se",454],["skousen.no",454],["energinet.dk",454],["altibox.no",455],["elkjop.no",455],["medimax.de",456],["lotto.it",457],["readspeaker.com",457],["ibistallinncenter.ee",458],["aaron.ai",459],["thebathcollection.com",460],["coastfashion.com",[461,462]],["oasisfashion.com",[461,462]],["warehousefashion.com",[461,462]],["misspap.com",[461,462]],["karenmillen.com",[461,462]],["boohooman.com",[461,462]],["hdt.de",463],["wolt.com",464],["myprivacy.dpgmedia.nl",465],["myprivacy.dpgmedia.be",465],["www.dpgmediagroup.com",465],["tnt.com",466],["uza.be",467],["uzafoundation.be",467],["uzajobs.be",467],["bergzeit.*",[468,469]],["cinemas-lumiere.com",470],["cdiscount.com",471],["brabus.com",472],["roborock.com",473],["strumentimusicali.net",474],["maisonmargiela.com",475],["webfleet.com",476],["dragonflyshipping.ca",477],["broekhuis.nl",478],["groningenairport.nl",478],["nemck.cz",479],["bokio.se",480],["sap-press.com",481],["roughguides.com",[482,483]],["rexbo.*",484],["topannonces.fr",485],["homap.fr",486],["artifica.fr",487],["plan-interactif.com",487],["ville-cesson.fr",487],["moismoliere.com",488],["unihomes.co.uk",489],["bkk.hu",490],["coiffhair.com",491],["ptc.eu",492],["ziegert-group.com",493],["interieur.gouv.fr",494],["toureiffel.paris",494],["education.gouv.fr",494],["livoo.fr",494],["su.se",494],["zappo.fr",494],["smdv.de",495],["digitalo.de",495],["petiteamelie.*",496],["mojanorwegia.pl",497],["koempf24.ch",[498,499]],["teichitekten24.de",[498,499]],["koempf24.de",[498,499]],["wolff-finnhaus-shop.de",[498,499]],["asnbank.nl",500],["blgwonen.nl",500],["regiobank.nl",500],["snsbank.nl",500],["vulcan.net.pl",[501,502]],["ogresnovads.lv",503],["partenamut.be",504],["pirelli.com",505],["unicredit.it",506],["effector.pl",507],["zikodermo.pl",[508,509]],["wassererleben.ch",510],["devolksbank.nl",511],["cyberport.de",513],["slevomat.cz",514],["kfzparts24.de",515],["runnersneed.com",516],["aachener-zeitung.de",517],["sportpursuit.com",518],["druni.es",[519,533]],["druni.pt",[519,533]],["delta.com",520],["onliner.by",[521,522]],["vejdirektoratet.dk",523],["usaa.com",524],["consorsbank.de",525],["metroag.de",526],["kupbilecik.pl",527],["oxfordeconomics.com",528],["oxfordeconomics.com.au",[529,530]],["ceneo.pl",531],["routershop.nl",532],["e-jumbo.gr",534],["alza.*",535],["rmf.fm",537],["rmf24.pl",537],["tracfone.com",538],["lequipe.fr",539],["gala.fr",540],["purepeople.com",541],["3sat.de",542],["zdf.de",542],["filmfund.lu",543],["welcometothejungle.com",543],["triblive.com",544],["rai.it",545],["fbto.nl",546],["bigmammagroup.com",547],["studentagency.sk",547],["studentagency.eu",547],["winparts.be",548],["winparts.nl",548],["winparts.eu",549],["winparts.ie",549],["winparts.se",549],["sportano.*",[550,551]],["crocs.*",552],["chronext.ch",553],["chronext.de",553],["chronext.at",553],["chronext.com",554],["chronext.co.uk",554],["chronext.fr",555],["chronext.nl",556],["chronext.it",557],["galerieslafayette.com",558],["bazarchic.com",559],["stilord.*",560],["tiko.pt",561],["nsinternational.com",562],["laposte.fr",563],["meinbildkalender.de",564],["gls-group.com",565],["chilis.com",566],["account.bhvr.com",568],["everand.com",568],["lucidchart.com",568],["scribd.com",568],["guidepoint.com",568],["erlebnissennerei-zillertal.at",569],["hintertuxergletscher.at",569],["tiwag.at",569],["anwbvignetten.nl",570],["playseatstore.com",570],["swiss-sport.tv",572],["consent.thetimes.com",573],["cadenaser.com",574],["offistore.fi",575],["technomarket.bg",576],["max.com",577],["rtlplay.be",578],["natgeotv.com",578],["llama.com",579],["meta.com",579],["ya.ru",580],["ipolska24.pl",581],["17bankow.com",581],["5mindlazdrowia.pl",581],["kazimierzdolny.pl",581],["vpolshchi.pl",581],["dobreprogramy.pl",581],["essanews.com",581],["dailywrap.ca",581],["dailywrap.uk",581],["money.pl",581],["autokult.pl",581],["komorkomania.pl",581],["polygamia.pl",581],["autocentrum.pl",581],["allani.pl",581],["homebook.pl",581],["domodi.pl",581],["open.fm",581],["gadzetomania.pl",581],["fotoblogia.pl",581],["abczdrowie.pl",581],["parenting.pl",581],["kafeteria.pl",581],["vibez.pl",581],["wakacje.pl",581],["extradom.pl",581],["totalmoney.pl",581],["superauto.pl",581],["nerwica.com",581],["forum.echirurgia.pl",581],["dailywrap.net",581],["pysznosci.pl",581],["genialne.pl",581],["finansowysupermarket.pl",581],["deliciousmagazine.pl",581],["jastrzabpost.pl",581],["audioteka.com",581],["easygo.pl",581],["so-magazyn.pl",581],["o2.pl",581],["pudelek.pl",581],["benchmark.pl",581],["wp.pl",581]]);
const exceptionsMap = new Map([]);
const hasEntities = true;
const hasAncestors = false;

const collectArgIndices = (hn, map, out) => {
    let argsIndices = map.get(hn);
    if ( argsIndices === undefined ) { return; }
    if ( typeof argsIndices !== 'number' ) {
        for ( const argsIndex of argsIndices ) {
            out.add(argsIndex);
        }
    } else {
        out.add(argsIndices);
    }
};

const indicesFromHostname = (hostname, suffix = '') => {
    const hnParts = hostname.split('.');
    const hnpartslen = hnParts.length;
    if ( hnpartslen === 0 ) { return; }
    for ( let i = 0; i < hnpartslen; i++ ) {
        const hn = `${hnParts.slice(i).join('.')}${suffix}`;
        collectArgIndices(hn, hostnamesMap, todoIndices);
        collectArgIndices(hn, exceptionsMap, tonotdoIndices);
    }
    if ( hasEntities ) {
        const n = hnpartslen - 1;
        for ( let i = 0; i < n; i++ ) {
            for ( let j = n; j > i; j-- ) {
                const en = `${hnParts.slice(i,j).join('.')}.*${suffix}`;
                collectArgIndices(en, hostnamesMap, todoIndices);
                collectArgIndices(en, exceptionsMap, tonotdoIndices);
            }
        }
    }
};

const entries = (( ) => {
    const docloc = document.location;
    const origins = [ docloc.origin ];
    if ( docloc.ancestorOrigins ) {
        origins.push(...docloc.ancestorOrigins);
    }
    return origins.map((origin, i) => {
        const beg = origin.lastIndexOf('://');
        if ( beg === -1 ) { return; }
        const hn = origin.slice(beg+3)
        const end = hn.indexOf(':');
        return { hn: end === -1 ? hn : hn.slice(0, end), i };
    }).filter(a => a !== undefined);
})();
if ( entries.length === 0 ) { return; }

const todoIndices = new Set();
const tonotdoIndices = new Set();

indicesFromHostname(entries[0].hn);
if ( hasAncestors ) {
    for ( const entry of entries ) {
        if ( entry.i === 0 ) { continue; }
        indicesFromHostname(entry.hn, '>>');
    }
}

// Apply scriplets
for ( const i of todoIndices ) {
    if ( tonotdoIndices.has(i) ) { continue; }
    try { trustedClickElement(...argsList[i]); }
    catch { }
}

/******************************************************************************/

// End of local scope
})();

void 0;
