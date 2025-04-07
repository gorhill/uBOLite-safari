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
(function uBOL_removeClass() {

/******************************************************************************/

function removeClass(
    rawToken = '',
    rawSelector = '',
    behavior = ''
) {
    if ( typeof rawToken !== 'string' ) { return; }
    if ( rawToken === '' ) { return; }
    const safe = safeSelf();
    const logPrefix = safe.makeLogPrefix('remove-class', rawToken, rawSelector, behavior);
    const tokens = safe.String_split.call(rawToken, /\s*\|\s*/);
    const selector = tokens
        .map(a => `${rawSelector}.${CSS.escape(a)}`)
        .join(',');
    if ( safe.logLevel > 1 ) {
        safe.uboLog(logPrefix, `Target selector:\n\t${selector}`);
    }
    const mustStay = /\bstay\b/.test(behavior);
    let timer;
    const rmclass = ( ) => {
        timer = undefined;
        try {
            const nodes = document.querySelectorAll(selector);
            for ( const node of nodes ) {
                node.classList.remove(...tokens);
                safe.uboLog(logPrefix, 'Removed class(es)');
            }
        } catch {
        }
        if ( mustStay ) { return; }
        if ( document.readyState !== 'complete' ) { return; }
        observer.disconnect();
    };
    const mutationHandler = mutations => {
        if ( timer !== undefined ) { return; }
        let skip = true;
        for ( let i = 0; i < mutations.length && skip; i++ ) {
            const { type, addedNodes, removedNodes } = mutations[i];
            if ( type === 'attributes' ) { skip = false; }
            for ( let j = 0; j < addedNodes.length && skip; j++ ) {
                if ( addedNodes[j].nodeType === 1 ) { skip = false; break; }
            }
            for ( let j = 0; j < removedNodes.length && skip; j++ ) {
                if ( removedNodes[j].nodeType === 1 ) { skip = false; break; }
            }
        }
        if ( skip ) { return; }
        timer = safe.onIdle(rmclass, { timeout: 67 });
    };
    const observer = new MutationObserver(mutationHandler);
    const start = ( ) => {
        rmclass();
        observer.observe(document, {
            attributes: true,
            attributeFilter: [ 'class' ],
            childList: true,
            subtree: true,
        });
    };
    runAt(( ) => {
        start();
    }, /\bcomplete\b/.test(behavior) ? 'idle' : 'loading');
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
const argsList = [["cookie","","stay"],["cookieconsent-active","body","stay"],["cookieMsg","","stay"],["cookie_consent__alert","","stay"],["gdpr-cookie-notice-center-loaded","","stay"],["has-open-cookie","","stay"],["om_cookie_active","","stay"],["tvp-cookie-scroll-lock","","stay"],["cookie-overlay","","stay"],["disable","div","stay"],["prevent-scroll","","stay"],["fog","","stay"],["cookie-hint","","stay"],["dp--cookie-consent","body","stay"],["no-scroll","body","stay"],["show-cookie-consent","","stay"],["is-active-cookiebar","","stay"],["has-banner","body.has-banner","stay"],["cookie-accept-required","","stay"],["cookie-open","","stay"],["cookiePopupVisible","","stay"],["unreadable-display","","stay"],["mandatory_cookie_modal","","stay"],["wwzoverlay--open","","stay"],["gdpr-infobar-visible","","stay"],["cookie-enabled","","stay"],["cookie-overlay--open","","stay"],["cookie-banner-open","","stay"],["cookie-banner-active","body","stay"],["overlay-content","body","stay"],["is-active-cookiebar","body","stay"],["didomi-popup-open","body"],["idxrcookies-block-user-nav","body","stay"],["ccpa-banner","","stay"],["with-featherlight","","stay"],["wcc-popup-overflow","body","stay"],["show--consent","body","stay"],["hasCookieBanner","body","stay"]];
const hostnamesMap = new Map([["abcya.com",0],["umicore.be",1],["umicore.fi",1],["umicore.ca",1],["jongcdenv.be",1],["umicore.jp",1],["umicore.cn",1],["umicore.pl",1],["umicore.kr",1],["umicore.co.th",1],["umicore.fr",1],["umicore.de",1],["donneurdecellulessouches.be",1],["stammzellenspender.be",1],["stemcelldonor.be",1],["umicore.com",1],["umicore.com.br",1],["koenvandenheuvel.be",1],["stamceldonor.be",1],["nahima.be",1],["catused.com",2],["eujuicers.cz",3],["graziellawicki.com",4],["funnelcockpit.com",4],["dnk.nl",5],["eam.de",6],["eam-netz.de",6],["tvp.pl",7],["cellardoor.co",8],["ampire.de",9],["verpackungsstadl.ch",9],["imkershoperzgebirge.de",9],["modellbahndealer.de",9],["tillit-bikes.shop",9],["bike-onlineshop.de",9],["futspo.de",9],["compravo.de",9],["perpedale.de",9],["modellbau-jung.de",9],["verpackungsstadl.at",9],["modellbau-vordermaier.de",9],["bike-supply.de",9],["wroc.pl",10],["basenio.de",11],["fm-systeme.de",12],["gartenhotel-crystal.at",13],["swffm.de",13],["studentenwerkfrankfurt.de",13],["dmsg.de",13],["bgk.pl",13],["pflegezeit-berlin.de",13],["gpd-nordost-onlineberatung.de",13],["proabschluss-beratung.de",13],["hilfe-telefon-missbrauch.online",13],["dww-suchtberatung.de",13],["cyberforum.de",13],["gutscheine.eurothermen.at",13],["wolff-mueller.de",13],["ras.bz.it",13],["technoalpin.com",13],["5asec.pt",14],["tui.dk",14],["tui.fi",14],["tui.no",14],["tui.se",14],["pollfish.com",15],["werkenbijtrekpleister.nl",16],["werkenbijkruidvat.be",16],["rassenlijst.info",16],["werkenbijiciparisxl.nl",16],["flightradar24.com",17],["vietnamairlines.com",18],["incotec.com",19],["croda.com",19],["exaktafoto.se",20],["campingdusoleil.com",21],["hotel-la-chaumiere.com",21],["les-anges-gardiens.fr",21],["croco-kid.com",21],["cambridge-centre.fr",21],["equisud.com",21],["allokebab-pau.fr",21],["etre-visible.local.fr",21],["mas-montebello66.com",21],["camping-residentiel-les-marronniers-jura.fr",21],["dj4events.fr",21],["saintjoursexpertmaritime.com",21],["az-renovation.fr",21],["presquilemultiservices.com",21],["hotel-aigoual.com",21],["hotel-restaurant-pau.com",21],["desrayaud-paysagistes.com",21],["hotelsaintcharles.fr",21],["agvillagecamarguais.com",21],["joyella.com",21],["gabriel-godard.com",21],["artech-sellerie.com",21],["motoclubernee.com",21],["ledauphinhotel.com",21],["cuisin-studio.com",21],["biomeo-environnement.com",21],["leman-instruments.com",21],["esthetique-meyerbeer.com",21],["institut-bio-naturel-nice.fr",21],["nature-et-bois.fr",21],["transmissions-bordeaux.com",21],["kinechartreuse.com",21],["corsegourmande.com",21],["cotedecor.com",21],["restaurant-la-badiane.fr",21],["systelia.fr",21],["lesjardinsinterieurs.com",21],["helenevue.com",21],["saubusse-thermes.com",21],["dehn.es",22],["dehn.fr",22],["dehn.it",22],["dehn.hu",22],["desitek.dk",22],["dehn.at",22],["dehn.de",22],["wwz.ch",23],["inyova.at",24],["inyova.ch",24],["inyova.de",24],["ccalbacenter.com",24],["wamu.org",24],["momentive.com",25],["kennedyslaw.com",26],["elekta.com",27],["ige.ch",28],["stratasysdirect.com",29],["stratasys.com",29],["werkenbijkruidvat.nl",30],["ghacks.net",31],["cutoff.es",32],["whyopencomputing.com",32],["mbanc.com",33],["scholpp.de",34],["scholpp.es",34],["scholpp.pl",34],["scholpp.it",34],["scholpp.com",34],["wetu.com",34],["alpen.co.uk",35],["alsina.com",35],["assosia.com",35],["bassicostruzioni.it",35],["bettenconcept.com",35],["blackpoolairport.com",35],["cateringvandenberg.nl",35],["ceratrends.com",35],["chestnut-tree-house.org.uk",35],["cirrusassessment.com",35],["clinicalondon.co.uk",35],["cmos.ie",35],["deniswilliams.ie",35],["efmdglobal.org",35],["emri.nl",35],["endlesspools.fr",35],["foleys.ie",35],["fryerndental.co.uk",35],["globalfocusmagazine.com",35],["guildhalldental.com",35],["hampshireimplantcentre.co.uk",35],["heikkala.com",35],["hermesit.net",35],["hotspring.be",35],["xn--inkomstfrskring-9kb71a.se",35],["innohome.com",35],["jakobwirt.at",35],["klinger.fi",35],["londonwomenscentre.co.uk",35],["memoreclame.nl",35],["mitarbeiter-app.de",35],["mobiltbredband.se",35],["newsbook.com.mt",35],["northeastspace.ie",35],["portea.fr",35],["precisiondentalstudio.co.uk",35],["ramotavla.se",35],["simkort.se",35],["stbarnabas-hospice.org.uk",35],["tundra.fi",35],["upitrek.com",35],["weetabix-arabia.com",35],["weetabix.co.uk",35],["weetabix.com",35],["weetabix.es",35],["weetabix.fr",35],["weetabix.it",35],["weetabix.nl",35],["weetabix.no",35],["weetabix.pt",35],["weetabixea.com",35],["weetabixfoodcompany.co.uk",35],["weetabixonthego.co.uk",35],["tvprato.it",36],["liftshare.com",36],["vesely-drak.cz",36],["consordini.com",36],["fitzmuseum.cam.ac.uk",36],["hotdk2023.kre.hu",36],["panwybierak.pl",36],["bomagasinet.dk",36],["miplantaweb.com",36],["electronics.semaf.at",36],["sfd.pl",36],["flota.es",36],["jobs.cz",36],["prace.cz",36],["eninternetgratis.com",36],["unavidadeviaje.com",36],["faq.whatsapp.com",37],["blog.whatsapp.com",37],["www.whatsapp.com",37]]);
const exceptionsMap = new Map([]);
const hasEntities = false;
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
    try { removeClass(...argsList[i]); }
    catch { }
}

/******************************************************************************/

// End of local scope
})();

void 0;
