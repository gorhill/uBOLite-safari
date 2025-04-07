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

// ruleset: default

// Important!
// Isolate from global scope

// Start of local scope
(function uBOL_removeNodeText() {

/******************************************************************************/

function removeNodeText(
    nodeName,
    includes,
    ...extraArgs
) {
    replaceNodeTextFn(nodeName, '', '', 'includes', includes || '', ...extraArgs);
}

function replaceNodeTextFn(
    nodeName = '',
    pattern = '',
    replacement = ''
) {
    const safe = safeSelf();
    const logPrefix = safe.makeLogPrefix('replace-node-text.fn', ...Array.from(arguments));
    const reNodeName = safe.patternToRegex(nodeName, 'i', true);
    const rePattern = safe.patternToRegex(pattern, 'gms');
    const extraArgs = safe.getExtraArgs(Array.from(arguments), 3);
    const reIncludes = extraArgs.includes || extraArgs.condition
        ? safe.patternToRegex(extraArgs.includes || extraArgs.condition, 'ms')
        : null;
    const reExcludes = extraArgs.excludes
        ? safe.patternToRegex(extraArgs.excludes, 'ms')
        : null;
    const stop = (takeRecord = true) => {
        if ( takeRecord ) {
            handleMutations(observer.takeRecords());
        }
        observer.disconnect();
        if ( safe.logLevel > 1 ) {
            safe.uboLog(logPrefix, 'Quitting');
        }
    };
    const textContentFactory = (( ) => {
        const out = { createScript: s => s };
        const { trustedTypes: tt } = self;
        if ( tt instanceof Object ) {
            if ( typeof tt.getPropertyType === 'function' ) {
                if ( tt.getPropertyType('script', 'textContent') === 'TrustedScript' ) {
                    return tt.createPolicy(getRandomTokenFn(), out);
                }
            }
        }
        return out;
    })();
    let sedCount = extraArgs.sedCount || 0;
    const handleNode = node => {
        const before = node.textContent;
        if ( reIncludes ) {
            reIncludes.lastIndex = 0;
            if ( safe.RegExp_test.call(reIncludes, before) === false ) { return true; }
        }
        if ( reExcludes ) {
            reExcludes.lastIndex = 0;
            if ( safe.RegExp_test.call(reExcludes, before) ) { return true; }
        }
        rePattern.lastIndex = 0;
        if ( safe.RegExp_test.call(rePattern, before) === false ) { return true; }
        rePattern.lastIndex = 0;
        const after = pattern !== ''
            ? before.replace(rePattern, replacement)
            : replacement;
        node.textContent = node.nodeName === 'SCRIPT'
            ? textContentFactory.createScript(after)
            : after;
        if ( safe.logLevel > 1 ) {
            safe.uboLog(logPrefix, `Text before:\n${before.trim()}`);
        }
        safe.uboLog(logPrefix, `Text after:\n${after.trim()}`);
        return sedCount === 0 || (sedCount -= 1) !== 0;
    };
    const handleMutations = mutations => {
        for ( const mutation of mutations ) {
            for ( const node of mutation.addedNodes ) {
                if ( reNodeName.test(node.nodeName) === false ) { continue; }
                if ( handleNode(node) ) { continue; }
                stop(false); return;
            }
        }
    };
    const observer = new MutationObserver(handleMutations);
    observer.observe(document, { childList: true, subtree: true });
    if ( document.documentElement ) {
        const treeWalker = document.createTreeWalker(
            document.documentElement,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
        );
        let count = 0;
        for (;;) {
            const node = treeWalker.nextNode();
            count += 1;
            if ( node === null ) { break; }
            if ( reNodeName.test(node.nodeName) === false ) { continue; }
            if ( node === document.currentScript ) { continue; }
            if ( handleNode(node) ) { continue; }
            stop(); break;
        }
        safe.uboLog(logPrefix, `${count} nodes present before installing mutation observer`);
    }
    if ( extraArgs.stay ) { return; }
    runAt(( ) => {
        const quitAfter = extraArgs.quitAfter || 0;
        if ( quitAfter !== 0 ) {
            setTimeout(( ) => { stop(); }, quitAfter);
        } else {
            stop();
        }
    }, 'interactive');
}

function getRandomTokenFn() {
    const safe = safeSelf();
    return safe.String_fromCharCode(Date.now() % 26 + 97) +
        safe.Math_floor(safe.Math_random() * 982451653 + 982451653).toString(36);
}

function runAt(fn, when) {
    const intFromReadyState = state => {
        const targets = {
            'loading': 1, 'asap': 1,
            'interactive': 2, 'end': 2, '2': 2,
            'complete': 3, 'idle': 3, '3': 3,
        };
        const tokens = Array.isArray(state) ? state : [ state ];
        for ( const token of tokens ) {
            const prop = `${token}`;
            if ( Object.hasOwn(targets, prop) === false ) { continue; }
            return targets[prop];
        }
        return 0;
    };
    const runAt = intFromReadyState(when);
    if ( intFromReadyState(document.readyState) >= runAt ) {
        fn(); return;
    }
    const onStateChange = ( ) => {
        if ( intFromReadyState(document.readyState) < runAt ) { return; }
        fn();
        safe.removeEventListener.apply(document, args);
    };
    const safe = safeSelf();
    const args = [ 'readystatechange', onStateChange, { capture: true } ];
    safe.addEventListener.apply(document, args);
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
const argsList = [["script","DisplayAcceptableAdIfAdblocked"],["script","adslotFilledByCriteo"],["script","/==undefined.*body/"],["script","\"Anzeige\""],["script","adserverDomain"],["script","Promise"],["script","/adbl/i"],["script","Reflect"],["script","document.write"],["script","deblocker"],["script","self == top"],["script","/popunder|isAdBlock|admvn.src/i"],["script","exdynsrv"],["script","/delete window|adserverDomain|FingerprintJS/"],["script","adsbygoogle"],["script","FingerprintJS"],["script","/h=decodeURIComponent|popundersPerIP/"],["script","/adblock.php"],["script","/adb/i"],["script","/document\\.createElement|\\.banner-in/"],["script","admbenefits"],["script","WebAssembly"],["script","/\\badblock\\b/"],["script","myreadCookie"],["script","ExoLoader"],["script","/?key.*open/","condition","key"],["script","adblock"],["script","homad"],["script","popUnderUrl"],["script","Adblock"],["script","/ABDetected|navigator.brave|fetch/"],["script","/ai_|b2a/"],["script","/bypass.php"],["script","htmls"],["script","/\\/detected\\.html|Adblock/"],["script","toast"],["script","AdbModel"],["script","/popup/i"],["script","antiAdBlockerHandler"],["script","/ad\\s?block|adsBlocked|document\\.write\\(unescape\\('|devtool/i"],["script","onerror"],["script","location.assign"],["script","location.href"],["script","/checkAdBlocker|AdblockRegixFinder/"],["script","catch"],["script",";break;case $."],["script","adb_detected"],["script","window.open"],["script","/aclib|break;|zoneNativeSett/"],["script","/fetch|popupshow/"],["script","justDetectAdblock"],["script","/FingerprintJS|openPopup/"],["script","DisableDevtool"],["script","/adsbygoogle|detectAdBlock/"],["script","onDevToolOpen"],["script","/WebAssembly|forceunder/"],["script","/isAdBlocked|popUnderUrl/"],["script","popundersPerIP"],["script","wpadmngr.com"],["script","/adb|offsetWidth/i"],["script","contextmenu"],["script","/adblock|var Data.*];/"],["script","var Data"],["script","replace"],["script",";}}};break;case $."],["script","globalThis;break;case"],["script","{delete window["],["style","text-decoration"],["script","/break;case|FingerprintJS/"],["script","push"],["script","AdBlocker"],["script","clicky"],["script","charCodeAt"],["script","/h=decodeURIComponent|\"popundersPerIP\"/"],["script","popMagic"],["script","/popMagic|pop1stp/"],["script","localStorage"],["script","popunder"],["script","adbl"],["script","googlesyndication"],["script","blockAdBlock"],["script","/adblock|location\\.replace/"],["script","/downloadJSAtOnload|Object.prototype.toString.call/"],["script","numberPages"],["script","brave"],["script","error-report.com"],["script","KCgpPT57bGV0IGU"],["script","adShield"],["script","Ad-Shield"],["script",".xyz/script/"],["script","adrecover.com"],["script","html-load.com"],["script","AreLoaded"],["script","AdblockRegixFinder"],["script","/adScript|adsBlocked/"],["script","serve"],["script","?metric=transit.counter&key=fail_redirect&tags="],["script","/pushAdTag|link_click|getAds/"],["script","/\\', [0-9]{5}\\)\\]\\; \\}/"],["script","/\\\",\\\"clickp\\\"\\:\\\"[0-9]{1,2}\\\"/"],["script","/ConsoleBan|alert|AdBlocker/"],["script","runPop"],["style","body:not(.ownlist)"],["script","mdpDeblocker"],["script","alert","condition","adblock"],["script","/decodeURIComponent\\(escape|fairAdblock/"],["script","/ai_|googletag|adb/"],["script","/deblocker|chp_ad/"],["script","await fetch"],["script","AdBlock"],["script","innerHTML"],["script","/'.adsbygoogle'|text-danger|warning|Adblock|_0x/"],["script","insertAdjacentHTML"],["script","popUnder"],["script","adb"],["#text","/スポンサーリンク|Sponsored Link|广告/"],["#text","スポンサーリンク"],["#text","スポンサードリンク"],["#text","/\\[vkExUnit_ad area=(after|before)\\]/"],["#text","【広告】"],["#text","【PR】"],["#text","関連動画"],["#text","PR:"],["script","leave_recommend"],["#text","/Advertisement/"],["script","navigator.brave"],["script","ai_adb"],["script","HTMLAllCollection"],["script","liedetector"],["script","popWin"],["script","end_click"],["script","ad blocker"],["script","closeAd"],["script","/adconfig/i"],["script","AdblockDetector"],["script","is_antiblock_refresh"],["script","/userAgent|adb|htmls/"],["script","myModal"],["script","app_checkext"],["script","clientHeight"],["script","Brave"],["script","await"],["script","Object.keys(window.adngin).length"],["script","axios"],["script","\"v4ac1eiZr0\""],["script","admiral"],["script","'').split(',')[4]"],["script","\"\").split(\",\")[4]"],["script","/\"v4ac1eiZr0\"|\"\"\\)\\.split\\(\",\"\\)\\[4\\]|(\\.localStorage\\)|JSON\\.parse\\(\\w)\\.getItem\\(\"/"],["script","/charAt|XMLHttpRequest/"],["script","AdBlockEnabled"],["script","window.location.replace"],["script","egoTab"],["script","abDetectorPro"],["script","/$.*(css|oncontextmenu)/"],["script","/eval.*RegExp/"],["script","wwads"],["script","/\\[\\'push\\'\\]/"],["script","/adblock/i"],["script","/ads?Block/i"],["script","chkADB"],["script","Symbol.iterator"],["script","ai_cookie"],["script","/$.*open/"],["script","/innerHTML.*appendChild/"],["script","Exo"],["script","detectAdBlock"],["script","AaDetector"],["script","/window\\[\\'open\\'\\]/"],["script","Error"],["script","/document\\.head\\.appendChild|window\\.open/"],["script","pop1stp"],["script","Number"],["script","NEXT_REDIRECT"],["script","ad-block-activated"],["script","insertBefore"],["script","pop.doEvent"],["script","detect"],["script","fetch"],["script","/hasAdblock|detect/"],["script","document.createTextNode"],["script","/h=decodeURIComponent|popundersPerIP|adserverDomain/"],["script","/shown_at|WebAssembly/"],["script","style"],["script","shown_at"],["script","adsSrc"],["script","/adblock|popunder|openedPop|WebAssembly/"],["script","/popMagic|nativeads|navigator\\.brave|\\.abk_msg|\\.innerHTML|ad block|manipulation/"],["script","window.warn"],["script","adBlock"],["script","adBlockDetected"],["script","/fetch|adb/i"],["script","location"],["script","showAd"],["script","imgSrc"],["script","document.createElement(\"script\")"],["script","antiAdBlock"],["script","/fairAdblock|popMagic/"],["script","/pop1stp|detectAdBlock/"],["script","aclib.runPop"],["script","mega-enlace.com/ext.php?o="],["script","Popup"],["script","displayAdsV3"],["script","adblocker"],["script","break;case"],["h2","/creeperhost/i"],["script","/interceptClickEvent|onbeforeunload|popMagic|location\\.replace/"],["script","/adserverDomain|\\);break;case /"],["script","initializeInterstitial"],["script","popupBackground"],["script","Math.floor"],["script","m9-ad-modal"],["script","Anzeige"],["script","blocking"],["script","adBlockNotice"],["script","LieDetector"],["script","advads"],["script","document.cookie"],["script","/h=decodeURIComponent|popundersPerIP|window\\.open|\\.createElement/"],["script","/_0x|brave|onerror/"],["script","window.googletag.pubads"],["script","kmtAdsData"],["script","wpadmngr"],["script","navigator.userAgent"],["script","checkAdBlock"],["script","detectedAdblock"],["script","setADBFlag"],["script","/h=decodeURIComponent|popundersPerIP|wpadmngr|popMagic/"],["script","/wpadmngr|adserverDomain/"],["script","/account_ad_blocker|tmaAB/"],["script","ads_block"],["script","/adserverDomain|delete window|FingerprintJS/"],["script","return a.split"],["script","/popundersPerIP|adserverDomain|wpadmngr/"],["script","==\"]"],["script","ads-blocked"],["script","#adbd"],["script","AdBl"],["script","/adblock|Cuba|noadb/i"],["script","/adserverDomain|ai_cookie/"],["script","/adsBlocked|\"popundersPerIP\"/"],["script","ab.php"],["script","wpquads_adblocker_check"],["script","callbackAdsBlocked"],["script","__adblocker"],["script","/alert|brave|blocker/i"],["script","/join\\(\\'\\'\\)/"],["script","/join\\(\\\"\\\"\\)/"],["script","api.dataunlocker.com"],["script","/^Function\\(\\\"/"],["script","vglnk"],["script","/detect|FingerprintJS/"],["script","/RegExp\\(\\'/","condition","RegExp"],["script","adBlockEnabled"],["script","\"data-adm-url\""],["script","NREUM"]];
const hostnamesMap = new Map([["alpin.de",0],["boersennews.de",0],["chefkoch.de",0],["chip.de",0],["clever-tanken.de",0],["desired.de",0],["donnerwetter.de",0],["fanfiktion.de",0],["focus.de",0],["formel1.de",0],["frustfrei-lernen.de",0],["gewinnspiele.tv",0],["giga.de",0],["gut-erklaert.de",0],["kino.de",0],["messen.de",0],["nickles.de",0],["nordbayern.de",0],["spielfilm.de",0],["teltarif.de",[0,1]],["unsere-helden.com",0],["weltfussball.at",0],["watson.de",0],["moviepilot.de",[0,5]],["mactechnews.de",0],["sport1.de",0],["welt.de",0],["sport.de",0],["allthingsvegas.com",2],["100percentfedup.com",2],["beforeitsnews.com",2],["concomber.com",2],["conservativebrief.com",2],["conservativefiringline.com",2],["dailylol.com",2],["funnyand.com",2],["letocard.fr",2],["mamieastuce.com",2],["meilleurpronostic.fr",2],["patriotnationpress.com",2],["toptenz.net",2],["vitamiiin.com",2],["writerscafe.org",2],["populist.press",2],["dailytruthreport.com",2],["livinggospeldaily.com",2],["first-names-meanings.com",2],["welovetrump.com",2],["thehayride.com",2],["thelibertydaily.com",2],["thepoke.co.uk",2],["thepolitistick.com",2],["theblacksphere.net",2],["shark-tank.com",2],["naturalblaze.com",2],["greatamericanrepublic.com",2],["dailysurge.com",2],["truthlion.com",2],["flagandcross.com",2],["westword.com",2],["republicbrief.com",2],["freedomfirstnetwork.com",2],["phoenixnewtimes.com",2],["designbump.com",2],["clashdaily.com",2],["madworldnews.com",2],["reviveusa.com",2],["sonsoflibertymedia.com",2],["thedesigninspiration.com",2],["videogamesblogger.com",2],["protrumpnews.com",2],["thepalmierireport.com",2],["kresy.pl",2],["thepatriotjournal.com",2],["gellerreport.com",2],["thegatewaypundit.com",2],["wltreport.com",2],["miaminewtimes.com",2],["politicalsignal.com",2],["rightwingnews.com",2],["bigleaguepolitics.com",2],["comicallyincorrect.com",2],["web.de",3],["skidrowreloaded.com",[4,16]],["wawacity.*",4],["720pstream.*",[4,64]],["embedsports.me",[4,68]],["embedstream.me",[4,15,16,64,68]],["jumbtv.com",[4,68]],["reliabletv.me",[4,68]],["topembed.pw",[4,66,209]],["crackstreamer.net",4],["methstreamer.com",4],["rnbastreams.com",4],["vidsrc.*",[4,15,64]],["1stream.eu",4],["4kwebplay.xyz",4],["anime4i.vip",4],["antennasports.ru",4],["buffsports.me",[4,64]],["buffstreams.app",4],["claplivehdplay.ru",[4,209]],["cracksports.me",[4,15]],["euro2024direct.ru",4],["ext.to",4],["extreme-down.*",4],["eztv.tf",4],["eztvx.to",4],["flix-wave.*",4],["hikaritv.xyz",4],["kenitv.me",[4,15,16]],["lewblivehdplay.ru",[4,209]],["mixdrop.*",[4,16]],["mlbbite.net",4],["mlbstreams.ai",4],["qatarstreams.me",[4,15]],["qqwebplay.xyz",[4,209]],["sanet.*",4],["soccerworldcup.me",[4,15]],["sportshd.*",4],["topstreams.info",4],["totalsportek.to",4],["viwlivehdplay.ru",4],["vidco.pro",[4,64]],["userupload.*",6],["cinedesi.in",6],["intro-hd.net",6],["monacomatin.mc",6],["nodo313.net",6],["hesgoal-tv.io",6],["hesgoal-vip.io",6],["earn.punjabworks.com",6],["mahajobwala.in",6],["solewe.com",6],["pahe.*",[7,16,66]],["soap2day.*",7],["yts.mx",8],["magesypro.com",9],["pinsystem.co.uk",9],["elrellano.com",9],["tinyppt.com",9],["veganab.co",9],["camdigest.com",9],["learnmany.in",9],["amanguides.com",[9,36]],["highkeyfinance.com",[9,36]],["appkamods.com",9],["techacode.com",9],["djqunjab.in",9],["downfile.site",9],["expertvn.com",9],["trangchu.news",9],["3dmodelshare.org",9],["nulleb.com",9],["asiaon.top",9],["reset-scans.*",9],["coursesghar.com",9],["thecustomrom.com",9],["snlookup.com",9],["bingotingo.com",9],["ghior.com",9],["3dmili.com",9],["karanpc.com",9],["plc247.com",9],["apkdelisi.net",9],["freepasses.org",9],["poplinks.*",[9,40]],["tomarnarede.pt",9],["basketballbuzz.ca",9],["dribbblegraphics.com",9],["kemiox.com",9],["teksnologi.com",9],["bharathwick.com",9],["descargaspcpro.net",9],["dx-tv.com",9],["rt3dmodels.com",9],["plc4me.com",9],["blisseyhusbands.com",9],["mhdsports.*",9],["mhdsportstv.*",9],["mhdtvsports.*",9],["mhdtvworld.*",9],["mhdtvmax.*",9],["mhdstream.*",9],["madaradex.org",9],["trigonevo.com",9],["franceprefecture.fr",9],["jazbaat.in",9],["aipebel.com",9],["audiotools.blog",9],["embdproxy.xyz",9],["hqq.*",10],["waaw.*",10],["upornia.com",11],["pixhost.*",12],["vipbox.*",13],["germancarforum.com",14],["cybercityhelp.in",14],["innateblogger.com",14],["omeuemprego.online",14],["viprow.*",[15,16,64]],["bluemediadownload.*",15],["bluemediafile.*",15],["bluemedialink.*",15],["bluemediastorage.*",15],["bluemediaurls.*",15],["urlbluemedia.*",15],["streamnoads.com",[15,16,55,64]],["bowfile.com",15],["cloudvideo.tv",[15,64]],["cloudvideotv.*",[15,64]],["coloredmanga.com",15],["exeo.app",15],["hiphopa.net",[15,16]],["megaup.net",15],["olympicstreams.co",[15,64]],["tv247.us",[15,16]],["uploadhaven.com",15],["userscloud.com",[15,64]],["mlbbox.me",15],["vikingf1le.us.to",15],["neodrive.xyz",15],["mdfx9dc8n.net",16],["mdzsmutpcvykb.net",16],["mixdrop21.net",16],["mixdropjmk.pw",16],["123-movies.*",16],["123movieshd.*",16],["123movieshub.*",16],["123moviesme.*",16],["1337x.*",[16,183]],["141jav.com",16],["1bit.space",16],["1bitspace.com",16],["1stream.*",16],["1tamilmv.*",16],["2ddl.*",16],["2umovies.*",16],["345movies.com",16],["3dporndude.com",16],["3hiidude.*",16],["4archive.org",16],["4horlover.com",16],["4stream.*",16],["560pmovie.com",16],["5movies.*",16],["7hitmovies.*",16],["85tube.com",16],["85videos.com",16],["9xmovie.*",16],["aagmaal.*",[16,64]],["acefile.co",16],["actusports.eu",16],["adblockeronstape.*",[16,55]],["adblockeronstreamtape.*",16],["adblockplustape.*",[16,55]],["adblockstreamtape.*",[16,55]],["adblockstrtape.*",[16,55]],["adblockstrtech.*",[16,55]],["adblocktape.*",[16,55]],["adclickersbot.com",16],["adcorto.*",16],["adricami.com",16],["adslink.pw",16],["adultstvlive.com",16],["adz7short.space",16],["aeblender.com",16],["ahdafnews.blogspot.com",16],["ak47sports.com",16],["akuma.moe",16],["alexsports.*",16],["alexsportss.*",16],["alexsportz.*",16],["allplayer.tk",16],["amateurblog.tv",16],["androidadult.com",[16,235]],["anhsexjav.xyz",16],["anidl.org",16],["anime-loads.org",16],["animeblkom.net",16],["animefire.plus",16],["animelek.me",16],["animepahe.*",16],["animesanka.*",16],["animespire.net",16],["animestotais.xyz",16],["animeyt.es",16],["animixplay.*",16],["aniplay.*",16],["anroll.net",16],["antiadtape.*",[16,55]],["anymoviess.xyz",16],["aotonline.org",16],["asenshu.com",16],["asialiveaction.com",16],["asianclipdedhd.net",16],["asianclub.*",16],["ask4movie.*",16],["askim-bg.com",16],["asumsikedaishop.com",16],["atomixhq.*",[16,64]],["atomohd.*",16],["avcrempie.com",16],["avseesee.com",16],["gettapeads.com",[16,55]],["backfirstwo.com",16],["bajarjuegospcgratis.com",16],["balkanportal.net",16],["balkanteka.net",16],["bdnewszh.com",[16,64]],["beinmatch.*",[16,25]],["belowporn.com",16],["bestgirlsexy.com",16],["bestnhl.com",16],["bestporn4free.com",16],["bestporncomix.com",16],["bet36.es",16],["bgwp.cc",[16,21]],["bhaai.*",16],["bikinitryon.net",16],["birdurls.com",16],["bitsearch.to",16],["blackcockadventure.com",16],["blackcockchurch.org",16],["blackporncrazy.com",16],["blizzboygames.net",16],["blizzpaste.com",16],["blkom.com",16],["blog-peliculas.com",16],["blogtrabalhista.com",16],["blurayufr.*",16],["bobsvagene.club",16],["bolly4umovies.click",16],["bonusharian.pro",16],["brilian-news.id",16],["brupload.net",16],["bucitana.com",16],["buffstreams.*",16],["camchickscaps.com",16],["camgirlcum.com",16],["camgirls.casa",16],["canalesportivo.*",16],["cashurl.in",16],["castingx.net",16],["ccurl.net",[16,64]],["celebrity-leaks.net",16],["cgpelis.net",16],["charexempire.com",16],["choosingnothing.com",16],["clasico.tv",16],["clickndownload.*",16],["clicknupload.*",16],["clik.pw",16],["coin-free.com",[16,33]],["coins100s.fun",16],["comicsmanics.com",16],["compucalitv.com",16],["coolcast2.com",16],["cosplaytab.com",16],["countylocalnews.com",16],["cpmlink.net",16],["crackstreamshd.click",16],["crespomods.com",16],["crisanimex.com",16],["crunchyscan.fr",16],["cuevana3.fan",16],["cuevana3hd.com",16],["cumception.com",16],["cutpaid.com",16],["daddylive.*",[16,64,207]],["daddylivehd.*",[16,64]],["dailyuploads.net",16],["datawav.club",16],["daughtertraining.com",16],["ddrmovies.*",16],["deepgoretube.site",16],["deltabit.co",16],["deporte-libre.top",16],["depvailon.com",16],["derleta.com",16],["desiremovies.*",16],["desivdo.com",16],["desixx.net",16],["detikkebumen.com",16],["deutschepornos.me",16],["devlib.*",16],["diasoft.xyz",16],["directupload.net",16],["diskusscan.com",16],["divxtotal.*",16],["divxtotal1.*",16],["dixva.com",16],["dlhd.*",16],["doctormalay.com",16],["dofusports.xyz",16],["dogemate.com",16],["doods.cam",16],["doodskin.lat",16],["downloadrips.com",16],["downvod.com",16],["dphunters.mom",16],["dragontranslation.com",16],["dvdfullestrenos.com",16],["dvdplay.*",[16,64]],["ebookbb.com",16],["ebookhunter.net",16],["egyanime.com",16],["egygost.com",16],["egyshare.cc",16],["ekasiwap.com",16],["electro-torrent.pl",16],["elil.cc",16],["elixx.*",16],["enjoy4k.*",16],["eplayer.click",16],["erovoice.us",16],["eroxxx.us",16],["estrenosdoramas.net",16],["estrenosflix.*",16],["estrenosflux.*",16],["estrenosgo.*",16],["everia.club",16],["everythinginherenet.blogspot.com",16],["extrafreetv.com",16],["extremotvplay.com",16],["f1stream.*",16],["fapinporn.com",16],["fapptime.com",16],["fashionblog.tv",16],["fastreams.live",16],["faucethero.com",16],["fbstream.*",16],["fembed.com",16],["femdom-joi.com",16],["file4go.*",16],["fileone.tv",16],["film1k.com",16],["filmeonline2023.net",16],["filmesonlinex.org",16],["filmesonlinexhd.biz",[16,64]],["filmovitica.com",16],["filmymaza.blogspot.com",16],["filmyzilla.*",[16,64]],["filthy.family",16],["findav.*",16],["findporn.*",16],["fixfinder.click",16],["flixmaza.*",16],["flizmovies.*",16],["flostreams.xyz",16],["flyfaucet.com",16],["footyhunter.lol",16],["forex-trnd.com",16],["forumchat.club",16],["forumlovers.club",16],["freemoviesonline.biz",16],["freeomovie.co.in",16],["freeomovie.to",16],["freeporncomic.net",16],["freepornhdonlinegay.com",16],["freeproxy.io",16],["freetvsports.*",16],["freeuse.me",16],["freeusexporn.com",16],["fsharetv.cc",16],["fsicomics.com",16],["fullymaza.*",16],["g3g.*",16],["galinhasamurai.com",16],["gamepcfull.com",16],["gameronix.com",16],["gamesfullx.com",16],["gameshdlive.net",16],["gamesmountain.com",16],["gamesrepacks.com",16],["gamingguru.fr",16],["gamovideo.com",16],["garota.cf",16],["gaydelicious.com",16],["gaypornmasters.com",16],["gaysex69.net",16],["gemstreams.com",16],["get-to.link",16],["girlscanner.org",16],["giurgiuveanul.ro",16],["gledajcrtace.xyz",16],["gocast2.com",16],["gomo.to",16],["gostosa.cf",16],["gotxx.*",16],["grantorrent.*",16],["gtlink.co",16],["gwiazdypornosow.pl",16],["haho.moe",16],["hatsukimanga.com",16],["hayhd.net",16],["hdmoviesfair.*",[16,64]],["hdmoviesflix.*",16],["hdsaprevodom.com",16],["hdstreamss.club",16],["hentais.tube",16],["hentaistream.co",16],["hentaitk.net",16],["hentaitube.online",16],["hentaiworld.tv",16],["hesgoal.tv",16],["hexupload.net",16],["hhkungfu.tv",16],["highlanderhelp.com",16],["hiidudemoviez.*",16],["hindimean.com",16],["hindimovies.to",[16,64]],["hiperdex.com",16],["hispasexy.org",16],["hitprn.com",16],["hoca4u.com",16],["hollymoviehd.cc",16],["hoodsite.com",16],["hopepaste.download",16],["hornylips.com",16],["hotgranny.live",16],["hotmama.live",16],["hqcelebcorner.net",16],["huren.best",16],["hwnaturkya.com",[16,64]],["hxfile.co",[16,64]],["igfap.com",16],["iklandb.com",16],["illink.net",16],["imgkings.com",16],["imgsen.*",16],["imgsex.xyz",16],["imgsto.*",16],["imx.to",16],["incest.*",16],["incestflix.*",16],["influencersgonewild.org",16],["infosgj.free.fr",16],["investnewsbrazil.com",16],["itdmusics.com",16],["itopmusic.*",16],["itsuseful.site",16],["itunesfre.com",16],["iwatchfriendsonline.net",[16,128]],["jackstreams.com",16],["jatimupdate24.com",16],["jav-fun.cc",16],["jav-noni.cc",16],["jav-scvp.com",16],["javcl.com",16],["javf.net",16],["javhay.net",16],["javhoho.com",16],["javhun.com",16],["javleak.com",16],["javmost.*",16],["javporn.best",16],["javsek.net",16],["javsex.to",16],["javtiful.com",[16,18]],["jimdofree.com",16],["jiofiles.org",16],["jorpetz.com",16],["jp-films.com",16],["jpop80ss3.blogspot.com",16],["jpopsingles.eu",[16,185]],["kantotflix.net",16],["kantotinyo.com",16],["kaoskrew.org",16],["kaplog.com",16],["keeplinks.*",16],["keepvid.*",16],["keralahd.*",16],["keralatvbox.com",16],["khatrimazaful.*",16],["khatrimazafull.*",[16,58]],["kickassanimes.io",16],["kimochi.info",16],["kimochi.tv",16],["kinemania.tv",16],["konstantinova.net",16],["koora-online.live",16],["kunmanga.com",16],["kutmoney.com",16],["kwithsub.com",16],["lat69.me",16],["latinblog.tv",16],["latinomegahd.net",16],["leechall.*",16],["leechpremium.link",16],["legendas.dev",16],["legendei.net",16],["lightdlmovies.blogspot.com",16],["lighterlegend.com",16],["linclik.com",16],["linkebr.com",16],["linkrex.net",16],["linkshorts.*",16],["lulu.st",16],["lulustream.com",[16,66]],["luluvdo.com",16],["manga-oni.com",16],["mangaboat.com",16],["mangagenki.me",16],["mangahere.onl",16],["mangaweb.xyz",16],["mangoporn.net",16],["mangovideo.*",16],["manhwahentai.me",16],["masahub.com",16],["masahub.net",16],["masaporn.*",16],["maturegrannyfuck.com",16],["mdy48tn97.com",16],["mediapemersatubangsa.com",16],["mega-mkv.com",16],["megapastes.com",16],["megapornpics.com",16],["messitv.net",16],["meusanimes.net",16],["milfmoza.com",16],["milfzr.com",16],["millionscast.com",16],["mimaletamusical.blogspot.com",16],["miniurl.*",16],["mirrorace.*",16],["mitly.us",16],["mixdroop.*",16],["mkv-pastes.com",16],["mkvcage.*",16],["mlbstream.*",16],["mlsbd.*",16],["mmsbee.*",16],["monaskuliner.ac.id",16],["moredesi.com",16],["motogpstream.*",16],["movgotv.net",16],["movi.pk",16],["movieplex.*",16],["movierulzlink.*",16],["movies123.*",16],["moviesflix.*",16],["moviesmeta.*",16],["moviessources.*",16],["moviesverse.*",16],["movieswbb.com",16],["moviewatch.com.pk",16],["moviezwaphd.*",16],["mp4upload.com",16],["mrskin.live",16],["mrunblock.*",16],["multicanaistv.com",16],["mundowuxia.com",16],["myeasymusic.ir",16],["myonvideo.com",16],["myyouporn.com",16],["narutoget.info",16],["naughtypiss.com",16],["nbastream.*",16],["nerdiess.com",16],["new-fs.eu",16],["newmovierulz.*",16],["newtorrentgame.com",16],["nflstream.*",16],["nflstreams.me",16],["nhlstream.*",16],["niaomea.me",[16,64]],["nicekkk.com",16],["nicesss.com",16],["nlegs.com",16],["noblocktape.*",[16,55]],["nocensor.*",16],["nolive.me",[16,64]],["notformembersonly.com",16],["novamovie.net",16],["novelpdf.xyz",16],["novelssites.com",[16,64]],["novelup.top",16],["nsfwr34.com",16],["nu6i-bg-net.com",16],["nudebabesin3d.com",16],["nukedfans.com",16],["nuoga.eu",16],["nzbstars.com",16],["o2tvseries.com",16],["ohjav.com",16],["ojearnovelas.com",16],["okanime.xyz",16],["olweb.tv",16],["on9.stream",16],["onepiece-mangaonline.com",16],["onifile.com",16],["onionstream.live",16],["onlinesaprevodom.net",16],["onlyfams.*",16],["onlyfullporn.video",16],["onplustv.live",16],["originporn.com",16],["ouo.*",16],["ovagames.com",16],["ovamusic.com",16],["packsporn.com",16],["pahaplayers.click",16],["palimas.org",16],["password69.com",16],["pastemytxt.com",16],["payskip.org",16],["pctfenix.*",[16,64]],["pctnew.*",[16,64]],["peeplink.in",16],["peliculas24.*",16],["peliculasmx.net",16],["pelisplus.*",16],["pervertgirlsvideos.com",16],["pervyvideos.com",16],["phim12h.com",16],["picdollar.com",16],["pickteenz.com",16],["picsxxxporn.com",16],["pinayscandalz.com",16],["pinkueiga.net",16],["piratebay.*",16],["piratefast.xyz",16],["piratehaven.xyz",16],["pirateiro.com",16],["pirlotvonline.org",16],["playtube.co.za",16],["plugintorrent.com",16],["plyjam.*",16],["plylive.*",16],["plyvdo.*",16],["pmvzone.com",16],["porndish.com",16],["pornez.net",16],["pornfetishbdsm.com",16],["pornfits.com",16],["pornhd720p.com",16],["pornhoarder.*",[16,228]],["pornobr.club",16],["pornobr.ninja",16],["pornodominicano.net",16],["pornofaps.com",16],["pornoflux.com",16],["pornotorrent.com.br",16],["pornredit.com",16],["pornstarsyfamosas.es",16],["pornstreams.co",16],["porntn.com",16],["pornxbit.com",16],["pornxday.com",16],["portaldasnovinhas.shop",16],["portugues-fcr.blogspot.com",16],["poscitesch.com",[16,64]],["poseyoung.com",16],["pover.org",16],["prbay.*",16],["projectfreetv.*",16],["proxybit.*",16],["proxyninja.org",16],["psarips.*",16],["pubfilmz.com",16],["publicsexamateurs.com",16],["punanihub.com",16],["putlocker5movies.org",16],["pxxbay.com",16],["r18.best",16],["racaty.*",16],["ragnaru.net",16],["rapbeh.net",16],["rapelust.com",16],["rapload.org",16],["read-onepiece.net",16],["remaxhd.*",16],["retro-fucking.com",16],["retrotv.org",16],["rintor.*",16],["rnbxclusive.*",16],["rnbxclusive0.*",16],["rnbxclusive1.*",16],["robaldowns.com",16],["rockdilla.com",16],["rojadirecta.*",16],["rojadirectaenvivo.*",16],["rojadirectatvenvivo.com",16],["rojitadirecta.blogspot.com",16],["romancetv.site",16],["rsoccerlink.site",16],["rugbystreams.*",16],["rule34.club",16],["rule34hentai.net",16],["rumahbokep-id.com",16],["sadisflix.*",16],["safego.cc",16],["safetxt.*",16],["sakurafile.com",16],["satoshi-win.xyz",16],["scat.gold",16],["scatfap.com",16],["scatkings.com",16],["scnlog.me",16],["scripts-webmasters.net",16],["serie-turche.com",16],["serijefilmovi.com",16],["sexcomics.me",16],["sexdicted.com",16],["sexgay18.com",16],["sexofilm.co",16],["sextgem.com",16],["sextubebbw.com",16],["sgpics.net",16],["shadowrangers.*",16],["shadowrangers.live",16],["shahee4u.cam",16],["shahi4u.*",16],["shahid4u1.*",16],["shahid4uu.*",16],["shahiid-anime.net",16],["shavetape.*",16],["shemale6.com",16],["shid4u.*",16],["shinden.pl",16],["short.es",16],["shortearn.*",16],["shorten.*",16],["shorttey.*",16],["shortzzy.*",16],["showmanga.blog.fc2.com",16],["shrt10.com",16],["shurt.pw",16],["sideplusleaks.net",16],["silverblog.tv",16],["silverpic.com",16],["sinhalasub.life",16],["sinsitio.site",16],["sinvida.me",16],["skidrowcpy.com",16],["skidrowfull.com",16],["skymovieshd.*",16],["slut.mom",16],["smallencode.me",16],["smoner.com",16],["smplace.com",16],["soccerinhd.com",[16,64]],["socceron.name",16],["socceronline.*",[16,64]],["softairbay.com",16],["softarchive.*",16],["sokobj.com",16],["songsio.com",16],["souexatasmais.com",16],["sportbar.live",16],["sports-stream.*",16],["sportstream1.cfd",16],["sporttuna.*",16],["srt.am",16],["srts.me",16],["sshhaa.*",16],["stapadblockuser.*",[16,55]],["stape.*",[16,55]],["stapewithadblock.*",16],["starmusiq.*",16],["stbemuiptv.com",16],["stockingfetishvideo.com",16],["strcloud.*",[16,55]],["stream.crichd.vip",16],["stream.lc",16],["stream25.xyz",16],["streamadblocker.*",[16,55,64]],["streamadblockplus.*",[16,55]],["streambee.to",16],["streamcdn.*",16],["streamcenter.pro",16],["streamers.watch",16],["streamgo.to",16],["streamhub.*",16],["streamkiste.tv",16],["streamoupload.xyz",16],["streamservicehd.click",16],["streamsport.*",16],["streamta.*",[16,55]],["streamtape.*",[16,55]],["streamtapeadblockuser.*",[16,55]],["streamvid.net",[16,26]],["strikeout.*",[16,66]],["strtape.*",[16,55]],["strtapeadblock.*",[16,55]],["strtapeadblocker.*",[16,55]],["strtapewithadblock.*",16],["strtpe.*",[16,55]],["subtitleporn.com",16],["subtitles.cam",16],["suicidepics.com",16],["supertelevisionhd.com",16],["supexfeeds.com",16],["swatchseries.*",16],["swiftload.io",16],["swipebreed.net",16],["swzz.xyz",16],["sxnaar.com",16],["tabooflix.*",16],["tabooporns.com",16],["taboosex.club",16],["tapeantiads.com",[16,55]],["tapeblocker.com",[16,55]],["tapenoads.com",[16,55]],["tapewithadblock.org",[16,55,252]],["teamos.xyz",16],["teen-wave.com",16],["teenporncrazy.com",16],["telegramgroups.xyz",16],["telenovelasweb.com",16],["tennisstreams.*",16],["tensei-shitara-slime-datta-ken.com",16],["tfp.is",16],["tgo-tv.co",[16,64]],["thaihotmodels.com",16],["theblueclit.com",16],["thebussybandit.com",16],["thedaddy.to",[16,207]],["theicongenerator.com",16],["thelastdisaster.vip",16],["themoviesflix.*",16],["thepiratebay.*",16],["thepiratebay0.org",16],["thepiratebay10.info",16],["thesexcloud.com",16],["thothub.today",16],["tightsexteens.com",16],["tmearn.*",16],["tojav.net",16],["tokyoblog.tv",16],["toonanime.*",16],["top16.net",16],["topvideosgay.com",16],["torlock.*",16],["tormalayalam.*",16],["torrage.info",16],["torrents.vip",16],["torrentz2eu.*",16],["torrsexvid.com",16],["tpb-proxy.xyz",16],["trannyteca.com",16],["trendytalker.com",16],["tumanga.net",16],["turbogvideos.com",16],["turbovid.me",16],["turkishseriestv.org",16],["turksub24.net",16],["tutele.sx",16],["tutelehd.*",16],["tvglobe.me",16],["tvpclive.com",16],["tvply.*",16],["tvs-widget.com",16],["tvseries.video",16],["u4m.*",16],["ucptt.com",16],["ufaucet.online",16],["ufcfight.online",16],["ufcstream.*",16],["ultrahorny.com",16],["ultraten.net",16],["unblocknow.*",16],["unblockweb.me",16],["underhentai.net",16],["uniqueten.net",16],["upbaam.com",16],["uploadbuzz.*",16],["upstream.to",16],["usagoals.*",16],["valeriabelen.com",16],["verdragonball.online",16],["vexmoviex.*",16],["vfxmed.com",16],["vidclouds.*",16],["video.az",16],["videostreaming.rocks",16],["videowood.tv",16],["vidlox.*",16],["vidorg.net",16],["vidtapes.com",16],["vidz7.com",16],["vikistream.com",16],["vikv.net",16],["vipboxtv.*",[16,64]],["vipleague.*",[16,231]],["virpe.cc",16],["visifilmai.org",16],["viveseries.com",16],["vladrustov.sx",16],["volokit2.com",[16,207]],["vstorrent.org",16],["w-hentai.com",16],["watch-series.*",16],["watchbrooklynnine-nine.com",16],["watchelementaryonline.com",16],["watchjavidol.com",16],["watchkobestreams.info",16],["watchlostonline.net",16],["watchmonkonline.com",16],["watchrulesofengagementonline.com",16],["watchseries.*",16],["watchthekingofqueens.com",16],["webcamrips.com",16],["wincest.xyz",16],["wolverdon.fun",16],["wordcounter.icu",16],["worldmovies.store",16],["worldstreams.click",16],["wpdeployit.com",16],["wqstreams.tk",16],["wwwsct.com",16],["xanimeporn.com",16],["xblog.tv",16],["xclusivejams.*",16],["xmoviesforyou.*",16],["xn--verseriesespaollatino-obc.online",16],["xn--xvideos-espaol-1nb.com",16],["xpornium.net",16],["xsober.com",16],["xvip.lat",16],["xxgasm.com",16],["xxvideoss.org",16],["xxx18.uno",16],["xxxdominicana.com",16],["xxxfree.watch",16],["xxxmax.net",16],["xxxwebdlxxx.top",16],["xxxxvideo.uno",16],["y2b.wiki",16],["yabai.si",16],["yadixv.com",16],["yayanimes.net",16],["yeshd.net",16],["yodbox.com",16],["youdbox.*",16],["youjax.com",16],["yourdailypornvideos.ws",16],["yourupload.com",16],["ytmp3eu.*",16],["yts-subs.*",16],["yts.*",16],["ytstv.me",16],["zerion.cc",16],["zerocoin.top",16],["zitss.xyz",16],["zooqle.*",16],["zpaste.net",16],["1337x.ninjaproxy1.com",16],["y2tube.pro",16],["freeshot.live",16],["fastreams.com",16],["redittsports.com",16],["sky-sports.store",16],["streamsoccer.site",16],["tntsports.store",16],["wowstreams.co",16],["zdsptv.com",16],["tuktukcinma.com",16],["dutchycorp.*",17],["faucet.ovh",17],["mmacore.tv",18],["nxbrew.net",18],["oko.sh",[19,45,46]],["variety.com",20],["gameskinny.com",20],["deadline.com",20],["mlive.com",[20,144,148]],["atlasstudiousa.com",21],["51bonusrummy.in",[21,58]],["washingtonpost.com",22],["gosexpod.com",23],["sexo5k.com",24],["truyen-hentai.com",24],["theshedend.com",26],["zeroupload.com",26],["securenetsystems.net",26],["miniwebtool.com",26],["bchtechnologies.com",26],["eracast.cc",26],["flatai.org",26],["spiegel.de",27],["jacquieetmichel.net",28],["hausbau-forum.de",29],["althub.club",29],["kiemlua.com",29],["tea-coffee.net",30],["spatsify.com",30],["newedutopics.com",30],["getviralreach.in",30],["edukaroo.com",30],["funkeypagali.com",30],["careersides.com",30],["nayisahara.com",30],["wikifilmia.com",30],["infinityskull.com",30],["viewmyknowledge.com",30],["iisfvirtual.in",30],["starxinvestor.com",30],["jkssbalerts.com",30],["imagereviser.com",31],["kenzo-flowertag.com",32],["mdn.lol",32],["btcbitco.in",33],["btcsatoshi.net",33],["cempakajaya.com",33],["crypto4yu.com",33],["gainl.ink",33],["manofadan.com",33],["readbitcoin.org",33],["wiour.com",33],["tremamnon.com",33],["bitsmagic.fun",33],["ourcoincash.xyz",33],["blog.cryptowidgets.net",34],["blog.insurancegold.in",34],["blog.wiki-topia.com",34],["blog.coinsvalue.net",34],["blog.cookinguide.net",34],["blog.freeoseocheck.com",34],["aylink.co",35],["sugarona.com",36],["nishankhatri.xyz",36],["cety.app",37],["exe-urls.com",37],["exego.app",37],["cutlink.net",37],["cutsy.net",37],["cutyurls.com",37],["cutty.app",37],["cutnet.net",37],["jixo.online",37],["tinys.click",38],["diendancauduong.com",38],["formyanime.com",38],["gsm-solution.com",38],["h-donghua.com",38],["hindisubbedacademy.com",38],["mydverse.*",38],["ripexbooster.xyz",38],["serial4.com",38],["tutorgaming.com",38],["everydaytechvams.com",38],["dipsnp.com",38],["cccam4sat.com",38],["zeemoontv-24.blogspot.com",38],["stitichsports.com",38],["aiimgvlog.fun",39],["appsbull.com",40],["diudemy.com",40],["maqal360.com",40],["mphealth.online",40],["makefreecallsonline.com",40],["androjungle.com",40],["bookszone.in",40],["drakescans.com",40],["shortix.co",40],["msonglyrics.com",40],["app-sorteos.com",40],["bokugents.com",40],["client.pylexnodes.net",40],["btvplus.bg",40],["blog24.me",[41,42]],["coingraph.us",43],["impact24.us",43],["iconicblogger.com",44],["auto-crypto.click",44],["tvi.la",[45,46]],["iir.la",[45,46]],["tii.la",[45,46]],["ckk.ai",[45,46]],["oei.la",[45,46]],["lnbz.la",[45,46]],["oii.la",[45,46,66]],["tpi.li",[45,46]],["shrinke.*",47],["shrinkme.*",47],["smutty.com",47],["e-sushi.fr",47],["freeadultcomix.com",47],["down.dataaps.com",47],["filmweb.pl",47],["livecamrips.*",47],["safetxt.net",47],["filespayouts.com",47],["atglinks.com",48],["kbconlinegame.com",49],["hamrojaagir.com",49],["odijob.com",49],["blogesque.net",50],["bookbucketlyst.com",50],["explorosity.net",50],["optimizepics.com",50],["stfly.*",50],["stly.*",50],["torovalley.net",50],["travize.net",50],["trekcheck.net",50],["metoza.net",50],["techlike.net",50],["snaplessons.net",50],["atravan.net",50],["transoa.net",50],["techmize.net",50],["crenue.net",50],["simana.online",51],["fooak.com",51],["joktop.com",51],["evernia.site",51],["falpus.com",51],["rfiql.com",52],["gujjukhabar.in",52],["smartfeecalculator.com",52],["djxmaza.in",52],["thecubexguide.com",52],["jytechs.in",52],["mastkhabre.com",53],["weshare.is",54],["advertisertape.com",55],["tapeadsenjoyer.com",[55,64]],["tapeadvertisement.com",55],["tapelovesads.org",55],["watchadsontape.com",55],["vosfemmes.com",56],["voyeurfrance.net",56],["bollyflix.*",57],["neymartv.net",57],["streamhd247.info",57],["samax63.lol",57],["hindimoviestv.com",57],["buzter.xyz",57],["valhallas.click",57],["cuervotv.me",[57,64]],["aliezstream.pro",57],["daddy-stream.xyz",57],["daddylive1.*",57],["esportivos.*",57],["instream.pro",57],["mylivestream.pro",57],["poscitechs.*",57],["powerover.online",57],["sportea.link",57],["sportsurge.stream",57],["ufckhabib.com",57],["ustream.pro",57],["animeshqip.site",57],["apkship.shop",57],["buzter.pro",57],["enjoysports.bond",57],["filedot.to",57],["foreverquote.xyz",57],["hdstream.one",57],["kingstreamz.site",57],["live.fastsports.store",57],["livesnow.me",57],["livesports4u.pw",57],["masterpro.click",57],["nuxhallas.click",57],["papahd.info",57],["rgshows.me",57],["sportmargin.live",57],["sportmargin.online",57],["sportsloverz.xyz",57],["sportzlive.shop",57],["supertipzz.online",57],["totalfhdsport.xyz",57],["ultrastreamlinks.xyz",57],["usgate.xyz",57],["webmaal.cfd",57],["wizistreamz.xyz",57],["worldstreamz.shop",57],["g-porno.com",57],["g-streaming.com",57],["educ4m.com",57],["fromwatch.com",57],["visualnewshub.com",57],["bigwarp.*",57],["animeshqip.org",57],["uns.bio",57],["reshare.pm",57],["videograbber.cc",57],["rahim-soft.com",58],["nekopoi.*",58],["x-video.tube",58],["rubystm.com",58],["rubyvid.com",58],["streamruby.com",58],["poophd.cc",58],["windowsreport.com",58],["fuckflix.click",58],["hyundaitucson.info",59],["exambd.net",60],["cgtips.org",61],["freewebcart.com",62],["freemagazines.top",62],["siamblockchain.com",62],["emuenzen.de",63],["123movies.*",64],["123moviesla.*",64],["123movieweb.*",64],["2embed.*",64],["9xmovies.*",64],["adsh.cc",64],["adshort.*",64],["afilmyhouse.blogspot.com",64],["ak.sv",64],["allmovieshub.*",64],["animesultra.com",64],["api.webs.moe",64],["apkmody.io",64],["asianplay.*",64],["atishmkv.*",64],["attvideo.com",64],["backfirstwo.site",64],["bflix.*",64],["crazyblog.in",64],["cricstream.*",64],["crictime.*",64],["divicast.com",64],["dlhd.so",64],["dood.*",[64,186]],["dooood.*",[64,186]],["embed.meomeo.pw",64],["extramovies.*",64],["faselhd.*",64],["faselhds.*",64],["filemoon.*",64],["filmeserialeonline.org",64],["filmy.*",64],["filmyhit.*",64],["filmywap.*",64],["flexyhit.com",64],["fmovies.*",64],["foreverwallpapers.com",64],["french-streams.cc",64],["fslinks.org",64],["gdplayer.*",64],["goku.*",64],["gomovies.*",64],["gowatchseries.*",64],["hdfungamezz.*",64],["hdtoday.to",64],["hinatasoul.com",64],["hindilinks4u.*",64],["hurawatch.*",64],["igg-games.com",64],["infinityscans.net",64],["jalshamoviezhd.*",64],["livecricket.*",64],["mangareader.to",64],["membed.net",64],["mgnetu.com",64],["mhdsport.*",64],["mkvcinemas.*",[64,184]],["movies2watch.*",64],["moviespapa.*",64],["mp3juice.info",64],["mp3juices.cc",64],["mp4moviez.*",64],["mydownloadtube.*",64],["myflixerz.to",64],["nowmetv.net",64],["nowsportstv.com",64],["nuroflix.*",64],["nxbrew.com",64],["o2tvseries.*",64],["o2tvseriesz.*",64],["oii.io",64],["paidshitforfree.com",64],["pepperlive.info",64],["pirlotv.*",64],["playertv.net",64],["poscitech.*",64],["primewire.*",64],["putlocker68.com",64],["redecanais.*",64],["roystream.com",64],["rssing.com",64],["s.to",64],["serienstream.*",64],["sflix.*",64],["shahed4u.*",64],["shaheed4u.*",64],["share.filesh.site",64],["sharkfish.xyz",64],["skidrowcodex.net",64],["smartermuver.com",64],["speedostream.*",64],["sportcast.*",64],["sports-stream.site",64],["sportskart.*",64],["stream4free.live",64],["streamingcommunity.*",[64,66,80]],["tamilarasan.*",64],["tamilfreemp3songs.*",64],["tamilmobilemovies.in",64],["tamilprinthd.*",64],["thewatchseries.live",64],["tnmusic.in",64],["torrentdosfilmes.*",64],["travelplanspro.com",64],["tubemate.*",64],["tusfiles.com",64],["tutlehd4.com",64],["twstalker.com",64],["uploadrar.*",64],["uqload.*",64],["vid-guard.com",64],["vidcloud9.*",64],["vido.*",64],["vidoo.*",64],["vidsaver.net",64],["vidspeeds.com",64],["viralitytoday.com",64],["voiranime.stream",64],["vudeo.*",64],["vumoo.*",64],["watchdoctorwhoonline.com",64],["watchomovies.*",[64,77]],["watchserie.online",64],["webhostingpost.com",64],["woxikon.in",64],["www-y2mate.com",64],["yesmovies.*",64],["ylink.bid",64],["xn-----0b4asja7ccgu2b4b0gd0edbjm2jpa1b1e9zva7a0347s4da2797e8qri.xn--1ck2e1b",64],["kickassanime.*",65],["11xmovies.*",66],["buffshub.stream",66],["cinego.tv",66],["ev01.to",66],["fstream365.com",66],["fzmovies.*",66],["linkz.*",66],["minoplres.xyz",66],["mostream.us",66],["myflixer.*",66],["prmovies.*",66],["readcomiconline.li",66],["s3embtaku.pro",66],["sflix2.to",66],["sportshub.stream",66],["streamblasters.*",66],["topcinema.cam",66],["zonatmo.com",66],["animesaturn.cx",66],["filecrypt.*",66],["hunterscomics.com",66],["aniwave.uk",66],["kickass.*",67],["unblocked.id",69],["listendata.com",70],["7xm.xyz",70],["fastupload.io",70],["azmath.info",70],["wouterplanet.com",71],["androidacy.com",72],["pillowcase.su",73],["cine-calidad.*",74],["veryfreeporn.com",74],["theporngod.com",74],["besthdgayporn.com",75],["drivenime.com",75],["erothots1.com",75],["javup.org",75],["shemaleup.net",75],["transflix.net",75],["4porn4.com",76],["bestpornflix.com",77],["freeroms.com",77],["andhrafriends.com",77],["723qrh1p.fun",77],["98zero.com",78],["mediaset.es",78],["updatewallah.in",78],["hwbusters.com",78],["beatsnoop.com",79],["fetchpik.com",79],["hackerranksolution.in",79],["camsrip.com",79],["help.sakarnewz.com",79],["austiblox.net",81],["btcbunch.com",82],["teachoo.com",[83,84]],["automobile-catalog.com",[85,86,91]],["motorbikecatalog.com",[85,86,91]],["topstarnews.net",85],["islamicfinder.org",85],["secure-signup.net",85],["dramabeans.com",85],["manta.com",85],["tportal.hr",85],["tvtropes.org",85],["wouldurather.io",85],["convertcase.net",85],["interfootball.co.kr",86],["a-ha.io",86],["cboard.net",86],["jjang0u.com",86],["joongdo.co.kr",86],["viva100.com",86],["gamingdeputy.com",86],["thesaurus.net",86],["alle-tests.nl",86],["maketecheasier.com",86],["allthekingz.com",86],["tweaksforgeeks.com",86],["m.inven.co.kr",86],["mlbpark.donga.com",86],["meconomynews.com",86],["brandbrief.co.kr",86],["motorgraph.com",86],["worldhistory.org",87],["bleepingcomputer.com",88],["lovelive-petitsoku.com",88],["pravda.com.ua",88],["mariowiki.com",89],["ap7am.com",90],["cinema.com.my",90],["dolldivine.com",90],["giornalone.it",90],["iplocation.net",90],["jamaicaobserver.com",90],["jawapos.com",90],["jutarnji.hr",90],["kompasiana.com",90],["mediaindonesia.com",90],["nmplus.hk",90],["slobodnadalmacija.hr",90],["upmedia.mg",90],["allthetests.com",91],["animanch.com",91],["aniroleplay.com",91],["apkmirror.com",[91,180]],["autoby.jp",91],["autofrage.net",91],["carscoops.com",91],["cinetrafic.fr",91],["computerfrage.net",91],["crosswordsolver.com",91],["cruciverba.it",91],["daily.co.jp",91],["dailydot.com",91],["dnevno.hr",91],["dziennik.pl",91],["forsal.pl",91],["freemcserver.net",91],["game8.jp",91],["gazetaprawna.pl",91],["globalrph.com",91],["golf-live.at",91],["heureka.cz",91],["horairesdouverture24.fr",91],["indiatimes.com",91],["infor.pl",91],["iza.ne.jp",91],["j-cast.com",91],["j-town.net",91],["jablickar.cz",91],["javatpoint.com",91],["kinmaweb.jp",91],["kreuzwortraetsel.de",91],["kurashiru.com",91],["kyoteibiyori.com",91],["lacuarta.com",91],["laleggepertutti.it",91],["livenewschat.eu",91],["malaymail.com",91],["mamastar.jp",91],["mirrored.to",91],["modhub.us",91],["motscroises.fr",91],["nana-press.com",91],["nikkan-gendai.com",91],["nyitvatartas24.hu",91],["oeffnungszeitenbuch.de",91],["onecall2ch.com",91],["oraridiapertura24.it",91],["palabr.as",91],["persoenlich.com",91],["petitfute.com",91],["powerpyx.com",91],["quefaire.be",91],["raetsel-hilfe.de",91],["ranking.net",91],["roleplayer.me",91],["rostercon.com",91],["samsungmagazine.eu",91],["slashdot.org",91],["sourceforge.net",91],["syosetu.com",91],["talkwithstranger.com",91],["the-crossword-solver.com",91],["thestockmarketwatch.com",91],["transparentcalifornia.com",91],["transparentnevada.com",91],["trilltrill.jp",91],["tvtv.ca",91],["tvtv.us",91],["verkaufsoffener-sonntag.com",91],["watchdocumentaries.com",91],["webdesignledger.com",91],["wetteronline.de",91],["wfmz.com",91],["winfuture.de",91],["word-grabber.com",91],["wort-suchen.de",91],["woxikon.*",91],["yugioh-starlight.com",91],["yutura.net",91],["zagreb.info",91],["2chblog.jp",91],["2monkeys.jp",91],["46matome.net",91],["akb48glabo.com",91],["akb48matomemory.com",91],["alfalfalfa.com",91],["all-nationz.com",91],["anihatsu.com",91],["aqua2ch.net",91],["blog.esuteru.com",91],["blog.livedoor.jp",91],["blog.jp",91],["blogo.jp",91],["chaos2ch.com",91],["choco0202.work",91],["crx7601.com",91],["danseisama.com",91],["dareda.net",91],["digital-thread.com",91],["doorblog.jp",91],["exawarosu.net",91],["fgochaldeas.com",91],["football-2ch.com",91],["gekiyaku.com",91],["golog.jp",91],["hacchaka.net",91],["heartlife-matome.com",91],["liblo.jp",91],["fesoku.net",91],["fiveslot777.com",91],["gamejksokuhou.com",91],["girlsreport.net",91],["girlsvip-matome.com",91],["grasoku.com",91],["gundamlog.com",91],["honyaku-channel.net",91],["ikarishintou.com",91],["imas-cg.net",91],["imihu.net",91],["inutomo11.com",91],["itainews.com",91],["itaishinja.com",91],["jin115.com",91],["jisaka.com",91],["jnews1.com",91],["jumpsokuhou.com",91],["jyoseisama.com",91],["keyakizaka46matomemory.net",91],["kidan-m.com",91],["kijoden.com",91],["kijolariat.net",91],["kijolifehack.com",91],["kijomatomelog.com",91],["kijyokatu.com",91],["kijyomatome.com",91],["kijyomatome-ch.com",91],["kijyomita.com",91],["kirarafan.com",91],["kitimama-matome.net",91],["kitizawa.com",91],["konoyubitomare.jp",91],["kotaro269.com",91],["kyousoku.net",91],["ldblog.jp",91],["livedoor.biz",91],["livedoor.blog",91],["majikichi.com",91],["matacoco.com",91],["matomeblade.com",91],["matomelotte.com",91],["matometemitatta.com",91],["mojomojo-licarca.com",91],["morikinoko.com",91],["nandemo-uketori.com",91],["netatama.net",91],["news-buzz1.com",91],["news30over.com",91],["nmb48-mtm.com",91],["norisoku.com",91],["npb-news.com",91],["ocsoku.com",91],["okusama-kijyo.com",91],["onihimechan.com",91],["orusoku.com",91],["otakomu.jp",91],["otoko-honne.com",91],["oumaga-times.com",91],["outdoormatome.com",91],["pachinkopachisro.com",91],["paranormal-ch.com",91],["recosoku.com",91],["s2-log.com",91],["saikyo-jump.com",91],["shuraba-matome.com",91],["ske48matome.net",91],["squallchannel.com",91],["sukattojapan.com",91],["sumaburayasan.com",91],["usi32.com",91],["uwakich.com",91],["uwakitaiken.com",91],["vault76.info",91],["vipnews.jp",91],["vtubernews.jp",91],["watarukiti.com",91],["world-fusigi.net",91],["zakuzaku911.com",91],["zch-vip.com",91],["mafiatown.pl",92],["bitcotasks.com",93],["hilites.today",94],["udvl.com",95],["www.chip.de",[96,97,98,99]],["topsporter.net",100],["sportshub.to",100],["streamcheck.link",101],["myanimelist.net",102],["unofficialtwrp.com",103],["codec.kyiv.ua",103],["kimcilonlyofc.com",103],["bitcosite.com",104],["bitzite.com",104],["celebzcircle.com",105],["bi-girl.net",105],["ftuapps.*",105],["hentaiseason.com",105],["hoodtrendspredict.com",105],["marcialhub.xyz",105],["odiadance.com",105],["osteusfilmestuga.online",105],["ragnarokscanlation.opchapters.com",105],["sampledrive.org",105],["showflix.*",105],["swordalada.org",105],["tojimangas.com",105],["tvappapk.com",105],["twobluescans.com",[105,106]],["varnascan.xyz",105],["teluguflix.*",107],["hacoos.com",108],["watchhentai.net",109],["hes-goals.io",109],["pkbiosfix.com",109],["casi3.xyz",109],["bondagevalley.cc",110],["zefoy.com",111],["mailgen.biz",112],["tempinbox.xyz",112],["vidello.net",113],["newscon.org",114],["yunjiema.top",114],["pcgeeks-games.com",114],["resizer.myct.jp",115],["gametohkenranbu.sakuraweb.com",116],["jisakuhibi.jp",117],["rank1-media.com",117],["lifematome.blog",118],["fm.sekkaku.net",119],["free-avx.jp",120],["dvdrev.com",121],["betweenjpandkr.blog",122],["nft-media.net",123],["ghacks.net",124],["leak.sx",125],["paste.bin.sx",125],["pornleaks.in",125],["truyentranhfull.net",126],["fcportables.com",126],["repack-games.com",126],["ibooks.to",126],["blog.tangwudi.com",126],["filecatchers.com",126],["actvid.*",127],["zoechip.com",127],["nohost.one",127],["vidbinge.com",127],["nectareousoverelate.com",129],["khoaiphim.com",130],["haafedk2.com",131],["fordownloader.com",131],["jovemnerd.com.br",132],["totalcsgo.com",133],["vivamax.asia",134],["manysex.com",135],["gaminginfos.com",136],["tinxahoivn.com",137],["automoto.it",138],["codelivly.com",139],["tchatche.com",140],["cryptoearns.com",140],["lordchannel.com",141],["client.falixnodes.net",142],["novelhall.com",143],["madeeveryday.com",144],["maidenhead-advertiser.co.uk",144],["mardomreport.net",144],["melangery.com",144],["milestomemories.com",144],["modernmom.com",144],["momtastic.com",144],["mostlymorgan.com",144],["motherwellmag.com",144],["muddybootsanddiamonds.com",144],["musicfeeds.com.au",144],["mylifefromhome.com",144],["nationalreview.com",144],["nordot.app",144],["oakvillenews.org",144],["observer.com",144],["ourlittlesliceofheaven.com",144],["palachinkablog.com",144],["patheos.com",144],["pinkonthecheek.com",144],["politicususa.com",144],["predic.ro",144],["puckermom.com",144],["qtoptens.com",144],["realgm.com",144],["reelmama.com",144],["robbreport.com",144],["royalmailchat.co.uk",144],["samchui.com",144],["sandrarose.com",144],["sherdog.com",144],["sidereel.com",144],["silive.com",144],["simpleflying.com",144],["sloughexpress.co.uk",144],["spacenews.com",144],["sportsgamblingpodcast.com",144],["spotofteadesigns.com",144],["stacysrandomthoughts.com",144],["ssnewstelegram.com",144],["superherohype.com",[144,148]],["tablelifeblog.com",144],["thebeautysection.com",144],["thecelticblog.com",144],["thecurvyfashionista.com",144],["thefashionspot.com",144],["thegamescabin.com",144],["thenerdyme.com",144],["thenonconsumeradvocate.com",144],["theprudentgarden.com",144],["thethings.com",144],["timesnews.net",144],["topspeed.com",144],["toyotaklub.org.pl",144],["travelingformiles.com",144],["tutsnode.org",144],["viralviralvideos.com",144],["wannacomewith.com",144],["wimp.com",[144,148]],["windsorexpress.co.uk",144],["woojr.com",144],["worldoftravelswithkids.com",144],["worldsurfleague.com",144],["abc17news.com",[144,147]],["adoredbyalex.com",144],["agrodigital.com",[144,147]],["al.com",[144,147]],["aliontherunblog.com",[144,147]],["allaboutthetea.com",[144,147]],["allmovie.com",[144,147]],["allmusic.com",[144,147]],["allthingsthrifty.com",[144,147]],["amessagewithabottle.com",[144,147]],["androidpolice.com",144],["antyradio.pl",144],["artforum.com",[144,147]],["artnews.com",[144,147]],["awkward.com",[144,147]],["awkwardmom.com",[144,147]],["bailiwickexpress.com",144],["barnsleychronicle.com",[144,148]],["becomingpeculiar.com",144],["bethcakes.com",[144,148]],["blogher.com",[144,148]],["bluegraygal.com",[144,148]],["briefeguru.de",[144,148]],["carmagazine.co.uk",144],["cattime.com",144],["cbr.com",144],["chaptercheats.com",[144,148]],["cleveland.com",[144,148]],["collider.com",144],["comingsoon.net",144],["commercialobserver.com",[144,148]],["competentedigitale.ro",[144,148]],["crafty.house",144],["dailyvoice.com",[144,148]],["decider.com",[144,148]],["didyouknowfacts.com",[144,148]],["dogtime.com",[144,148]],["dualshockers.com",144],["dustyoldthing.com",144],["faithhub.net",144],["femestella.com",[144,148]],["footwearnews.com",[144,148]],["freeconvert.com",[144,148]],["frogsandsnailsandpuppydogtail.com",[144,148]],["fsm-media.com",144],["funtasticlife.com",[144,148]],["fwmadebycarli.com",[144,148]],["gamerant.com",144],["gfinityesports.com",144],["givemesport.com",144],["gulflive.com",[144,148]],["helloflo.com",144],["homeglowdesign.com",[144,148]],["honeygirlsworld.com",[144,148]],["hotcars.com",144],["howtogeek.com",144],["insider-gaming.com",144],["insurancejournal.com",144],["jasminemaria.com",[144,148]],["kion546.com",[144,148]],["lehighvalleylive.com",[144,148]],["lettyskitchen.com",[144,148]],["lifeinleggings.com",[144,148]],["liveandletsfly.com",144],["lizzieinlace.com",[144,148]],["localnews8.com",[144,148]],["lonestarlive.com",[144,148]],["makeuseof.com",144],["masslive.com",[144,148,254]],["movieweb.com",144],["nj.com",[144,148]],["nothingbutnewcastle.com",[144,148]],["nsjonline.com",[144,148]],["oregonlive.com",[144,148]],["pagesix.com",[144,148,254]],["pennlive.com",[144,148,254]],["screenrant.com",144],["sheknows.com",[144,148]],["syracuse.com",[144,148,254]],["thegamer.com",144],["tvline.com",[144,148]],["cheatsheet.com",145],["pwinsider.com",145],["baeldung.com",145],["mensjournal.com",145],["c-span.org",146],["15min.lt",147],["247sports.com",[147,254]],["barcablaugranes.com",148],["betweenenglandandiowa.com",148],["bgr.com",148],["blazersedge.com",148],["blu-ray.com",148],["brobible.com",148],["cagesideseats.com",148],["cbsnews.com",[148,254]],["cbssports.com",[148,254]],["celiacandthebeast.com",148],["clickondetroit.com",148],["dailykos.com",148],["eater.com",148],["eldiariony.com",148],["fark.com",148],["free-power-point-templates.com",148],["golfdigest.com",148],["ibtimes.co.in",148],["imgur.com",148],["indiewire.com",[148,254]],["intouchweekly.com",148],["knowyourmeme.com",148],["last.fm",148],["lifeandstylemag.com",148],["mandatory.com",148],["naszemiasto.pl",148],["nationalpost.com",148],["nbcsports.com",148],["news.com.au",148],["ninersnation.com",148],["nypost.com",[148,254]],["playstationlifestyle.net",148],["rollingstone.com",148],["sbnation.com",148],["sneakernews.com",148],["sport-fm.gr",148],["stylecaster.com",148],["tastingtable.com",148],["thecw.com",148],["thedailymeal.com",148],["theflowspace.com",148],["themarysue.com",148],["tokfm.pl",148],["torontosun.com",148],["usmagazine.com",148],["wallup.net",148],["worldstar.com",148],["worldstarhiphop.com",148],["yourcountdown.to",148],["bagi.co.in",149],["keran.co",149],["biblestudytools.com",150],["christianheadlines.com",150],["ibelieve.com",150],["kuponigo.com",151],["inxxx.com",152],["bemyhole.com",152],["ipaspot.app",153],["embedwish.com",154],["filelions.live",154],["leakslove.net",154],["jenismac.com",155],["vxetable.cn",156],["nizarstream.com",157],["snapwordz.com",158],["toolxox.com",158],["rl6mans.com",158],["donghuaworld.com",159],["letsdopuzzles.com",160],["rediff.com",161],["igay69.com",162],["kimcilonly.link",163],["dzapk.com",164],["darknessporn.com",165],["familyporner.com",165],["freepublicporn.com",165],["pisshamster.com",165],["punishworld.com",165],["xanimu.com",165],["pig69.com",166],["cosplay18.pics",166],["sexwebvideo.com",166],["sexwebvideo.net",166],["tainio-mania.online",167],["eroticmoviesonline.me",168],["teleclub.xyz",169],["ecamrips.com",170],["showcamrips.com",170],["tucinehd.com",171],["9animetv.to",172],["qiwi.gg",173],["jornadaperfecta.com",174],["loseart.com",175],["sousou-no-frieren.com",176],["unite-guide.com",177],["thebullspen.com",178],["receitasdaora.online",179],["streambucket.net",181],["nontongo.win",181],["player.smashy.stream",182],["player.smashystream.com",182],["hentaihere.com",182],["torrentdownload.*",184],["cineb.rs",184],["123animehub.cc",184],["tukipasti.com",184],["cataz.to",184],["netmovies.to",184],["hiraethtranslation.com",185],["d0000d.com",186],["d000d.com",186],["d0o0d.com",186],["do0od.com",186],["doods.pro",186],["doodstream.*",186],["dooodster.com",186],["ds2play.com",186],["ds2video.com",186],["vidply.com",186],["xfreehd.com",187],["freethesaurus.com",188],["thefreedictionary.com",188],["dexterclearance.com",189],["x86.co.kr",190],["onlyfaucet.com",191],["x-x-x.tube",192],["fdownloader.net",193],["thehackernews.com",194],["mielec.pl",195],["treasl.com",196],["mrbenne.com",197],["cnpics.org",198],["ovabee.com",198],["porn4f.com",198],["cnxx.me",198],["ai18.pics",198],["sportsonline.si",199],["fiuxy2.co",200],["animeunity.to",201],["tokopedia.com",202],["remixsearch.net",203],["remixsearch.es",203],["onlineweb.tools",203],["sharing.wtf",203],["2024tv.ru",204],["modrinth.com",205],["curseforge.com",205],["xnxxcom.xyz",206],["sportsurge.net",207],["joyousplay.xyz",207],["quest4play.xyz",[207,209]],["generalpill.net",207],["moneycontrol.com",208],["cookiewebplay.xyz",209],["ilovetoplay.xyz",209],["streamcaster.live",209],["weblivehdplay.ru",209],["oaaxpgp3.xyz",210],["m9.news",211],["callofwar.com",212],["secondhandsongs.com",213],["nudezzers.org",214],["send.cm",215],["send.now",215],["3rooodnews.net",216],["xxxbfvideo.net",217],["filmy4wap.co.in",218],["filmy4waps.org",218],["gameshop4u.com",219],["regenzi.site",219],["historicaerials.com",220],["handirect.fr",221],["animefenix.tv",222],["fsiblog3.club",223],["kamababa.desi",223],["getfiles.co.uk",224],["genelify.com",225],["dhtpre.com",226],["xbaaz.com",227],["lineupexperts.com",229],["fearmp4.ru",230],["fbstreams.*",231],["m.shuhaige.net",232],["streamingnow.mov",233],["thesciencetoday.com",234],["ghbrisk.com",236],["iplayerhls.com",236],["bacasitus.com",237],["katoikos.world",237],["abstream.to",238],["pawastreams.pro",239],["rebajagratis.com",240],["tv.latinlucha.es",240],["fetcheveryone.com",241],["reviewdiv.com",242],["tojimanhwas.com",243],["laurelberninteriors.com",244],["godlike.com",245],["godlikeproductions.com",245],["botcomics.com",246],["cefirates.com",246],["chandlerorchards.com",246],["comicleaks.com",246],["marketdata.app",246],["monumentmetals.com",246],["tapmyback.com",246],["ping.gg",246],["revistaferramental.com.br",246],["hawpar.com",246],["alpacafinance.org",[246,247]],["nookgaming.com",246],["enkeleksamen.no",246],["kvest.ee",246],["creatordrop.com",246],["panpots.com",246],["cybernetman.com",246],["bitdomain.biz",246],["gerardbosch.xyz",246],["fort-shop.kiev.ua",246],["accuretawealth.com",246],["resourceya.com",246],["tracktheta.com",246],["camberlion.com",246],["replai.io",246],["trybawaryjny.pl",246],["segops.madisonspecs.com",246],["stresshelden-coaching.de",246],["controlconceptsusa.com",246],["ryaktive.com",246],["tip.etip-staging.etip.io",246],["tt.live",247],["future-fortune.com",247],["adventuretix.com",247],["bolighub.dk",247],["panprices.com",248],["intercity.technology",248],["freelancer.taxmachine.be",248],["adria.gg",248],["fjlaboratories.com",248],["emanualonline.com",248],["abhijith.page",248],["helpmonks.com",248],["dataunlocker.com",249],["proboards.com",250],["winclassic.net",250],["farmersjournal.ie",251],["pandadoc.com",253],["abema.tv",255]]);
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
    try { removeNodeText(...argsList[i]); }
    catch { }
}

/******************************************************************************/

// End of local scope
})();

void 0;
