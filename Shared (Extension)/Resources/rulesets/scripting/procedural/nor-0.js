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

/* jshint esversion:11 */

'use strict';

// ruleset: nor-0

/******************************************************************************/

// Important!
// Isolate from global scope
(function uBOL_cssProceduralImport() {

/******************************************************************************/

const argsList = [["{\"selector\":\".wpb_wrapper\",\"tasks\":[[\"has-text\",\"/^An{2}onse:.*$/\"]]}","{\"selector\":\"div[style^=\\\"font-size\\\"]\",\"tasks\":[[\"has-text\",\"/^An{2}onse:.*$/\"]]}"],["{\"selector\":\".lenkeboks\",\"tasks\":[[\"has-text\",\"/^.*Cas\\\\ino.*$/i\"]]}"],["{\"selector\":\".item\",\"tasks\":[[\"has\",{\"selector\":\".meta\",\"tasks\":[[\"has-text\",\"/^An{2}onse$/\"]]}]]}","{\"selector\":\".td-c-loop-item\",\"tasks\":[[\"has\",{\"selector\":\".meta-info\",\"tasks\":[[\"has-text\",\"Annonse\"]]}]]}","{\"selector\":\"article\",\"tasks\":[[\"has\",{\"selector\":\".title\",\"tasks\":[[\"has-text\",\" – annonse\"]]}]]}","{\"selector\":\"article\",\"tasks\":[[\"has\",{\"selector\":\".title\",\"tasks\":[[\"has-text\",\"/^.*[?:;—]\\\\san{2}ons[eø]r?$/\"]]}]]}"],["{\"selector\":\".widget_media_image\",\"tasks\":[[\"has-text\",\"/^AN{2}ONSE.*$/\"]]}"],["{\"selector\":\"article > div\",\"tasks\":[[\"has-text\",\"/^an{2}onse$/\"]]}","{\"selector\":\"div\",\"tasks\":[[\"matches-css\",{\"name\":\"min-height\",\"value\":\"^165px$\"}]]}","{\"selector\":\"div.clearfix.col-full-width\",\"tasks\":[[\"has-text\",\"kommersielle partner\"]]}","{\"selector\":\"main > div > div\",\"tasks\":[[\"has-text\",\"kommersielle partner\"]]}","{\"selector\":\"main > section > section\",\"tasks\":[[\"has-text\",\"/^an{2}onse$/\"]]}","{\"selector\":\"section\",\"tasks\":[[\"has\",{\"selector\":\"> div > div\",\"tasks\":[[\"has-text\",\"/^an{2}onse$/\"]]}]]}"],["{\"selector\":\"div.large-12.row\",\"tasks\":[[\"has-text\",\"MASCUS\"]]}"],["{\"selector\":\"article ~ div\",\"tasks\":[[\"has-text\",\"/^A[n|ĳ]n\\\\ons/i\"]]}"],["{\"selector\":\".et_section_regular\",\"tasks\":[[\"has-text\",\"/^.*cas\\\\ino.*$/i\"]]}"],["{\"selector\":\".preview\",\"tasks\":[[\"has\",{\"selector\":\".kicker\",\"tasks\":[[\"has-text\",\"/^.*an{2}onse.*$/i\"]]}]]}"],["{\"selector\":\"div\",\"tasks\":[[\"has\",{\"selector\":\"> span\",\"tasks\":[[\"has-text\",\"Annonse\"]]}]]}"],["{\"selector\":\".mvp-widget-home\",\"tasks\":[[\"has-text\",\"/^Velun{2}arar.*$/\"]]}"],["{\"selector\":\".entrance\",\"tasks\":[[\"has\",{\"selector\":\".entrance__mark__text\",\"tasks\":[[\"has-text\",\"Annonse:\"]]}]]}"],["{\"selector\":\"section.elementor-top-section\",\"tasks\":[[\"has-text\",\"/^.*\\\\s\\\\sAnnoncer?\\\\s\\\\s.*$/i\"],[\"spath\",\" + section.elementor-top-section:has(.elementor-image > [loading=\\\"lazy\\\"])\"]]}","{\"selector\":\"section.elementor-top-section\",\"tasks\":[[\"has-text\",\"/^.*\\\\s\\\\sAnnoncer?\\\\s\\\\s.*$/i\"],[\"spath\",\":has(+ section.elementor-top-section .elementor-image > [loading=\\\"lazy\\\"])\"]]}"],["{\"selector\":\".elementor-widget-text-editor\",\"tasks\":[[\"has-text\",\"/^.*\\\\s\\\\sANNONCER\\\\s\\\\s.*$/\"]]}"],["{\"selector\":\".fl-visible-desktop-medium\",\"tasks\":[[\"has\",{\"selector\":\"div[class^=\\\"ann-forside\\\"]\",\"tasks\":[[\"has-text\",\"/^.*An{2}onse:.*$/\"]]}]]}"],["{\"selector\":\".widget\",\"tasks\":[[\"has-text\",\"Play-Asia\"]]}","{\"selector\":\".widget\",\"tasks\":[[\"has-text\",\"Reklame\"]]}"],["{\"selector\":\".g-10\",\"tasks\":[[\"has-text\",\"Artikkelen fortsetter \"]]}"],["{\"selector\":\".list-group\",\"tasks\":[[\"has-text\",\"/^.*cas\\\\ino.*$/i\"]]}"],["{\"selector\":\".bottomSmallSpaced.topMediumSpaced\",\"tasks\":[[\"has-text\",\"/^An{2}onse.*$/\"]]}"],["{\"selector\":\"strong\",\"tasks\":[[\"has-text\",\"/^.*Cas\\\\ino.*$/i\"]]}"],["{\"selector\":\"a\",\"tasks\":[[\"has-text\",\"/^.*[kc]as\\\\ino.*$/i\"]]}"],["{\"selector\":\".latestnews-box\",\"tasks\":[[\"has-text\",\"/^.*cas\\\\ino.*$/i\"]]}"],["{\"selector\":\"div[class^=\\\"css\\\"]\",\"tasks\":[[\"matches-css-before\",{\"name\":\"content\",\"pseudo\":\"before\",\"value\":\"^\\\"Annonse\\\"$\"}]]}"],["{\"selector\":\".blog-post\",\"tasks\":[[\"has-text\",\"/^.*cas\\\\ino.*$/i\"]]}"],["{\"selector\":\".one-half\",\"tasks\":[[\"has-text\",\"/^.*[kc]as\\\\ino.*$/i\"]]}"],["{\"selector\":\".color-scheme-1\",\"tasks\":[[\"has-text\",\"/^.*Cas\\\\ino.*$/i\"],[\"spath\",\" + div\"]]}","{\"selector\":\".color-scheme-1\",\"tasks\":[[\"has-text\",\"/^.*Cas\\\\ino.*$/i\"]]}"],["{\"selector\":\"tr\",\"tasks\":[[\"has\",{\"selector\":\"td\",\"tasks\":[[\"has-text\",\"Annonse:\"]]}]]}"],["{\"selector\":\".panel-latest-forum-threads\",\"tasks\":[[\"has-text\",\" sponsor\"]]}"],["{\"selector\":\"a\",\"tasks\":[[\"has\",{\"selector\":\".e-con-inner:not(:has(> *))\"}]]}"],["{\"selector\":\".widget-goodpress-home-block-one\",\"tasks\":[[\"has-text\",\"Annonsørinnhold\"]]}"],["{\"selector\":\".textwidget\",\"tasks\":[[\"has-text\",\"Annonse\"]]}","{\"selector\":\".widget-title\",\"tasks\":[[\"has-text\",\"Annonser\"]]}"],["{\"selector\":\".elementor-widget-wrap > .elementor-section\",\"tasks\":[[\"has-text\",\"REKLAMER\"]]}"],["{\"selector\":\".td-pb-span4\",\"tasks\":[[\"has-text\",\"ANNONSØRINNHOLD\"]]}"],["{\"selector\":\"h2\",\"tasks\":[[\"has-text\",\"/^.*cas\\\\ino.*$/i\"]]}"],["{\"selector\":\".col-md-3 .block\",\"tasks\":[[\"has-text\",\"ponsor\"]]}"],["{\"selector\":\"p\",\"tasks\":[[\"has-text\",\"/^.*cas\\\\ino.*$/i\"]]}"],["{\"selector\":\"[data-cy=\\\"video-page-horisontal\\\"] > div\",\"tasks\":[[\"has-text\",\"Annonse\"]]}"],["{\"selector\":\"h2\",\"tasks\":[[\"has\",{\"selector\":\"+ p\",\"tasks\":[[\"has-text\",\"/^.*cas\\\\ino.*$/i\"]]}]]}"],["{\"selector\":\"p\",\"tasks\":[[\"has-text\",\"/^\\\\xA0$/\"]]}"],["{\"selector\":\"td\",\"tasks\":[[\"has-text\",\"/^\\\\xA0$/\"],[\"not\",{\"selector\":\"\",\"tasks\":[[\"has-text\",\"/^.*\\\\s.*$/\"]]}],[\"spath\",\":not(:has(img))\"]]}","{\"selector\":\"tr\",\"tasks\":[[\"has-text\",\"/^\\\\xA0$/\"],[\"not\",{\"selector\":\"\",\"tasks\":[[\"has-text\",\"/^.*\\\\s.*$/\"]]}],[\"spath\",\":not(:has(img))\"]]}"],["{\"selector\":\"p\",\"tasks\":[[\"has-text\",\"/^\\\\xA0$/\"],[\"not\",{\"selector\":\"\",\"tasks\":[[\"has-text\",\"/^.*\\\\s.*$/\"]]}],[\"spath\",\":not(:has(img))\"]]}"],["{\"selector\":\".front optimus-element\",\"tasks\":[[\"has-text\",\"Eurojackpot\"]]}","{\"selector\":\"amedia-frontpage > .optimus-complex-front\",\"tasks\":[[\"has\",{\"selector\":\"> header > h2\",\"tasks\":[[\"has-text\",\"/Reklame|REKLAME.*$/\"]]}]]}","{\"selector\":\"article[data-lp-section=\\\"sportspill\\\"]:has(.slotHeader)\",\"tasks\":[[\"has-text\",\"/^.*lot{2}o.*$/i\"]]}"],["{\"selector\":\".widget\",\"tasks\":[[\"has-text\",\"Annonse\"]]}"],["{\"selector\":\"div > .section\",\"tasks\":[[\"has\",{\"selector\":\"> div[class*=\\\"-label\\\"]\",\"tasks\":[[\"has-text\",\"Sponsored\"]]}]]}"]];

const hostnamesMap = new Map([["arendalstidende.no",0],["butikkoversikten.no",1],["itavisen.no",2],["tunnelsyn.no",3],["tek.no",4],["tungt.no",5],["tu.no",6],["digi.no",6],["fodboldspilleren.dk",7],["elbil24.no",[8,36]],["sorlandsavisen.no",9],["veitingageirinn.is",10],["gamer.no",11],["baeredygtigtfiskeri.dk",12],["fiskerforum.dk",13],["united.no",14],["retrospilling.no",15],["730.no",16],["kendte.dk",17],["glr.no",18],["jumpb.dk",19],["gunnarandreassen.com",20],["leinstrand-il.no",21],["dagbladet.no",[22,36]],["www-dagbladet-no.translate.goog",[22,36]],["margit-henriksen.dk",23],["thura.dk",23],["teknologia.no",24],["ni.dk",25],["bilnorge.no",26],["gaming.dk",27],["eyjafrettir.is",28],["xn--bodposten-n8a.no",29],["ranaposten.no",29],["pengenytt.no",30],["lystfiskerguiden.dk",31],["utrop.no",32],["padleguide.dk",[33,35]],["ipmsnorge.org",34],["polarmedia.dk",35],["iphoneluppen.dk",[35,37]],["anettelyskjaer.dk",[35,37]],["dreampapers.dk",[35,37]],["nemsvar.nu",[35,37]],["cuben-linedance.dk",35],["kk.no",36],["seher.no",36],["sol.no",36],["sol-no.translate.goog",36],["vi.no",36],["icelandreview.com",38],["bir.no",38],["medier24.no",38],["knr.gl",38],["nutiminn.is",38],["yrkesbil.no",39],["check-in.dk",40],["nettavisen.no",41],["www-nettavisen-no.translate.goog",41],["politainment.no",42],["thelocal.no",43],["thelocal.dk",43]]);

const entitiesMap = new Map(undefined);

const exceptionsMap = new Map(undefined);

self.proceduralImports = self.proceduralImports || [];
self.proceduralImports.push({ argsList, hostnamesMap, entitiesMap, exceptionsMap });

/******************************************************************************/

})();

/******************************************************************************/