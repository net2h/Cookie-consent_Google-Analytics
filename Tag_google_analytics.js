let tagAnalytics = {};

window.rgpd_cookie_pub = true;
window.rgpd_cookie_site = true;
window.rgpd_cookie_tier = true;
window.rgpd_cookie_analytic = true;

const dndActive = false;

tagAnalytics.CookieConsent = function() {
    let firstCall = false;
    let domaineName = '';

    function getCookieExpireDate() {
        let cookieTimeout = 33696000000;// 13 mois
        let date = new Date();
        date.setTime(date.getTime() + cookieTimeout);
        return "; expires=" + date.toGMTString();
    }

    function getDomainName() {
        if (domaineName !== '') {
            return domaineName;
        } else {
            let hostname = document.location.hostname;
            if (hostname.indexOf("www.") === 0) {
                hostname = hostname.substring(4);
            }
            return hostname;
        }
    }

    function getCookieDomainName() {
        let hostname = getDomainName();
        return "domain=" + "." + hostname;
    }

    function checkFirstVisit() {
        let consentCookie = getCookie('hasConsent');
        if (!consentCookie) {
            return true;
        }
    }

    function showBanner() {
        let bodytag = document.getElementsByTagName('body')[0];
        let div = document.createElement('div');
        div.setAttribute('id', 'cookie-banner');
        div.setAttribute('class', 'fixed b0 l0 z999 w100P center pad100 fn07 blanc font12 bb ombre animated1 slideInUp');
        div.innerHTML = localisation.bannerContentHTML;
        bodytag.insertBefore(div, bodytag.firstChild);
        document.getElementsByTagName('body')[0].className += ' cookiebanner';
    }

    function getCookie(NameOfCookie) {
        if (document.cookie.length > 0) {
            begin = document.cookie.indexOf(NameOfCookie + "=");
            if (begin !== -1) {
                let begin;
                begin += NameOfCookie.length + 1;
                let end = document.cookie.indexOf(";", begin);
                if (end === -1) {
                    end = document.cookie.length;
                }
                return decodeURIComponent(document.cookie.substring(begin, end));
            }
        }
        return null;
    }

    function getCookieValue(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function getInternetExplorerVersion() {
        let rv = -1;
        if (navigator.appName === 'Microsoft Internet Explorer') {
            let ua = navigator.userAgent;
            let re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) !== null) {
                rv = parseFloat(RegExp.$1);
            }
        } else if (navigator.appName === 'Netscape') {
            let ua = navigator.userAgent;
            let re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) !== null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        return rv;
    }


    function askDNTConfirmation() {
        return confirm(localisation.dntConfirmation)
    }

    function notToTrack() {
        if (dndActive === true) {
            if ((navigator.doNotTrack && (navigator.doNotTrack === 'yes' || navigator.doNotTrack === '1')) || ( navigator.msDoNotTrack && navigator.msDoNotTrack === '1')) {
                let isIE = (getInternetExplorerVersion() !== -1);
                if (!isIE) {
                    return true;
                } else {
                    return askDNTConfirmation();
                }
            }
        } else {
            return false;
        }
    }

    function isToTrack() {
        if (dndActive === true) {
            if (navigator.doNotTrack && (navigator.doNotTrack === 'no' || navigator.doNotTrack === 0 )) {
                return true;
            }
        } else {
            return false;
        }
    }

    function delCookie(name) {
        let path = ";path=" + "/";
        let expiration = "Thu, 01-Jan-1970 00:00:01 GMT";
        document.cookie = name + "=" + path + " ; " + getCookieDomainName() + ";expires=" + expiration;
    }

    function deleteAnalyticsCookies() {
        let cookieNames = ["__utma", "__utmb", "__utmc", "__utmz", "_ga", "_gat"];
        for (let i = 0; i < cookieNames.length; i++) {
            delCookie(cookieNames[i])
        }
    }

    // function isClickOnOptOut(evt) {
    //     console.log(evt.target.id);
    //     console.log(evt.target.parentNode.id);
    //
    //
    //
    //     return (
    //         evt.target.id === 'gerercookie' ||
    //         evt.target.parentNode.id === 'popContent' ||
    //         evt.target.parentNode.id === 'cookie-banner' ||
    //         //evt.target.parentNode.parentNode.id === 'cookie-banner' ||
    //         evt.target.id === 'optout-button'
    //     )
    // }

    function isClickOnOptOut(evt) {
        if(typeof evt !== 'undefined'){
            return (evt.target.parentNode.id == 'cookie-banner' || evt.target.id == 'optout-button')
        }
    }

    function setCookie(name, value) {
        document.cookie = name + '=' + value + ';' + getCookieExpireDate() + ' ; ' + getCookieDomainName() + ' ; path=/';
    }

    function consent(evt) {
        if (!isClickOnOptOut(evt)) {
            if (!clickprocessed) {
                if(typeof evt !== 'undefined'){
                    evt.preventDefault();
                }
                setCookie('hasConsent', true);
                setCookie('rgpd_cookie_site', window.rgpd_cookie_site);
                setCookie('rgpd_cookie_analytic', window.rgpd_cookie_analytic);
                setCookie('rgpd_cookie_tier', window.rgpd_cookie_tier);
                setCookie('rgpd_cookie_pub', window.rgpd_cookie_pub);
                clickprocessed = true;
                window.setTimeout(function() {
                    if(typeof evt !== 'undefined') {
                        evt.target.click();
                    }
                }, 1000)
            }
        }
    }

    return {

        // La fonction d'opt-out
        gaOptout: function() {
            setCookie('hasConsent', false);
            setCookie('rgpd_cookie_site', true);
            setCookie('rgpd_cookie_analytic', true);
            setCookie('rgpd_cookie_tier', false);
            setCookie('rgpd_cookie_pub', false);
            this.init();

            let div = document.getElementById('cookie-banner');
            clickprocessed = true;
            if (div !== null) {
                div.innerHTML = '<div style="background-color:#fff;text-align:center;padding:5px;font-size:12px;border-bottom:1px solid #eeeeee;" id="cookie-message"> ' + localisation.gaOptOut + ' </div>';
            }
            deleteAnalyticsCookies();
        },

        hideBanner: function() {
            let div = document.getElementById("cookie-banner");
            div.style.display = "none";
        },

        showInform: function() {
            if (location.hostname === 'croisieres.cdiscount.com')
            {
                window.open('https://www.cdiscount.com/vie-privee-et-cookies.html', '_blank');
            }
            else
            {
                window.location.href = location.protocol + '//' + location.hostname + localisation.personalizeLink;
            }
        },


        hideInform: function() {
            let div1 = document.getElementById("cookie-banner");
            if (null !== div1) {
                div1.style.display = "none";
            }
            ferme();
        },

        changeRgpdSettings: function(name, value) {
            window[name] = value;
        },
        gaTrigger: function() {
            let rgpd_cookie_analytic = getCookieValue('rgpd_cookie_analytic');
            let rgpd_cookie_pub = getCookieValue('rgpd_cookie_pub');
            if (rgpd_cookie_analytic === 'true') {
                if ('undefined' !== typeof(dataLayer)) {
                    console.log('ANALYTICS CONSENT');
                    dataLayer.push({'event': 'cookieconsent_analytic'});
                }
            }

            if (rgpd_cookie_pub === 'true') {
                if ('undefined' !== typeof(dataLayer)) {
                    console.log('PUB CONSENT');
                    dataLayer.push({'event': 'cookieconsent_pub'});
                }
            }
        },

        init: function() {

            let analyticsCookie = getCookieValue('rgpd_cookie_analytic');
            let pubCookie = getCookieValue('rgpd_cookie_pub');
            let siteCookie = getCookieValue('rgpd_cookie_site');
            let tierCookie = getCookieValue('rgpd_cookie_tier');

            let elCookieTier = document.getElementById("rgpd_cookie_tier");
            let elCookieAnal = document.getElementById("rgpd_cookie_analytics");
            let elCookiePub = document.getElementById("rgpd_cookie_pub");
            let elCookieSite = document.getElementById("rgpd_cookie_site");

            if (pubCookie !== '') {
                window.rgpd_cookie_pub = pubCookie;
            }
            if (siteCookie !== '') {
                window.rgpd_cookie_site = siteCookie;
            }
            if (tierCookie !== '') {
                window.rgpd_cookie_tier = tierCookie;
            }
            if (analyticsCookie !== '') {
                window.rgpd_cookie_analytic = analyticsCookie;
            }

            if (null !== elCookieTier) {
                if (tierCookie === 'false') {
                    elCookieTier.classList.add('off');
                } else {
                    elCookieTier.classList.add('on');
                }
            }

            if (null !== elCookieAnal) {
                if (analyticsCookie === 'false') {
                    elCookieAnal.classList.add('off');
                } else {
                    elCookieAnal.classList.add('on');
                }
            }
            if (null !== elCookiePub) {
                if (pubCookie === 'false') {
                    elCookiePub.classList.add('off');
                } else {
                    elCookiePub.classList.add('on');
                }
            }
            if (null !== elCookieSite) {
                if (siteCookie === 'false') {
                    elCookieSite.classList.add('off');
                } else {
                    elCookieSite.classList.add('on');
                }
            }
        },

        saveConsent: function() {
            setCookie('hasConsent', true);
            setCookie('rgpd_cookie_site', window.rgpd_cookie_site);
            setCookie('rgpd_cookie_analytic', window.rgpd_cookie_analytic);
            setCookie('rgpd_cookie_tier', window.rgpd_cookie_tier);
            setCookie('rgpd_cookie_pub', window.rgpd_cookie_pub);
            this.gaTrigger();
        },

        start: function() {
            let consentCookie = getCookieValue('hasConsent');
            clickprocessed = false;
            if (!consentCookie) {
                if (notToTrack()) {
                    tagAnalytics.CookieConsent.gaOptout();
                    alert(localisation.alertDnd)
                } else {
                    if (isToTrack()) {
                        consent();
                    } else {
                        if (window.addEventListener) {
                            // Standard browsers
                            if (location.pathname !== localisation.personalizeLink) {
                                window.addEventListener("load", showBanner, false);
                            }
                            document.addEventListener("click", consent, false);
                        } else {
                            if (location.pathname !== localisation.personalizeLink) {
                                window.addEventListener("load", showBanner, false);
                            }
                            document.attachEvent("onclick", consent);
                        }
                    }
                }
            }
            this.gaTrigger();
        }
    }

}();

tagAnalytics.CookieConsent.start();
