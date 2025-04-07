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

// ruleset: kor-1

// Important!
// Isolate from global scope
(function uBOL_cssDeclarativeImport() {

/******************************************************************************/

const argsList = ["","{\"selector\":\"aside#mAside > div[disp-attr]:has(> .content_sponsor) + div[disp-attr]\",\"action\":[\"style\",\"margin-top: 0px !important;\"]}\n{\"selector\":\"body.nate aside#mAside > div[disp-attr]:has(> .wing_nate) + div[disp-attr]\",\"action\":[\"style\",\"margin-top: 0px !important;\"]}","{\"selector\":\".main-content > .content-article:not(:has(+ .content-aside > div[data-tiara-layer][class=\\\"box_side\\\"]))\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"#content div[class^=\\\"basicList_list_\\\"] div:has(div[class^=\\\"adProduct_item_\\\"]):has(~ div)\",\"action\":[\"style\",\"height: 1px !important; visibility: hidden !important;\"]}\n{\"selector\":\".seller_filter_area ~ div[class*=\\\"_list_\\\"] div[class^=\\\"adProduct_item\\\"]\",\"action\":[\"style\",\"visibility: hidden !important; height: 1px !important; padding: 0 !important;\"]}","{\"selector\":\"#board_read .board_main_top .member_reward_wrapper\",\"action\":[\"style\",\"margin-top: 20px !important; float: right !important; margin-right: 20px !important;\"]}\n{\"selector\":\"#board_top .best_list\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\"#board_top > div > .top_best.best_list:has(+ .col div[id^=\\\"ad_\\\"])\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".container:has(~ div[style]#toTop) article.content\",\"action\":[\"style\",\"margin-top: 100px !important;\"]}\n{\"selector\":\".headding-news:has(~ div:not([style])#toTop) .col-md-8\",\"action\":[\"style\",\"margin-left: calc(50% - 384px) !important;\"]}","{\"selector\":\"div[data-mesh-id][data-testid] > div[id^=\\\"comp-\\\"]:has(form[id][class])\",\"action\":[\"style\",\"margin-top: -600px !important;\"]}","{\"selector\":\".body > .content.xe_content:not(:has(article))\",\"action\":[\"style\",\"width: auto !important;\"]}","{\"selector\":\".section-lefttop-center:has(> .mule-today)\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\"div.section-leftmiddle-topmiddle.cf\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".xe_content\",\"action\":[\"style\",\"opacity: 1 !important;\"]}","{\"selector\":\".la\",\"action\":[\"style\",\"height: 75px !important; width: 75px !important; visibility: hidden !important;\"]}","{\"selector\":\".tabad\",\"action\":[\"style\",\"top: -100px !important;\"]}","{\"selector\":\"#top-sponsor\",\"action\":[\"style\",\"height: 60px !important; top: -60px !important; position: absolute !important; visibility: hidden !important;\"]}","{\"selector\":\"div[class*=\\\" \\\"]:has(+ div[class*=\\\" \\\"] > div > a[target=\\\"_blank\\\"][href^=\\\"https://\\\"])\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"#shortcutArea\",\"action\":[\"style\",\"height: auto !important; padding-left: 14px !important;\"]}\n{\"selector\":\"#shortcutArea\",\"action\":[\"style\",\"padding-left: 64px !important;\"]}\n{\"selector\":\"#topSearchWrap\",\"action\":[\"style\",\"padding-bottom: 50px !important;\"]}\n{\"selector\":\"div[class^=\\\"Layout-module_\\\"] #newsstand\",\"action\":[\"style\",\"margin-top: 0px !important;\"]}","{\"selector\":\"body.modal-open:has(> #academyMainModal a[href^=\\\"https://academy.prompie.com/banners/\\\"])\",\"action\":[\"style\",\"overflow: auto !important;\"]}","{\"selector\":\"#inner-content-body.hided\",\"action\":[\"style\",\"max-height: fit-content !important;\"]}","{\"selector\":\"#content-container\",\"action\":[\"style\",\"padding-top: 10px !important;\"]}","{\"selector\":\"#top-area > div[class*=\\\" \\\"] > div[class*=\\\" \\\"]:has(div:not([class]) ~ button)\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"div[style^=\\\"display:\\\"] > div[style^=\\\"flex-basis\\\"]:has(~ .fvideo) .news_box\",\"action\":[\"style\",\"width: revert-layer !important;\"]}\n{\"selector\":\"div[style^=\\\"display:\\\"] > div[style^=\\\"flex-basis\\\"]:has(~ .fvideo) .news_top\",\"action\":[\"style\",\"width: revert-layer !important;\"]}\n{\"selector\":\"div[style^=\\\"display:\\\"] > div[style^=\\\"flex-basis\\\"]:has(~ .fvideo)\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".post-contents > div[style]\",\"action\":[\"style\",\"height: 100% !important;\"]}","{\"selector\":\".container-content > section[class*=\\\" \\\"] ~ main[class*=\\\" \\\"]\",\"action\":[\"style\",\"margin-top: 50px !important;\"]}","{\"selector\":\"#map_area\",\"action\":[\"style\",\"height: 100% !important;\"]}","{\"selector\":\".inner-body.hided\",\"action\":[\"style\",\"overflow-y: auto !important; max-height: none !important;\"]}","{\"selector\":\"#mw_mobile > .mw_icon_box\",\"action\":[\"style\",\"margin-top: 25px !important;\"]}\n{\"selector\":\".main-top-banner + .box\",\"action\":[\"style\",\"margin-top: 0px !important;\"]}","{\"selector\":\".banner_slot_top + #container .article_cover\",\"action\":[\"style\",\"top: 100px !important;\"]}","{\"selector\":\".news-view-wrap\",\"action\":[\"style\",\"padding-top: 0px !important;\"]}","{\"selector\":\"#zzbang_img\",\"action\":[\"style\",\"display: block !important;\"]}","{\"selector\":\"#wrap > div[style*=\\\"height:\\\"][style^=\\\"position:\\\"] + header\",\"action\":[\"style\",\"margin-top: 0px !important;\"]}","{\"selector\":\"article > div[class^=\\\"sc-\\\"]\",\"action\":[\"style\",\"grid-template-columns: none !important;\"]}\n{\"selector\":\"body[style]\",\"action\":[\"style\",\"overflow: auto !important;\"]}","{\"selector\":\"html[style]\",\"action\":[\"style\",\"overflow: auto !important;\"]}","{\"selector\":\".bodyHide\",\"action\":[\"style\",\"height: auto !important;\"]}","{\"selector\":\".topBannerWrapper *\",\"action\":[\"style\",\"height: 1px !important;\"]}","{\"selector\":\".depthContentsWrap .productListWrap .searchList\",\"action\":[\"style\",\"margin-top: 0px !important;\"]}","{\"selector\":\"body\",\"action\":[\"style\",\"padding-top: 0px !important;\"]}","{\"selector\":\"#allKillItemList > .item_list_wrap\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"#mbnRoll_001 > .mbnRollUnit > .pagen_1\",\"action\":[\"style\",\"width: 239px !important;\"]}\n{\"selector\":\"#mbnRoll_001 > .mbnRollUnit > .pagen_2\",\"action\":[\"style\",\"width: 239px !important; left: 239px !important;\"]}\n{\"selector\":\"#mbnRoll_001 > .mbnRollUnit > .pagen_3\",\"action\":[\"style\",\"width: 239px !important; left: 478px !important;\"]}\n{\"selector\":\"#mbnRoll_001 > .mbnRollUnit > .pagen_4\",\"action\":[\"style\",\"width: 240px !important; left: 717px !important;\"]}\n{\"selector\":\"#mbnRoll_yNow > .mbnRollUnit > .pagen_1\",\"action\":[\"style\",\"width: 363px !important;\"]}\n{\"selector\":\"#mbnRoll_yNow > .mbnRollUnit > .pagen_2\",\"action\":[\"style\",\"width: 363px !important; left: 363px !important;\"]}\n{\"selector\":\"#mbnRoll_yNow > .mbnRollUnit > .pagen_3\",\"action\":[\"style\",\"width: 363px !important; left: 726px !important;\"]}\n{\"selector\":\"#yHeader .yesSearch .key_latest .lastest_word\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\"#ySContent .loginCont\",\"action\":[\"style\",\"margin-left: 200px !important;\"]}\n{\"selector\":\"#yWelMid .yWelNowBook ul\",\"action\":[\"style\",\"margin-left: calc(50% - 436px) !important;\"]}\n{\"selector\":\"#yWelMid .yWelNowBook\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\"#yWelTopMid .yWelTodayBook .tBCont .tBInfo .tb_readCon\",\"action\":[\"style\",\"width: calc(100% - 30px) !important;\"]}\n{\"selector\":\"#yWelTopMid .yWelTodayBook\",\"action\":[\"style\",\"width: calc(100% - 240px) !important;\"]}\n{\"selector\":\".mContRT .mbnZone\",\"action\":[\"style\",\"left: 94.5px !important;\"]}","{\"selector\":\"#entFlick\",\"action\":[\"style\",\"height: auto !important;\"]}","{\"selector\":\".article-adCover-div\",\"action\":[\"style\",\"height: 100% !important;\"]}","{\"selector\":\".content.partners-wrap\",\"action\":[\"style\",\"max-height: 100% !important;\"]}","{\"selector\":\".social-after-title\",\"action\":[\"style\",\"height: auto !important;\"]}","{\"selector\":\"#SirenDiv\",\"action\":[\"style\",\"display: block !important;\"]}","{\"selector\":\".body.mwcphide\",\"action\":[\"style\",\"height: 100% !important;\"]}","{\"selector\":\"#contentBody.bodyHide\",\"action\":[\"style\",\"height: 100% !important;\"]}","{\"selector\":\".content-full\",\"action\":[\"style\",\"height: auto !important;\"]}\n{\"selector\":\"body\",\"action\":[\"style\",\"overflow-x: auto !important; overflow-y: auto !important;\"]}","{\"selector\":\".content_body > div[class^=\\\"lotto_\\\"]\",\"action\":[\"style\",\"filter: none !important; -webkit-filter: none !important;\"]}\n{\"selector\":\".wrap.blocked .content_more_div\",\"action\":[\"style\",\"max-height: 100% !important;\"]}","{\"selector\":\".result_wrap\",\"action\":[\"style\",\"display: block !important;\"]}","{\"selector\":\".column_content\",\"action\":[\"style\",\"margin-top: 50px !important;\"]}","{\"selector\":\"#content .ad_parent\",\"action\":[\"style\",\"height: 100% !important; overflow: auto !important;\"]}","{\"selector\":\".respons-edit > div[style].float-left\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".grid-body.g-body\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\"header > .header-body\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"#journalist_card li\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".article_area .article_left\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".container .contents > .subcontents:nth-child(1)\",\"action\":[\"style\",\"margin-top: 0px !important;\"]}\n{\"selector\":\"html:not([data-n-head]) .contents > .headline\",\"action\":[\"style\",\"margin-top: 0px !important; height: 70px !important;\"]}","{\"selector\":\".article_area > .article_left\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".ask_hamburger_wrapper\",\"action\":[\"style\",\"top: 0px !important;\"]}\n{\"selector\":\".ask_wrapper .ask_title_zone\",\"action\":[\"style\",\"top: 0px !important;\"]}\n{\"selector\":\".ask_wrapper.not_host\",\"action\":[\"style\",\"top: 0px !important;\"]}\n{\"selector\":\"html\",\"action\":[\"style\",\"overflow: auto !important;\"]}","{\"selector\":\".expanded > #user-container\",\"action\":[\"style\",\"padding-top: 0px !important;\"]}","{\"selector\":\".mo-new-header .header .show-ads\",\"action\":[\"style\",\"max-height: 54px !important;\"]}","{\"selector\":\".bch-main-wrapper > .right-cont\",\"action\":[\"style\",\"margin-right: calc(50% - 180px) !important; width: 100% !important;\"]}","{\"selector\":\".content\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".article-ad ~ p[style][class^=\\\"title\\\"]\",\"action\":[\"style\",\"margin-top: 100px !important;\"]}","{\"selector\":\"#id_my_menu_area ~ #main_sky_banner_area\",\"action\":[\"style\",\"margin-left: 685px !important;\"]}\n{\"selector\":\"div[class^=\\\"main\\\"]#middle_area .academy.fleft:not(.iyua)\",\"action\":[\"style\",\"margin-left: calc(11.5%) !important;\"]}","{\"selector\":\".go_top.go_button\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".productDetailWrap > .contentsWrap\",\"action\":[\"style\",\"padding-bottom: 0px !important;\"]}","{\"selector\":\"#hotPlace.myBox\",\"action\":[\"style\",\"margin-left: calc(50% - 65px) !important;\"]}","{\"selector\":\".board_view .related_area\",\"action\":[\"style\",\"height: 300px !important;\"]}","{\"selector\":\"div[data-tiara-layer]:not([id])\",\"action\":[\"style\",\"margin-top: 0px !important; position: relative !important;\"]}","{\"selector\":\".td-pb-span8\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".site-footer\",\"action\":[\"style\",\"padding-bottom: 0px !important;\"]}\n{\"selector\":\"body .td-header-wrap\",\"action\":[\"style\",\"margin-top: 0px !important;\"]}","{\"selector\":\"div[style].clearfix > .nd-by-line\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".news_synthesis_sec .col.col_4\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".box__login #login_tab\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\".box__login .box__login-member\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".mod-top > .main-promo\",\"action\":[\"style\",\"margin-left: calc(50% - 205px) !important;\"]}","{\"selector\":\".global-top\",\"action\":[\"style\",\"top: 0px !important;\"]}\n{\"selector\":\".layout-main .main-menu\",\"action\":[\"style\",\"top: 0px !important;\"]}\n{\"selector\":\".layout-main .panel.no-margin\",\"action\":[\"style\",\"padding-top: 50px !important;\"]}","{\"selector\":\"#wrap_cnts td[valign=\\\"top\\\"] #wrap_ctgr_new > div[id]\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\"#wrap_cnts td[valign=\\\"top\\\"] #wrap_ctgr_new\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"body[data-elementor-device-mode=\\\"desktop\\\"] div[itemprop=\\\"mainContentOfPage\\\"]\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".news_doc #footer\",\"action\":[\"style\",\"position: static !important;\"]}","{\"selector\":\".td-is-sticky > .wpb_wrapper\",\"action\":[\"style\",\"top: 0px !important;\"]}","{\"selector\":\"#newsBody\",\"action\":[\"style\",\"height: auto !important;\"]}","{\"selector\":\"#hidden1\",\"action\":[\"style\",\"display: block !important;\"]}","{\"selector\":\"#popupBody #nonmember_all .button_login2\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\"#popupBody #nonmember_all .left1\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\"#welcomeMainBanner_welcome_tab\",\"action\":[\"style\",\"left: calc(50% - 186px) !important;\"]}","{\"selector\":\"div[class*=\\\"inner\\\"].column > div\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".inner-main [data-cloud*=\\\"_ad_\\\"] + div\",\"action\":[\"style\",\"margin-top: 0px !important;\"]}","{\"selector\":\"div[class^=\\\"premium-lawyer\\\"] ~ a.goto-all-lawyers\",\"action\":[\"style\",\"margin-top: 40px !important;\"]}\n{\"selector\":\"div[ng-if] > .lawyers-section.has-border-bottom\",\"action\":[\"style\",\"height: 250px !important;\"]}","{\"selector\":\"header .artc_ad\",\"action\":[\"style\",\"height: 130px !important;\"]}","{\"selector\":\"header\",\"action\":[\"style\",\"height: 100px !important;\"]}","{\"selector\":\".cs_news_area .cs_area\",\"action\":[\"style\",\"width: calc(100% - 2px) !important;\"]}\n{\"selector\":\"li.area_guide\",\"action\":[\"style\",\"width: 96% !important;\"]}","{\"selector\":\".contentBox > .topNews .icon-list\",\"action\":[\"style\",\"border-top: none !important;\"]}\n{\"selector\":\".contentBox > .topNews > .con-L\",\"action\":[\"style\",\"border-top: none !important;\"]}","{\"selector\":\"[class][itemtype*=\\\"//schema.org/\\\"] .markdown\",\"action\":[\"style\",\"max-width: 100% !important; flex-basis: 100% !important;\"]}\n{\"selector\":\"[class][itemtype*=\\\"//schema.org/\\\"] > .center\",\"action\":[\"style\",\"width: 100% !important; flex-basis: 100% !important;\"]}","{\"selector\":\".box-skin .mobile-popular\",\"action\":[\"style\",\"border-top: none !important;\"]}","{\"selector\":\".thisTimeNews > ul\",\"action\":[\"style\",\"border-right: none !important; width: 100% !important;\"]}","{\"selector\":\"#contentsBox #login_box\",\"action\":[\"style\",\"width: 350px !important; float: right !important; border-bottom: solid 2px #da3b40 !important; border-left: solid 2px #da3b40 !important;\"]}","{\"selector\":\".feature_index .box_user\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".wide_layout .wrap_srch_res .wrap_sort\",\"action\":[\"style\",\"width: auto !important;\"]}\n{\"selector\":\".wide_layout .wrap_srch_res .wrap_tab\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\".wide_layout .wrap_srch_res [class*=\\\"prod_type2\\\"]\",\"action\":[\"style\",\"width: 1275px !important; border-left: 1px solid #e4e4e4 !important; background-image: none !important;\"]}","{\"selector\":\".MapMain > #map\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"form[name=\\\"loginForm\\\"][action*=\\\"login.yp\\\"] > table\",\"action\":[\"style\",\"margin-left: calc(25% - 27px) !important;\"]}","{\"selector\":\"#index > div[id^=\\\"index_box\\\"][class]:not(.index_row_full)\",\"action\":[\"style\",\"margin-left: calc(50% - 145.5px) !important;\"]}","{\"selector\":\"#loginFormWrite\",\"action\":[\"style\",\"margin-left: 25% !important;\"]}\n{\"selector\":\".byWd .matchingContWrap\",\"action\":[\"style\",\"margin-top: 0px !important;\"]}","{\"selector\":\"header ~ header\",\"action\":[\"style\",\"margin-top: 50px !important;\"]}","{\"selector\":\".articleView + .aside .smallbox + .smallbox\",\"action\":[\"style\",\"border-top: none !important;\"]}","{\"selector\":\".content_area .todayBox\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".inner_contents\",\"action\":[\"style\",\"margin-bottom: 0px !important;\"]}","{\"selector\":\".top-keyword\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\"div[class^=\\\"ppom_newSub\\\"] .top_newSub .left_wt\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"#main_sec\",\"action\":[\"style\",\"margin-top: 100px !important;\"]}","{\"selector\":\".sect-movie-chart > ol:nth-child(2) > li\",\"action\":[\"style\",\"margin-left: 130px !important;\"]}\n{\"selector\":\".wrap-login > .sect-login\",\"action\":[\"style\",\"margin-left: calc(50% - 270px) !important;\"]}","{\"selector\":\"html[class*=\\\"pc-size\\\"] .m-contents > .side-area > .analysis-ranking1\",\"action\":[\"style\",\"top: 475px !important; left: auto !important; width: 100% !important;\"]}\n{\"selector\":\"html[class*=\\\"pc-size\\\"] .m-contents > .side-area > div:nth-child(-1n+4)\",\"action\":[\"style\",\"top: auto !important; left: auto !important;\"]}\n{\"selector\":\"html[class*=\\\"pc-size\\\"] .side-area + .m-guide\",\"action\":[\"style\",\"margin-bottom: 150px !important;\"]}","{\"selector\":\".news-cate + .news-box\",\"action\":[\"style\",\"padding-right: 0px !important;\"]}","{\"selector\":\"div[class~=\\\"hospital-images-box\\\"] ~ .row > .col-8\",\"action\":[\"style\",\"max-width: 100% !important; flex: none !important;\"]}","{\"selector\":\"table[style][width][cellspacing][cellpadding] tr[valign] > td[style] > div[style]\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".gdl-page-item\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"div[style].row.no-gutters > .col-6\",\"action\":[\"style\",\"max-width: 75% !important; flex-basis: 75% !important;\"]}","{\"selector\":\"#primary\",\"action\":[\"style\",\"width: 100% !important\"]}","{\"selector\":\".ebs_item .inner > div[class]\",\"action\":[\"style\",\"width: 50% !important;\"]}","{\"selector\":\"header.main-header\",\"action\":[\"style\",\"top: 0px !important;\"]}","{\"selector\":\".bot-content-area .mid-util-wrap > div\",\"action\":[\"style\",\"width: calc(50% - 5px) !important;\"]}","{\"selector\":\".errorlay .new-login-warp\",\"action\":[\"style\",\"padding-top: 20px !important; margin-left: calc(50% - 232.5px) !important;\"]}","{\"selector\":\"#pnlContainer .con_b > .reply_b\",\"action\":[\"style\",\"margin: 0px auto !important;\"]}","{\"selector\":\".wrap_home .section_spot .best_qna_wrap\",\"action\":[\"style\",\"width: 100% !important;\"]}\n{\"selector\":\".wrap_home .section_spot\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"#contentmemo ~ .adsbygoogle > div[style^=\\\"font-size:\\\"]\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"#section_body\",\"action\":[\"style\",\"border-top: none !important;\"]}","{\"selector\":\".content_join\",\"action\":[\"style\",\"margin-left: calc(50% - 200px) !important;\"]}","{\"selector\":\"#body_wrap > #body_main > div[style]:nth-child(1), #body_wrap > #body_main > div[style]:nth-child(3)\",\"action\":[\"style\",\"width: calc(50% - 5px) !important;\"]}","{\"selector\":\"#header\",\"action\":[\"style\",\"margin-bottom: 0px !important;\"]}\n{\"selector\":\".area_ranking\",\"action\":[\"style\",\"top: 400px !important;\"]}","{\"selector\":\".login_inputbox .inner\",\"action\":[\"style\",\"width: calc(100% - 115px) !important;\"]}\n{\"selector\":\".login_inputbox\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"#searchArea .title_wrap\",\"action\":[\"style\",\"width: calc(100% - 50px) !important;\"]}\n{\"selector\":\"#searchArea .viewType_L .product_list li .prd_info\",\"action\":[\"style\",\"width: 700px !important;\"]}\n{\"selector\":\".wrap_list .standard\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".banner-open .contents\",\"action\":[\"style\",\"padding-top: 68px !important;\"]}","{\"selector\":\".content\",\"action\":[\"style\",\"margin-top: 0px !important;\"]}","{\"selector\":\".goods_list_tit\",\"action\":[\"style\",\"padding-top: 0px !important;\"]}","{\"selector\":\"div.sc-64vosk-0.jIkGEl\",\"action\":[\"style\",\"margin-bottom: 10px !important;\"]}","{\"selector\":\".user_view\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\".erd-container\",\"action\":[\"style\",\"width: 100% !important;\"]}","{\"selector\":\"header\",\"action\":[\"style\",\"top: 0px !important;\"]}","{\"selector\":\"body\",\"action\":[\"style\",\"overflow: auto !important;\"]}","{\"selector\":\"header .row[style]\",\"action\":[\"style\",\"margin-bottom: 35px !important;\"]}"];
const argsSeqs = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,-30,31,31,32,33,-34,67,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,-67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133];
const hostnamesMap = new Map([["search.daum.net",1],["news.daum.net",2],["search.shopping.naver.com",3],["bbs.ruliweb.com",4],["koreatimes.net",5],["ponh.info",6],["5donews.co.kr",7],["mule.co.kr",8],["meeco.kr",9],["aagag.com",10],["t.hi098123.com",11],["boardlife.co.kr",12],["lawtimes.co.kr",13],["www.naver.com",14],["academy.prompie.com",15],["ggulzam.zal.kr",16],["economist.co.kr",17],["tftps.gg",18],["fow.kr",19],["3277532532.reviewtoday.net",20],["maple.gg",21],["courtauctionmap.com",22],["jovelys.ulog.kr",23],["coolfun.zal.kr",23],["etoland.co.kr",24],["m.hub.zum.com",25],["enterdiary.com",26],["hotplacehunter.co.kr",26],["mystylezip.com",26],["carandmore.co.kr",26],["maxmovieen.com",26],["tenbizt.com",26],["mobilitytv.co.kr",26],["thehousemagazine.kr",26],["tminews.co.kr",26],["capress.kr",26],["youtu.co",26],["dfast.kr",26],["mememedia.co.kr",26],["newautopost.co.kr",26],["gall.dcinside.com",27],["m.sports.chosun.com",28],["m.sportschosun.com",28],["atlantachosun.com",29],["issueclick.kr",30],["curiosityblog.co.kr",32],["m.shop.interpark.com",33],["shopping.interpark.com",34],["ygosunews.com",35],["www.auction.co.kr",37],["yes24.com",38],["m.ytn.co.kr",39],["ktestone.com",40],["chchclub.com",41],["thepumpkin.io",42],["withcast.co.kr",43],["3.37.104.109",44],["donthellgo.com",45],["marupost.mycafe24.com",46],["lottoen.com",47],["simcong.com",48],["gorani.kr",49],["dodot.cafe24.com",50],["loapost.cafe24.com",50],["jiavr.xyz",50],["ohohz.cafe24.com",50],["bloter.net",51],["news.unn.net",52],["www.donga.com",53],["heraldpop.com",54],["chaoscube.co.kr",55],["news.heraldcorp.com",56],["heraldcorp.com",56],["pushoong.com",57],["topstarnews.net",58],["m.inven.co.kr",59],["blockchainhub.kr",60],["ppss.kr",61],["wowtv.co.kr",62],["kidkids.net",63],["m.ruliweb.com",64],["lotteon.com",65],["evape.kr",66],["fomos.kr",67],["focus.daum.net",68],["autopostkorea.com",69],["newdaily.co.kr",71],["mk.co.kr",72],["memberssl.auction.co.kr",73],["auction.co.kr",74],["orbi.kr",75],["web.humoruniv.com",76],["haninvegas.com",77],["news.jtbc.co.kr",78],["sundaynewsusa.com",79],["instructivehumility.com",80],["news.oasisfeed.com",80],["ydailynewsis.blogspot.com",81],["aladin.co.kr",82],["kharn.kr",83],["v.daum.net",84],["lawtalk.co.kr",85],["medipana.com",86],["dailypharm.com",87],["~m.dailypharm.com",87],["drapt.com",88],["koreadaily.com",89],["hashcode.co.kr",90],["pinpointnews.co.kr",91],["news.nate.com",92],["uwayapply.com",93],["encar.com",94],["shoppinghow.kakao.com",95],["diningcode.com",96],["ypbooks.co.kr",97],["serieamania.com",98],["jobkorea.co.kr",99],["joynews24.com",100],["inews24.com",100],["~m.joynews24.com",100],["~m.inews24.com",100],["newsis.com",101],["unsin.co.kr",102],["fnnews.com",103],["ppomppu.co.kr",104],["all-mice.co.kr",105],["cgv.co.kr",106],["paxnet.co.kr",107],["bigkinds.or.kr",108],["modoodoc.com",109],["noteforum.co.kr",110],["miraetv.net",111],["sports.chosun.com",112],["funnyissue.com",113],["googlewph.com",113],["gyeomipang.co.kr",113],["www.ebs.co.kr",114],["megabox.co.kr",115],["quasarzone.com",116],["edit.incruit.com",117],["m.nocutnews.co.kr",118],["kin.naver.com",119],["te31.com",120],["news.naver.com",121],["sso.pping.kr",122],["edufindkorea.com",123],["www.nate.com",124],["sign.dcinside.com",125],["compuzone.co.kr",126],["toomics.com",127],["windowsforum.kr",128],["berryjam.co.kr",129],["community.rememberapp.co.kr",130],["ruliweb.com",131],["www.erdcloud.com",132],["spotv120.com",133],["spotv121.com",133],["spotv122.com",133],["spotv123.com",133],["spotv124.com",133],["spotv125.com",133],["spotv126.com",133],["spotv127.com",133],["spotv128.com",133],["spotv129.com",133],["spotv130.com",133],["spotv131.com",133],["spotv132.com",133],["spotv133.com",133],["spotv134.com",133],["spotv135.com",133],["spotv136.com",133],["spotv137.com",133],["spotv138.com",133],["newtoki466.com",134],["newtoki467.com",134],["newtoki468.com",134],["newtoki489.com",134],["newtoki490.com",134],["newtoki491.com",134],["newtoki492.com",134],["newtoki493.com",134],["newtoki494.com",134],["newtoki495.com",134],["newtoki496.com",134],["newtoki497.com",134],["newtoki498.com",134],["2cpu.co.kr",135]]);
const hasEntities = false;

self.declarativeImports = self.declarativeImports || [];
self.declarativeImports.push({ argsList, argsSeqs, hostnamesMap, hasEntities });

/******************************************************************************/

})();

/******************************************************************************/
