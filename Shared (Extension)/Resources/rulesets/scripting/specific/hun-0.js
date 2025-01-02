/*******************************************************************************

    uBlock Origin Lite - a comprehensive, MV3-compliant content blocker
    Copyright (C) 2019-present Raymond Hill

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

// ruleset: hun-0

/******************************************************************************/

// Important!
// Isolate from global scope
(function uBOL_cssSpecificImports() {

/******************************************************************************/

const argsList = ["#_iph_cp_popup,\n#cookie-bar,\n#cookie-notice,\n#cookie-window,\n#cookiebar,\n#hirdetes,\n#hirdetesek,\n.cc-banner,\n.cc-banner-wrapper,\n.cc-window,\n.cc_banner,\n.cc_banner-wrapper,\n.cc_window,\n.hird,\n.hirdetesek,\n.leet_product_banner_container,\n[class*=\"overlayBg\"],\nins[id^=\"aswift_\"]",".hirdetes",".asgdc",".bannerContent","#cookie-law,\n.banner_middle",".ads_show_ad_title",".banner-wrapper",".banner-container","#overlay_readers_letter,\n#stickyHomePageRecommender,\n#webPushPopup,\n.a-hirstartRecommender,\n.m-donationBottomLine,\n.spklw-post-attr[data-type=\"ad\"],\n.widget-mini-article",".adaptiveAd[id^=\"444_cikk_mobil_\"],\n.adaptiveAd[id^=\"444_cikk_pc_\"],\n[id*=\"-banner-\"],\narticle:has(a[href*=\"hirdetes\"]),\ndiv.item:has(a[href*=\"hirdetes\"])","[class*=\"banner\"]","#alsobox","#text-5,\n#text-6","#galsoreklam,\n#oldalreklam,\n[href=\"https://777blog.hu/reklamblokkolo-kikapcsolasa/\"],\ndiv#rechtangle.widget:nth-of-type(5)","[class^=\"container-\"][class*=\"adZone\"]","#cookies-alert,\n[class^=\"zone_\"]","#g0,\n.az-layer,\n.big_badge,\n.floating-help-wrapper","[class*=\"ads\"]","#ajanlo",".ez-egy-dc-doboz:has(> .double_click_doboz),\n[style^=\"min-height: 128px; background: url(\\\"https://static.agroinform.hu/static/site/img/hirdetes_up.png\\\") no-repeat center bottom -1px;\"]","#alapjarat_cikk_fekvo_1,\ndiv.header + .clearfix + .clearfix","#block-block-16,\n#block-block-22,\n#block-views-ajanlo-block,\n#sticky_footer","#RedUserNotification","div.cikk_zona,\ndiv.rightside > iframe",".sidebar1 > div:first-child,\n[id^=\"hird_\"]",".mask,\n.showLink.reveal","[class*=\" adH\"]","#cookie-disclaimer,\n.brandbox",".tamogatoi,\n.wp-caption","#facebookPopUp,\n#facebookPopUpBackground,\n#szechenyi-container,\n.plus-wrapper","#_cikk_jobbhasab_2,\n#_cikk_jobbhasab_3,\n#_fooldali_header_alatti_banner,\n#_fooldali_header_banner,\n#_fooldali_jobbhasab_2,\n#_fooldali_jobbhasab_3,\n#custom_html-18,\n#custom_html-19,\n#custom_html-2,\n#custom_html-20,\n#custom_html-21,\n#custom_html-23,\n#custom_html-26,\n#custom_html-7,\n#custom_html-8","#custom_html-10","[class*=\"Advert\"]","[class*=\"etarget\"],\n[class*=\"szamlatabla\"]","[class*=\"hirdetes\"]","[id*=\"etarget\"]",".ads","#adds","p + center:has(iframe[data-src*=\"facebook\"]),\nscript + ins + h5","#article-2,\n#block-block-30,\n#block-block-60,\n.region-content-1-1 > div:last-child,\n.region-content-1-1 > div:nth-child(-1n+3),\n.region-content-1-3 > div:nth-child(-1n+2),\n.region-content-1-3 > div:nth-last-child(-1n+5),\n.view-banner-blokkok","#total,\n.category-section.ad,\n.minisite","[id*=\"banner\"]","iframe[src=\"https://tunderszepek.baon.hu/tunderszepek-banner\"]",".widget_media_image","[class*=\"adcikk\"]",".hidden-xs:has(> .lablec_alatt),\n.hidden-xs:has(> .weboldal_felett),\n.tapeta.fixed,\n[data-ai],\nblockquote","[id*=\"sponsor\"]","#karrier,\n.modal,\n.modal-dialog",".modal-backdrop","#footerLogos,\n#pe_confirm,\n#underArticleAdvertisement,\n[id*=\"-ad-\"][data-x=\"1\"],\n[id^=\"div-gpt-ad-\"] + [class$=\"widget\"],\n[style=\"width:100%;text-align: center; margin-bottom:15px;\"],\na[href*=\"gemius\"],\nbody > .extraContentSection:nth-of-type(-1n+3)","#ad-cikk1,\n#ad-cikk2,\n#ad-fekvo1,\n#ad-fekvo2,\n#ad-jobb1,\n#ad-jobb2,\ndiv:has(> div[id^=\"div-gpt-ad-\"])","#taft,\n.living-earth,\n.meropixel-hide,\n.share,\n[class*=\"follow_promo_figure\"],\n[id*=\"cp_popup\"],\ndiv[class*=\"_ad\"],\ndiv[class*=\"adv\"],\ndiv[class*=\"blh-billboard-ad\"],\ndiv[id*=\"wAdBox\"]","[class*=\"adbox\"]","[id*=\"Banner\"]","div[class*=\"etarget\"]","#fbox-background","#lightview1,\n[class*=\"popupBanner\"]","#onetrust-consent-sdk,\n.o-banner--hirdetes",".real-estate-wrapper",".cookie__wrapper,\n.subscription-box,\nA[href=\"/jatek\"],\nA[href=\"/nyarimagazin\"],\n[class*=\"__ad\"],\n[class*=\"adContainer\"],\na[target=\"_blank\"][class=\"videa-wrapper\"],\niframe[src*=\"koponyeg.hu\"]","#wpgtr_stickyads_textcss_container,\n.extpp-container,\n.otw-sidebar:has(a[href=\"https://bpiautosok.hu/tamogatonk-a-te-ceged-jelenj-meg-nalunk-a-youtube-on-es-a-bpiautosok-hu-n/\"]),\n.widget.widget_text:has(.adsbygoogle),\nbody > br:first-child,\nbody > br:first-child + center,\nbody > br:first-child + center + br,\ncenter:has(> a[href=\"https://bpiautosok.hu/mediaajanlat\"]),\ncenter:has(> a[href=\"https://bpiautosok.hu/mediaajanlat\"]) + br,\ncenter:has(> font),\nfont + center,\nfooter + font, footer ~ br","#custom_html-11,\n#custom_html-6,\n#media_image-17,\ndiv[style=\"margin-top:20px;\"]","#upprev_box","div.bpkad","#cooker_container,\n.banner_main_page_wrapper","#zadost,\n.cookies","#article_end_popup,\n.banner.boxed","#cadre_alert_cookies,\n#pa-push-notification-subscription,\n#sp-right > .sp-column > .sp-module.hidden-mobile,\n.banneritem","[class^=\"adsense\"]",".advert,\n.occsz-banner","#cookie-policy-content,\n.ad-article-comment,\n.ad-article-end,\n.ad-article-inside,\n.ad-article-inside-automatic,\n.ad-article-under-lead,\n.ad-content-top,\n.ad-header-after > *,\n.ad-header-after-article,\n.share-article","[class*=\"-adv\"]","#CookieAcceptLayer,\n#bdism1,\n#cikkajanlo,\n[class*=\"adv-\"]",".art-sidebar1,\n.art-sidebar2","#fadeandscale_background,\n#fadeandscale_wrapper",".sb-right > div:first-child","#banner_sav","div[id*=\"banner\"]","#headerBanner,\n#popupContentBanner-modal,\n.col-md-4.blog-sidebar:nth-child(even),\n.slidingBanner,\n.tablet-advert,\n.totop,\n.widgetDefault",".billboard","[class*=\"advert\"]","#billboard,\n[class*=\"prbox\"],\n[id^=\"linkbox_article\"]",".region-header.region","#a1,\n#a2",".jquery-modal.blocker.current",".cikk-halfpage.t-article-container_sidebar > div:first-child,\n.menu-sponsor_link,\n.rovat-halfpage.t-rovat-container_sidebar > div:first-child,\n.tctk,\n[id*=\"szponzoracio\"],\niframe",".cikk-vegi-ajanlo-reklamok","[id*=\"hirdetes\"]","#interstitial","[class=\"td-a-rec td-a-rec-id-content_top  tdi_62 td_block_template_1\"],\n[class=\"td-a-rec td-a-rec-id-header  tdi_53 td_block_template_1\"]","[class^=\"ads\"]","[id*=\"_ad\"]",".hirdetes-block","[class*=\"ad_\"]","[id*=\"ad_\"]",".detailRightAds,\n.min700height-desktop,\n.rltd_container [id^=\"rltd-ad-\"],\n.row:has(> #onet-ad-top),\n[class*=\"ad-\"],\n[class^=\"ads \"],\n[id^=\"ad-\"],\n[style=\"min-height: 300px;\"],\na[title=\"Hirdetés\"],\ndiv.wrapAds,\ndiv.wrapRectangle:has(#ad-cikk)",".ibb-banner-decor","[id^=\"ad_\"]","div[class*=\"contentBanner\"],\ndiv[style=\"text-align: center; margin-bottom:10px; position: relative;\"]",".rckaexclude",".super","#onetrust-banner-sdk","IFRAME","#article-recommend-popup,\n.adaptiveAd,\n.cookie-popup,\n.overlay-popup","[class*=\"_adv \"]","div[id*=\"col_2\"]",".popupunderlay,\n[class*=\"adPlace\"],\n[class^=\"goAdverticum\"]","[class*=\"adzone\"],\ndiv[id*=\"elementor-popup-modal-\"]","#advert",".wrapper > .slider","#darklayer,\n.views-field-nothing,\n[class*=\"_ad \"],\n[id*=\"_ad-\"]","#sliding-popup","[class=\"goAdverticum\"]","#femina-shop-ajanlo-slider,\n.cikk-torzs [data-miniapp-id]:has(.femina-shop-ajanlo-slider-hirdetes),\n.cikk-torzs [data-miniapp-id]:has(.lapozgato-ajanlo),\n.doboz_harmados,\n.szelso-jobb > div:has(> a),\n[class*=\"kepeslinkes\"]","div[class*=\"reklam\"]","[href^=\"https://rosszlanyok.hu/\"],\n[style]:has(.adslot_1)",".partnership-ads",".crp_related,\ndiv[id^=\"forbesad\"],\np + [class*=\"-bekezdes-utan-\"]","#ot2015,\n#rightcoltd,\n#site_header",".foot-logos.col-md,\n[href=\"https://www.barion.com/hu/vasarlok/arak-vasarloknak/\"],\na[href=\"http://consumer.huawei.com/hu/phones/mate10series/\"]","[class*=\"banners\"],\n[href*=\"hirdetesek\"]",".etarget",".facebook-layer-box","#content-container > div > a:not([class*=\"MailListItem-\"]),\n[class*=\"magnum\"]","#background_ad_top","#right > .xabrew300.box",".roadblockcont",".act_hun,\n.adt_hun","#qc-cmp2-container,\n[id^=\"ibb-\"][class*=\"banner\"]","[id*=\"advert\"]","#partnerek",".ad",".box-wrapper > .box-actual-magazine + .box-html","#eu-cookie-law,\n#facebook-likebox-8,\n.wpcnt","#adryf,\n.rltdwidget,\n[href^=\"https://www.webminute.hu\"],\n[id*=\"aswift\"],\ndiv.reklam_jobbra,\ndiv[style*=\"text-align\"]:has(> a > img),\ntd.txtcenter:has(> script + ins),\ntd[style=\"width: 10px;\"]:empty","#banner,\ndiv[class*=\"Advert\"]","[class*=\"contentBanner\"]","#cookie_bar,\n#infobar","#banner2016kormanyhu,\n[id*=\"banner_1_29_\"]",".catch-click",".banner-widget-container",".Ad,\n[id*=\"Ad_\"]",".Clear,\ndiv[id*=\"AdContainer\"]","#top > .p-0.container","#ajanlo_box_ah,\n#lightwindow_overlay","#player,\n#superbox",".szkozepkis","#kapubanner,\n[id*=\"_ads\"],\n[id^=\"cookieconsent\"]","#facebook-sharebar,\n#webaruhaz-ajanlo,\n.-contentTop,\n.a2blckLayer,\n.ctsGadx,\n.hashtags,\n.wrap,\nTD[id*=\"l_sponsor\"],\n[class*=\"adv_\"]","[class*=\"adtext\"]","[id*=\"hirdet\"]","#nyeremenyModal,\n[class=\"modal-backdrop fade show\"],\n[id*=\"popup\"],\ndiv.row:has(> div.ads)",".box_remote,\n.fbcont2,\n.fbfollow,\n.fbshare,\n.h-sideboard_2,\n.kalkulator","#sidebad,\n#spu-main,\n#text-html-widget-6,\n[class*=\"PostAd\"],\n[class=\"e3lan e3lan-top\"],\n[id*=\"-bg\"]","[class^=\"ad\"]","div[id*=\"Banner\"]",".hover_bkgr_fricc:has(.facebookPopupCloseButton),\ndiv[id*=\"zone-wallbanner-header\"]","#gyuri1,\n#gyuri2","[class*=\"billboard\"]","#cookieAlertBox,\n.banner_container,\n.banner_widget,\n.frame:has(> span[style^=\"font-size: 11px;\"]),\n.sy-box","[class*=\"-ad-container\"]","P[class*=\"banner\"]",".widget.widget_text","[id^=\"advert\"]","div[class*=\"banner\"]","EMBED,\ndiv[class=\"module noheading\"]","#fanback,\n#permission-bar,\n.fu-container,\n.sample,\n[href*=\"hirdetes\"],\na[href*=\"adf.ly\"],\na[style=\"text-decoration:none;\"],\ntable[bgcolor=\"darkgray\"]","#tetszett","[data-adblockonly]",".ui-widget-overlay","#cucc,\n#layerbanner","[data-zadtype=\"billboard\"],\ndiv.mobileArticleAds,\ndiv.right-rail:has(div.ad-wrapper),\nfigure:has(a[href*=\"ignshop.hu\"])",".back","#popup","#custom_html-3",".content-list.content-body > .recommendation-holder,\n.content-text > .recommendation-holder,\n.left-column.col-md-8.col-sm-12 > .recommendation-holder,\n.right-column.text-center.hidden-sm.hidden-xs.col-md-4 > .recommendation-holder:nth-of-type(1),\n.right-column.text-center.hidden-sm.hidden-xs.col-md-4 > .recommendation-holder:nth-of-type(2),\n.top-column.col-xs-12 > .recommendation-holder,\ni > .recommendation-holder:nth-of-type(1),\ni > .recommendation-holder:nth-of-type(2)",".tqWLsnEEqeEw-bg,\n[style=\"z-index: 999999; background: rgba(0, 0, 0, 0.85098); display: block;\"]","[style=\"background: rgb(255, 255, 255); max-width: 720px; z-index: 9999999; opacity: 1; visibility: visible;\"]","[class*=\"_ad\"]","#lebegodoboz,\n#szupertorony,\n[id*=\"-reklam\"],\n[id*=\"fancybox\"],\n[id^=\"hirdetes_jobb\"] + div,\n[id^=\"hirdetes_jobb_2\"] + div + div,\n[id^=\"szuperbanner_\"]","[id^=\"hirdetes\"]","#webpushSelctorFormId,\n.adcaption,\n.article-menu.panelgap,\n.article-otherelements-container content,\n.articlebox.clear.sidebar-ajanlat,\n.block-ms-box2,\n.cimlap-ajanlat.elem-1180.cimlap-grid-elem,\n.hosting,\n.hvg_push,\n.jobline-palyakezdo-feed,\n.selectWidget,\n.support-stripe,\n[class*=\"adtype-\"],\n[class=\"articleitem clear smallimage imgleft\"],\n[class=\"site-scarab-bottom open\"]","[class*=\"adsense\"]","[id*=\"-ad-\"]","div[class*=\"ad_\"]","#announcement,\n#cikktoolbaradomany,\n#cookiealert,\n#sidebar > table,\n.cikkszovegaction,\n.cikkszovegakcio,\n.kommentadomany,\nbody > div > a[target=\"_blank\"],\ndiv[id*=\"hirdetes\"]",".banner",".article-cards-inlist-ad,\n.article-text > p,\n.footer-banner-row,\n.iho-adzone,\n.social-icon","[class*=\"hird-\"],\n[class*=\"hird_\"],\na[data-bs-content*=\"(hirdetés)\"]","[class*=\" ad\"]",".topAdv",".adbd-layer",".shopline-box,\n.travelo-box",".cikk-vegi-ajanlo-reklamok-container","[class*=\"ad-container\"]","#ad_null_position,\n#also_bannerek,\n#index_shopline","#main div[class*=\"banner\"],\n#sidebar > div[class*=\"banner\"],\ndiv.read div[class*=\"banner\"]","#bottompopup","#leftPoszter-section,\n#salePoszter,\n.home-section-banner,\n.u-hide\\@mobile.flag-wrapper--fill.flag-wrapper.grid-col-lg-1-4.grid-col-md-1-2.grid-col-1.article-list__item","div[class=\"tl-state-root tve-leads-ribbon tve-trigger-hide tve-tl-anim tve-leads-track-ribbon-1 tl-anim-slide_top tve-leads-triggered\"]","#roadblock-adcum-zone,\n[style*=\"text-align: center;\"]:has(> .adverticum-label + a)","#joylike,\n[class*=\"Adverticum\"],\n[class^=\"adIn\"],\n[class^=\"adPlace\"]","[class^=\"ad-\"]","[data*=\"banner\"]","#header","#cookieSpan,\ndiv.bottom_sticky_banner","#check-also-box,\n#fejlec-hirdetes,\n[id^=\"cikken-beluli-hirdetes-\"]",".bpkad","#full-desktop,\n#full-mobile,\nheader + div[style^=\"margin:\"]","#above_article_banner,\n#advertisements,\n#below_content_banner,\n#left_banners,\n#right_banners,\n#social,\n#wide_banners,\n.article_banner,\ndiv.subscribe_module,\ndiv[class=\"fb-like fb_iframe_widget\"]","#google-display","A[href^=\"http://goo.gl\"]","#nap_ajanlata,\n.tamogatott,\n.vippr,\n[class*=\"banner-\"],\n[class*=\"offer prbox\"],\n[class*=\"pr--\"],\n[class^=\"pr-\"],\n[class^=\"prbox\"],\ndiv.endless-shared-area,\ndiv[id*=\"billboard\"],\ndiv[id*=\"linkbox\"]","#vshu-box,\n.integralt_felso_zona,\n.recommendationzone,\n[id*=\"adsense\"]","#euro-event,\n#league-selector + .row + .row:has(.banner),\n#sponsors,\n.gdpr-cookie-notice",".kapu,\n.mini_slider_div0","[class*=\"Banner\"]","[name*=\"banner\"]",".logopic2 + .fll,\n.overlay,\n.pupopadbox,\n[class=\"cikkbanner hirdbox mh40 listafriss\"],\n[style=\"margin-left:auto;margin-right:auto;width:980px;text-align:center\"]",".adbg",".category > #prodstop1,\n.single-post > #prodstop1","#current_promotions_block,\n#skin-left,\n#skin-right,\n.box-general.clearfix,\n.discount.clearfix.nonLpk,\n.fullwidth.current_promotions_block","#beuszoAjanlo,\n#cikkalatti,\n#floating-recommendation,\n#mc-holder,\n#ovasar,\n#pr-box,\n#right-ecom,\n#top,\n.col-visible-xl.r-side.col-xl-4,\n.email-under-article,\n.frip-inline:has([data-module-name=\"inline-article\"]),\n.hird300,\n.kiskepes,\n.magnum,\n.panorama-wrapper,\n.pr-item,\n.spar,\n.szoveges,\n[data-module-name=\"hirlevel\"],\n[data-module-name=\"ingatlanbazar\"],\n[data-module-name=\"koponyeg\"],\n[data-module-name=\"videa\"],\n[id^=\"szponz-\"],\n[size=\"300x600\"],\ndiv[class$=\"widget\"]","#ac",".newsletter-layer,\ndiv.article-recommendation-zones",".cikkhirdetes,\n.sticky1hirdet","[class*=\"adserver\"]","[class*=\"-ad\"]","#navi_btm + div,\nimg[src^=\"https://logout.hu/muvelet/hozzaferes/kapcsolodas.php\"]",".nobanner,\n[class^=\"banner_\"],\n[id^=\"banner_\"]","#exposeMask","#page_PopupContainer",".parallax_bottom,\n.parallax_top",".goAds,\n.visible-lg.container,\ndiv[class=\"container-full\"][style=\"background:#fff\"]:has(.topadv)","#eucookielaw,\n.ad-magnum,\n.ad-verticalfull,\n[class*=\"simpleads\"]",".partners","#block-block-12,\n#block-block-19,\ndiv.gdprBoxContainer,\ndiv.promo-bar","[class*=\"reklam\"]","[id*=\"reklam\"]","#article > section > div:not(.article_content)","#cboxOverlay,\n#colorbox","#floatingBox,\n.ui-floating-message,\n.wsp-wrap,\n[class*=\"tBanner\"]",".banner_row,\n.proposer,\n.read_vs,\n.rightbanner",".cookie-bar,\n.mrc-bnr-plchldr,\n.popup-wrap,\n[class^=\"banner\"]",".sticky",".article-textlinkbox","#ad-image-big,\n#fadeandscale,\n#portfolioEzekIsErdekelhetnek,\n#recipeAndRelateds > h2.noprint,\n#sidebar_ads_box_2,\n.billboard-cikk,\n.hir-fekvo,\n[class*=\"ads_box\"],\ndiv[class=\"billboard fr\"],\ndiv[class=\"fej-elso-sor cf\"],\ndiv[id*=\"-ad-\"]","[href*=\"ad.adverticum.net\"]","#app-advice,\n#app-commission,\n.x-marketing",".cim-reklam,\n.widget_text.widget.widget_custom_html",".om-holder","[class*=\"box ajanlo\"],\n[id*=\"ctnet\"]",".adbox","#adserving-tag-hb,\n#pa_sticky_ad_box_middle_left,\niframe[id^=\"postbid_if_\"]","[align=\"center\"] > a[href*=\"banner\"],\n[class^=\"ui-dialog\"]","#mobilinstruments,\n#stickyfooter,\n.cikkajanlo,\n.totalcar,\n[id*=\"billboard\"],\na[href^=\"https://bit.ly/\"]","#custom_html-4,\n#primary-sidebar,\n.right","#sidebar","[style=\"width:300px;height:250px;\"],\nscript[data-cfasync=\"false\"]",".banner-bottom",".ckwrap,\n.list-item.has-banner","[class*=\"advertisement\"]","#text-3","#didyou,\n#wallpaper_left,\n#wallpaper_right,\n.bet365_connect,\n[class*=\"_szponzor_\"]","[class^=\"ad_\"]","[class*=\"adlabel\"],\n[class*=\"leftlogo\"],\n[id*=\"adserver\"]",".myftp-widget,\n[id^=\"fancybox-\"],\n[id^=\"myftp\"]","[id*=\"advertisment\"]","#tab-widget",".m-fbPopup",".m-breakingLayer:has(a[href*=\"nlc.hu/balkonfanatik\"]),\n.m-pcPromoArticlePointsLayer,\n.m-pcPromoFooterLayer,\n.rubAd,\ndiv.m-articleStickySocial,\ndiv.m-breakingLayer","[data-placeholder-caption=\"hirdetés\"]",".noprint,\ndiv[class*=\"ad-container\"]","#datasheetNavHelp",".hover_bkgr_fricc","#slidebox,\n.highlighted-banner","[class*=\"ad-warning\"],\n[class=\"ad-blocked\"],\n[class=\"p-t-10 ad-blocked\"]","[id^=\"zone\"]",".col-xl-8 + aside.col-xl-4.col-visible-xl,\n.mw-allow-notification-dialog,\napp-article-page app-sidebar app-free-display-inventory,\napp-sport-article-page app-sidebar app-free-display-inventory,\nkesma-advertisement-adocean,\nsection.spar","[id^=\"block-views-block-banners-\"]","#zone-halfpage,\n#zone-roaddblock,\n.centercol.sponsor","#zone-titleheader",".slidein.popup.closeablenotification.scripted,\n.zone[data-zoneid]",".banner-content,\na[href*=\"banner_click\"]","#kutu","#recommend,\n.frame-center,\n[class^=\"f10\"],\n[class^=\"grbox\"]","[class^=\"ads-\"]",".justClassBanner","#cikkertesito-reg-form,\n.banner.clearfix,\n.inner","#pushpushgo-container,\n.ad-container,\n.ph-flexi-box-wrap,\n.ui-dialog[aria-describedby=\"newsletter-modal\"],\n.ui-widget-overlay.ui-front,\n[aria-describedby=\"dialog-welcome\"],\n[class*=\"adbreak\"],\n[class*=\"c_banner\"],\n[class*=\"placeholder\"],\n[class=\"ph ph-responsive-wrap\"],\n[data-analytics-value]",".ads-container",".articleMetadata,\n.container.css-table > div:not(.container),\n.edgebox-widget.show,\n.introjs-helperLayer,\n.introjs-overlay,\n.introjs-tooltip,\n.port-adbd,\n[class*=\"_spon\"],\n[class=\"advert fix-advert\"]","#BlockCikkajanlo,\n#mymodal2,\n.footer--partners,\n[data-qa=\"oil-Layer\"],\n[data-qa=\"oil-full\"],\ndiv[id*=\"adocean\"]",".lead_alatti_txt,\n.mfor_cikk_beuszo,\n.news-page > div[style*=\"background: #FFF900;\"]:first-child,\n[src*=\"/banner/\"]","#newsletter_footer,\n#twister-banner,\n.cookie-layer",".spleft,\n.spright","[class$=\"responsive-300px-600px\"],\na[onclick*=\"/muvelet/hozzaferes/kapcsolodas.php?id=\"],\nbody > style,\ndiv:has(> h4 + div[style*=\"calc\"])","#thanks > .hlist.nohead,\n.xabrecontainer,\na[onclick*=\"$.ajax\"],\ndiv#center:has(div > div > p > a[style=\"color: #b42223;\"]),\ndiv[class*=\"xabre-responsive\"]:not([class*=\"-980px-139px\"])","#top > div:first-child",".banner__ad","[class*=\"banner \"],\n[id^=\"overlay\"]","[aria-describedby=\"newsletter-modal\"],\n[class*=\"adv--\"]","#wallpaper,\n.wallpaper-link","#psCookieNotification,\ndiv.ad-sm-text",".std0,\nIMG[src=\"images/hirdetes.gif\"]","#gdprCookieWrap,\n[class*=\"AdWrap\"],\n[id*=\"AdWrap\"]","[id*=\"ctnet_ad_\"],\ndiv[class*=\"ad \"]","#fhr-cookie-bar,\n#fragment,\n[class*=\"-ad-\"]","#text-9,\ndiv.sprtrvs-ad,\ndiv.tt-shortcode-1,\ndiv.tt-shortcode-2","#menusimple2 + div,\ndiv[style=\"width:100%;height:14px;text-align:left;font-size:9px;letter-spacing:3px;color:#5F5F5F;border-bottom:1px solid #CCC;margin: 10px 0 5px 0;\"],\nscript[async] + [data-widget-id]","#push-notification,\n.kezdo-kereso,\n[box-name=\"Hirdetés\"],\n[class*=\"Adv\"],\n[class*=\"peelgame\"],\n[class^=\"adact\"],\n[class^=\"adx_\"],\n[id*=\"Advert\"],\n[id*=\"peelgame\"],\ndiv.container.banner-container.left,\ndiv.container.banner-container.right,\ndiv.container.banner-container.wide > *","[src*=\"hirdetes_\"]",".cikk-hir,\n[class*=\"googlebox\"],\ndiv[class*=\"adserver\"],\ndiv[id*=\"kirakat\"],\ndiv[id*=\"rightad\"]","[class=\"wp-container wp-top\"]",".modal_popup","#st-2,\n.cookie-consent","[src^=\"/uploads/images/banners/\"]",".active.popup-screen,\n.popup-box,\n.stream-item,\n[id^=\"stream-item-\"],\n[id^=\"tie-block\"]:has(.stream-title)",".Cookie--bottom,\ndiv[id^=\"ga_g\"]",".rightContent + [style]","#cookie-policy-bar,\n#hatterkep,\n#rovatpromo,\n.adslabel,\n[class^=\"ads_\"],\n[class^=\"ads_\"] + .clear,\niframe[class*=\"my-fbrecommend\"]","#ecom_pr,\n.ad-wrap-100,\n.jobb_300","#magnum","[class*=\"google-cikk\"]","[style=\"height: 250px\"]","#modal--umbrella,\n#modal--you,\n.recommendation.recommendation--out,\n.recommendation.recommendation--pr,\n.title-section__sponsored","[id^=\"adchange\"]","div.banner",".kiemelttartalombox_feher",".spu-bg,\n.spu-box,\n[style=\"margin: 8px 0; clear: both;\"]","[id*=\"_bnr\"]",".sgpb-popup-dialog-main-div-wrapper",".sgpb-theme-3-overlay.sgpb-popup-overlay-1402.sgpb-popup-overlay,\nimg[class*=\"sgpb-\"]",".cross-site-programmatic-zones",".cikk-torzs-content-container > .kep_szeles.kep,\n.hasznaltautok-iframe-cikk-torzs,\n.header-tk-ajanlo,\n.joautok-iframe-cikk-torzs,\n.microsite,\n.szelso-jobb-lead_container,\n.totalkarWidget,\n[class*=\"adblokk\"]","#ads,\n[id*=\"adocean\"]","#Promolecek,\n.header-1,\n[class*=\"Reklam\"],\ndiv[id*=\"Reklam\"],\ndiv[id*=\"anner\"]","div.facebook-layer-box","#cookie_policy,\n#lw_bg1,\ndiv[style^=\"height:\"]",".adsense","#popunder_featured,\n.banner_box",".leftSide > .bnr,\n.rightSide > .bnr,\n.row:has(.mainTopBnr)","#blanket,\n#popUpDiv",".bannergroup",".hird-cont",".banner-commercial,\n.reklamnagy",".page-rightside-advert,\ndiv[id*=\"advert-container\"]","[class*=\"szovegkozi\"],\n[id*=\"reklam_\"]",".adszoveg,\n[class*=\"ad_container\"],\n[class*=\"guestbox\"],\ndiv[class*=\"microsite\"],\ndiv[id*=\"microsite\"]","#backdrop,\n#best-cars-layer,\n#beta-message-invite,\n.centerHead,\n[class*=\"Etarget\"],\n[class*=\"Hirdetes\"],\n[class*=\"advert \"],\n[class*=\"szponzor\"]","[style^=\"bottom: 0px; left: 0px; position: fixed; width:\"],\ndiv[class*=\"-ad\"],\ndiv[class*=\"hird-\"],\ndiv[class*=\"hirdetes\"],\ndiv[class=\"fej_felett cf\"],\ndiv[id*=\"etarget\"]","#sitemessage","[class^=\"adv\"]","[style=\"z-index: 999999; background: rgba(0, 0, 0, 0.901961); display: block;\"]",".no_banner","[id*=\"_ajanlatunk_\"],\ndiv.floating_share","[id*=\"AdFrame\"]","[class=\"wc_content wc_contentwide\"],\n[id*=\"AdZone\"]","div.penci-wrap-gprd-law,\ndiv.sgpb-popup-dialog-main-div-theme-wrapper-1,\ndiv.sgpb-popup-overlay-42657,\ndiv.sgpb-popup-overlay-42658","[id*=\"sense-\"]",".code-block:has(script + ins)","#cookieBox,\n#cookieBox_bg,\n.whiteBox:has(.goAdverticum)","div#mymodal:has(#form-popup)","a[rel*=\"sponsored\"]",".ads-left-container,\n.ads-name-title,\n.ads-right-container,\n.cookie-box-cnt,\n.infobar-cnt,\n.popup-ad,\napp-ads,\niframe[src^=\"https://cfusionsys.com\"]","div:has(> .ai-attributes + script + ins)","div:has(> a + h6)","div.lol:has(> a[onclick=\"getValue()\"]),\ndiv.widget:has(> div.textwidget > p > script)",".mc-modal:has(iframe),\n[class^=\"moove-gdpr-\"],\n[id^=\"um-\"]:has(.fb-page.fb_iframe_widget)",".code-block:has(> div + ins.adsbygoogle + script)","div:has(> [style*=\"calc\"])",".fb-exit-popup-container",".mailingActionC",".flyout","[aria-describedby=\"cookies-dialog\"]","#cookieinfo","#CybotCookiebotDialog",".cookie-notice-container","#cookie","#popupajanlo","main + .ok-prerender","app-article-subscription-box,\napp-newsletter-modal",".pea_cook_wrapper","#articleOfferFlag","#pe_confirm_optin_6","#pe_confirm_optin_1","#newASZFLayer",".newsletter-box","#onesignal-bell-container,\n#onesignal-slidedown-container","#web-push-popup",".enews-article-content .endless-shared-area","#cookie-law-info-bar",".penci-wrap-gprd-law,\n.sgpb-popup-overlay","div.cookieLayer,\ndiv.supportModal","#catapult-cookie-bar",".grey-popup-layer",".leavingPopupLayer","#cookiekezeles",".accept-cookies","div[id^=\"jqueryFloating\"]","#cookiewarnbar","#_ao-cmp-ui,\n#sitemodal:has(.fb-button),\n.am_targetvideo_container,\ndiv[data-qa=\"oil-Layer\"]",".notification-popup","#cookie-law-info-again","#cookie_container","[app=\"tibrr-cookie-consent\"],\n[class^=\"k\"][class*=\"-container\"][class*=\"-2\"][class$=\"-hide\"]",".cookies-message-container","#cookieAcceptanceContainer",".qc-cmp2-container","div.accept-cookies",".modal[role=\"dialog\"],\napp-calendar,\napp-facebook-popup,\napp-newsletter-popup","#cookie-msg",".allow-cookie-stripe","#sticky,\n.b336",".fb-page-cont,\n.topHorizontalBanner,\n[src^=\"/public/img/efi/\"]","[class*=\"pea_cook\"]","div#show_news_box,\ndiv.cookie-message","#cookie-consent",".colorbox-cookiepolicy","#accept-cookie","#kpopup","#fb_like_modal","#cookieconsentbar,\n#subscribepopuppanelalign",".popup","#accept-container","#cookieconsent",".adblock-confirm,\n.newsletter-modal","#enableCookieDiv","div.fb_shares","#sutik","#app-cookie-policy",".border-top.p-4.bg-8.cookie-alert__inner","div.qc-cmp-ui-container",".footprint_cookie","body > div[data-elementor-type=\"footer\"] ~ div[id][class*=\" \"]","#detect + .wrapper",".adBanner",".top-video-container-banner","body > section:not(.site-header):not(#toreskar):last-of-type",".ooono_promo","#cookie-consent-dialog"];

const hostnamesMap = new Map([["hu",[0,1]],["liked.hu",[1,225]],["hdmozi.hu",2],["magyarorszagom.hu",3],["dehir.hu",[3,78]],["112press.hu",4],["168.hu",[5,6]],["bien.hu",[5,34,41,45]],["player.hu",[5,289,290]],["twice.hu",5],["24.hu",[7,8,371]],["hiros.hu",[7,159]],["444.hu",[9,10]],["autopro.hu",[10,36,37]],["bitport.hu",[10,41,46]],["blogstar.hu",[10,56]],["dimo.hu",10],["donna.hu",[10,41]],["epresso.hu",10],["eropolis.hu",10],["es.hu",[10,41,102]],["est.hu",[10,104]],["femina.hu",[10,34,35,113]],["figyelo.hu",[10,52]],["galamus.hu",10],["gondola.hu",[10,41,130]],["gportal.hu",10],["gyoricegregiszter.hu",10],["gyorplusz.hu",[10,391]],["hir6.hu",10],["hirstart.hu",[10,34]],["hrportal.hu",[10,169,170]],["ingatlanmagazin.com",10],["ingatlanok.hu",10],["intima.hu",10],["jogiforum.hu",10],["kalohirek.hu",[10,41,404]],["kamaszpanasz.hu",[10,203,204]],["kapos.hu",10],["kaposvarmost.hu",10],["komment.hu",[10,34,41]],["kronika.ro",10],["lovebox.hu",10],["magyarhirlap.hu",[10,41,234,235]],["mainap.hu",10],["mfor.hu",[10,245]],["mixonline.hu",10],["mmonline.hu",10],["mno.hu",[10,52,53,93,251]],["moly.hu",[10,413]],["napi.hu",[10,34,41,88,255]],["napiszar.hu",10],["nemzetisport.hu",[10,41,97,189,263,264,412]],["nice.hu",[10,416]],["noinetcafe.hu",10],["noplaza.hu",10],["novagyok.hu",[10,41]],["nyest.hu",[10,417]],["origo.hu",[10,32,41,224,278,337]],["partyponty.hu",[10,41]],["prim.hu",10],["retikul.hu",[10,303]],["revizoronline.com",[10,41]],["ricsajok.hu",10],["sporthirado.hu",[10,41]],["sportoldal.ro",10],["szatmar.ro",[10,77,315]],["szoftverbazis.hu",[10,223,321,322]],["tech.hu",[10,41]],["valasz.hu",10],["vidget.hu",10],["weborvos.hu",[10,178]],["wellnesscafe.hu",[10,53,357]],["5mp.eu",11],["5percblog.hu",[12,360]],["777blog.hu",13],["accounts.freemail.hu",14],["adoforum.hu",15],["adozona.hu",[16,17]],["eduline.hu",[17,32,91,93,94]],["kiskegyed.hu",[17,41,96,383,396,408]],["agrarszektor.hu",[18,362,373]],["hellovidek.hu",[18,152]],["infostart.hu",[18,373,401,402]],["penzcentrum.hu",[18,285]],["agroinform.hu",19],["alapjarat.hu",20],["alfahir.hu",21],["androbit.net",22],["androgeek.hu",23],["angol-magyar-szotar.hu",24],["aranyoldalak.hu",[25,26]],["telefonkonyv.hu",26],["arukereso.hu",27],["atlatszo.hu",28],["atv.hu",29],["automotor.hu",[30,31]],["budapestkornyeke.hu",[31,61,62,63,208]],["autonavigator.hu",[32,33,34,35,376]],["blog.hu",[32,51,52,53,54]],["delmagyar.hu",[32,34,41,79,80,81,381]],["hasznaltauto.hu",[32,145,376]],["life.hu",[32,41,54,122,222,223,224,419]],["olcsobbat.hu",[32,87,273]],["cegbongeszo.hu",[34,53,68]],["divany.hu",[34,41,85,86,87,88,191,438]],["eletmod.hu",[34,35,41,99,100]],["femcafe.hu",[34,71,110,111]],["hajdupress.hu",[34,41,139]],["hajokonyha.hu",34],["harmonet.hu",[34,77,144]],["heol.hu",[34,381]],["hwsw.hu",[34,79,185]],["index.hu",[34,41,86,191,192,193,194,195]],["itmania.hu",[34,99]],["kisalfold.hu",[34,77,79,80,129,212,381]],["kitekinto.hu",[34,87,382]],["koponyeg.hu",[34,164,182,213]],["ma.hu",[34,99,100,217]],["motorrevu.hu",34],["noitema.hu",34],["onlinecegjegyzek.hu",34],["romnet.hu",[34,41,87]],["sonline.hu",[34,306,381]],["storyonline.hu",[34,312]],["szabadfold.hu",[34,428]],["szoljon.hu",[34,323,381]],["totalcar.hu",[34,191,192,193,333,334,335,438]],["travelo.hu",[34,337,432]],["velvet.hu",[34,41,88,191,192,194,335,348]],["vezess.hu",[34,53,269,349]],["svedasztal.com",[35,90]],["szervuszausztria.hu",[35,90]],["offline.hu",[36,394]],["telekom.hu",[36,430]],["autosjog.hu",[38,377]],["autoszektor.hu",39],["bacsmegye.hu",[40,41]],["betegvagyok.hu",41],["duen.hu",41],["egeszsegkalauz.hu",[41,95,96,383,385]],["geeks.hu",41],["hirposta.hu",41],["ipon.hu",[41,198]],["kakukk.ro",41],["kezilabda.hu",41],["kreativ.hu",[41,216,409]],["multiplay.hu",41],["pdafanclub.com",41],["pirulapatika.hu",41],["revizoronline.hu",41],["startlap.hu",[41,182,310]],["stylemagazin.hu",[41,313]],["trademagazin.hu",41],["baon.hu",[42,381]],["bebiztositva.hu",[43,382]],["beol.hu",[44,381]],["bkv.hu",[47,48]],["mandiner.hu",[48,58,410]],["blikk.hu",[49,383,384]],["blikkruzs.blikk.hu",[50,385]],["freemail.hu",[52,121,122,123]],["haon.hu",[53,141,142,381]],["mon.hu",[53,141]],["metazin.hu",54],["blogspot.hu",55],["bookline.hu",57],["borsonline.hu",[58,59,387]],["bpiautosok.hu",[60,388]],["likenews.hu",[62,63]],["starity.hu",[62,309]],["kekvillogo.hu",[63,208]],["budapestpark.hu",64],["calculat.org",65],["carstyling.com",66],["cartourmagazin.hu",67],["ceginformacio.hu",69],["computerworld.hu",[70,389]],["pcworld.hu",[70,389]],["gamestar.hu",[70,389]],["puliwood.hu",[70,389]],["csaladinet.hu",[71,72]],["csongradihirek.hu",73],["csupasport.hu",[74,390]],["mindmegette.hu",[74,246,412]],["cyberpress.hu",[75,391]],["data.hu",[76,77]],["ingatlan.com",77],["klubradio.hu",77],["portfolio.hu",[77,292,402]],["hazipatika.com",[80,148,149,371]],["mindenkilapja.hu",80],["sg.hu",[80,304]],["demokrata.hu",82],["dictzone.com",83],["dijnet.hu",84],["linkcenter.hu",[87,226]],["transindex.ro",[87,189,216,336]],["e-cars.hu",89],["ecoline.hu",[90,91]],["magyarnarancs.hu",91],["economx.hu",92],["sportorvos.hu",[93,308]],["glamour.hu",[96,128,383,384,396]],["egeszsegtukor.hu",97],["vehir.hu",[97,264,347]],["elelmiszer.hu",98],["eredmenyek.com",101],["gyakorikerdesek.hu",[102,134,397]],["esport1.hu",103],["eudomain.eu",105],["evamagazin.hu",106],["f1vilag.hu",[107,394]],["feliratok.info",108],["feliratok.org",109],["elemzeskozpont.hu",111],["pannonrtv.com",[111,279]],["filmoldal.hu",114],["filmvilag.me",115],["foodora.hu",116],["forbes.hu",[117,394]],["forum.index.hu",118],["fototrend.hu",[119,370,424]],["fovarosi-hirhatar.hu",120],["zene.hu",121],["gamekapocs.hu",124],["gamepod.hu",[125,235,295,296,297,370,424]],["gentleman.hu",126],["gepigeny.hu",127],["gloria.tv",129],["gsplus.hu",[131,132,389]],["pcwplus.hu",[131,132,389]],["nepszava.hu",[131,164,265]],["gumiszoba.com",133],["gyaloglo.hu",135],["gyartastrend.hu",[136,398,399]],["pharmaonline.hu",[136,287]],["gyorihir.hu",137],["gyulaihirlap.hu",138],["hang.hu",[140,368]],["hardverapro.hu",[143,295,296,370,424]],["hatarido-szamitas.hu",146],["haziallat.hu",147],["mobilarena.hu",[149,235,252,296,297,370,424]],["helyitipp.hu",[150,377]],["hetek.hu",151],["hir.ma",[153,154]],["otvenentul.hu",154],["hirado.hu",[155,156]],["videoklinika.hu",155],["hircsarda.hu",157],["hirextra.hu",158],["indavideo.hu",[158,190]],["hirtv.hu",160],["hoc.hu",161],["hogyan.org",162],["hogyankell.hu",163],["holtankoljak.hu",[164,165]],["kapcsolat.hu",164],["webbeteg.hu",[164,180,355]],["hosszupuskasub.com",166],["hotdog.hu",167],["hoxa.hu",[168,397]],["americantourister.hu",[169,374]],["raketa.hu",[169,301]],["hu.ign.com",171],["hu.jooble.org",[172,173]],["politaktika.hu",173],["szepsegbroker.hu",[173,319,378]],["huaweiblog.hu",174],["mlzphoto.hu",[174,249]],["napidroid.hu",[174,256]],["humormagazin.com",175],["hungliaonline.com",[176,177]],["vilagunk.hu",[177,353]],["hunhir.hu",178],["hupont.hu",[179,180]],["hvg.hu",[181,182,183]],["vilagszam.hu",[183,352]],["hvo.hu",184],["iho.hu",[186,187,387]],["ize.hu",186],["napiszex.hu",[186,259,260]],["ncore.pro",186],["promotions.hu",[186,299]],["sztarklikk.hu",186],["tvgo.hu",186],["idokep.hu",188],["ilovebalaton.hu",189],["totalbike.hu",[191,333,438]],["infomovar.hu",196],["infoajka.hu",196],["infoszigetkoz.hu",196],["infosopron.hu",196],["infopapa.hu",196],["infocelldomolk.hu",196],["infodebrecen.hu",196],["infobekescsaba.hu",196],["infosarvar.hu",196],["infoszombathely.hu",196],["infozalaegerszeg.hu",196],["infokeszthely.hu",196],["infoszentendre.hu",196],["infocegled.hu",196],["infokarcag.hu",196],["infofehervar.hu",196],["infotatabanya.hu",196],["infogyor.hu",196],["infoesztergom.hu",196],["infokiskunfelegyhaza.hu",196],["inforabakoz.hu",196],["infodunaujvaros.hu",196],["infodombovar.hu",196],["infoveszprem.hu",196],["infomiskolc.hu",196],["infohodmezovasarhely.hu",196],["infonograd.hu",196],["infotamasi.hu",196],["internet-marketing.hu",197],["ite.hu",199],["jofogas.hu",200],["joy.hu",[201,202]],["nemkutya.com",[202,262]],["mozinezo.hu",204],["muhelynet.hu",[204,230]],["kapu.hu",205],["kecskemet365.hu",206],["kekfeny.com",207],["keol.hu",209],["kereso.startlap.hu",210],["ketkes.com",211],["kosarsport.hu",214],["hunbasket.hu",214],["kossuth.hu",215],["marmalade.hu",216],["nol.hu",[216,272]],["turizmusonline.hu",216],["kulturpart.hu",217],["kuruc.info",218],["lakberendezes.hu",219],["leet.hu",220],["libri.hu",221],["litera.hu",227],["superiorhirek.hu",227],["logout.hu",[228,235,295,296,297,424]],["love.hu",229],["lumenet.hu",[230,231]],["m.hvg.hu",232],["mafab.hu",233],["prohardver.hu",[235,295,296,297,298,370,424]],["itcafe.hu",[235,295,296,297,370,424]],["magyarnemzet.hu",[236,387]],["magyarszo.com",[237,238]],["napinemszar.hu",[238,257]],["maszol.ro",239],["mavcsoport.hu",240],["sorozataddict.hu",240],["medicalonline.hu",[241,398]],["menetrendek.hu",242],["merce.hu",243],["meska.hu",244],["mkbnetbankar.hu",248],["mme.hu",250],["mozishop.hu",250],["mozinet.me",253],["mult-kor.hu",254],["napiszar.com",258],["telex.hu",[259,325]],["napiuzlet.com",261],["nepszava.us",266],["netbulvar.eu",267],["nkmenergia.hu",268],["nlc.hu",[269,270]],["noizz.hu",271],["online-filmek.me",274],["onroad.hu",275],["oprend.hu",276],["gphirek.hu",277],["pcforum.hu",[280,281,282,422]],["prog.hu",[280,281,422,423]],["pcguru.hu",283],["pecsma.hu",284],["pestisracok.hu",[286,388]],["piacesprofit.hu",288],["civishir.hu",[290,364]],["port.hu",291],["privatbankar.hu",293],["profession.hu",294],["propeller.hu",[300,423]],["rendszerigeny.hu",302],["sielok.hu",305],["sorozatwiki.hu",307],["stop.hu",311],["szamoldki.hu",314],["szeged.hu",316],["szeged365.hu",317],["szekelyfold.ma",318],["szeretlekmagyarorszag.hu",320],["sztaki.hu",322],["telefonguru.hu",324],["teltlanyok.com",326],["terhesferfi.hu",327],["termalfurdo.hu",328],["titkokszigete.hu",329],["tlap.hu",330],["topark.hu",[331,332]],["elemi.hu",[331,392]],["tudtade.blogstar.hu",338],["turmixvilag.hu",339],["twn.hu",340],["ugytudjuk.hu",341],["usernet.hu",342],["utajovobe.eu",343],["valaszonline.hu",344],["vasarnap.hu",345],["vatera.hu",346],["vg.hu",[350,387]],["videa.hu",[351,419,437]],["vilagszammagazin.hu",352],["vs.hu",354],["webforditas.hu",[356,417]],["widescreen.hu",358],["wikiszotar.hu",359],["najlepsie-clanky.com",[360,415]],["ado.hu",361],["cfusionsys.com",363],["harmonikum.co",365],["koroshircentrum.hu",366],["lifestory.hu",367],["magyarhang.org",368],["napjainkportal.hu",[369,377]],["alza.hu",372],["autobazar.eu",375],["babanet.hu",[378,379]],["bankmonitor.hu",380],["bama.hu",381],["boon.hu",381],["duol.hu",381],["feol.hu",381],["kemma.hu",381],["nool.hu",381],["szon.hu",381],["teol.hu",381],["vaol.hu",381],["veol.hu",381],["zaol.hu",381],["bonuszbrigad.hu",386],["ripost.hu",[387,425]],["itthonrolhaza.hu",[391,403]],["epiteszforum.hu",393],["fressnapf.hu",395],["hestore.hu",400],["karpathir.com",405],["kfc.hu",406],["kh.hu",407],["mediacenter.hu",411],["myonlineradio.hu",414],["obi.hu",418],["reblog.hu",419],["ok.hu",419],["paleomedicina.com",420],["profitline.hu",421],["rtl.hu",426],["simple.hu",427],["tarhely.eu",429],["thaimatrac.hu",431],["wasabi.hu",433],["dizajnkonyha.hu",434],["onvideo.hu",435],["videaloop.hu",437],["traffihunter.hu",439],["kektura.hu",440]]);

const entitiesMap = new Map(undefined);

const exceptionsMap = new Map([["femina.hu",[112]],["mindmegette.hu",[247]],["videa.hu",[436]],["videaloop.hu",[436]]]);

self.specificImports = self.specificImports || [];
self.specificImports.push({ argsList, hostnamesMap, entitiesMap, exceptionsMap });

/******************************************************************************/

})();

/******************************************************************************/