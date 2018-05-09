let tagAnalyticsCNIL = {};

tagAnalyticsCNIL.CookieConsent = function () {
    let gaProperty = 'UA-XXXXXX-Y ';
    // Désactive le tracking si le cookie d’Opt-out existe déjà.
    let disableStr = 'ga-disable-' + gaProperty;
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
            if (hostname.indexOf("www.") === 0)
                hostname = hostname.substring(4);
            return hostname;
        }
    }

    function getCookieDomainName() {
        let hostname = getDomainName();
        return "domain=" + "." + hostname;
    }

    //Cette fonction vérifie si on  a déjà obtenu le consentement de la personne qui visite le site
    function checkFirstVisit() {
        let consentCookie = getCookie('hasConsent');
        if (!consentCookie) return true;
    }

    //Affiche une  bannière d'information en haut de la page
    function showBanner() {
        let bodytag = document.getElementsByTagName('body')[0];
        let div = document.createElement('div');
        div.setAttribute('id', 'cookie-banner');
        div.setAttribute('width', '70%');
        div.innerHTML = '<div style="background-color:#fff;text-align:center;padding:5px;font-size:12px;border-bottom:1px solid #eeeeee;" id="cookie-banner-message" align="center">Ce site utilise Google Analytics.\
		En continuant à naviguer, vous nous autorisez à déposer un cookie à des fins de \
		mesure d\'audience. \
		<a href="javascript:tagAnalyticsCNIL.CookieConsent.showInform()" style="text-decoration:underline;"> En savoir plus ou s\'opposer</a>.</div>';
        bodytag.insertBefore(div, bodytag.firstChild); // Ajoute la banniére juste au début de la page
        document.getElementsByTagName('body')[0].className += ' cookiebanner';
        createInformAndAskDiv();
    }


    function getCookie(NameOfCookie) {
        if (document.cookie.length > 0) {
            begin = document.cookie.indexOf(NameOfCookie + "=");
            if (begin !== -1) {
                let begin;
                begin += NameOfCookie.length + 1;
                let end = document.cookie.indexOf(";", begin);
                if (end === -1) end = document.cookie.length;
                return decodeURIComponent(document.cookie.substring(begin, end));
            }
        }
        return null;
    }


    function getInternetExplorerVersion() {
        let rv = -1;
        if (navigator.appName === 'Microsoft Internet Explorer') {
            let ua = navigator.userAgent;
            let re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) !== null)
                rv = parseFloat(RegExp.$1);
        } else if (navigator.appName === 'Netscape') {
            let ua = navigator.userAgent;
            let re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) !== null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    }


    function askDNTConfirmation() {
        return confirm("La signal DoNotTrack de votre navigateur est activé, confirmez vous activer la fonction DoNotTrack?")
    }

    //Vérifie la valeur de navigator.DoNotTrack pour savoir si le signal est activé et est à 1
    function notToTrack() {
        if ((navigator.doNotTrack && (navigator.doNotTrack === 'yes' || navigator.doNotTrack === '1')) || ( navigator.msDoNotTrack && navigator.msDoNotTrack === '1')) {
            let isIE = (getInternetExplorerVersion() !== -1);
            if (!isIE) {
                return true;
            } else {
                return askDNTConfirmation();
            }
        }
    }

    //Si le signal est à 0 on considére que le consentement a déjà été obtenu
    function isToTrack() {
        if (navigator.doNotTrack && (navigator.doNotTrack === 'no' || navigator.doNotTrack === 0 )) {
            return true;
        }
    }

    // Fonction d'effacement des cookies
    function delCookie(name) {
        let path = ";path=" + "/";


        let expiration = "Thu, 01-Jan-1970 00:00:01 GMT";
        document.cookie = name + "=" + path + " ; " + getCookieDomainName() + ";expires=" + expiration;
    }

    // Efface tous les types de cookies utilisés par Google Analytics
    function deleteAnalyticsCookies() {
        let cookieNames = ["__utma", "__utmb", "__utmc", "__utmz", "_ga", "_gat"];
        for (let i = 0; i < cookieNames.length; i++)
            delCookie(cookieNames[i])
    }

    //La fonction qui informe et demande le consentement. Il s'agit d'un div qui apparait au centre de la page
    function createInformAndAskDiv() {
        let bodytag = document.getElementsByTagName('body')[0];
        let div = document.createElement('div');
        div.setAttribute('id', 'inform-and-ask');
        div.style.width = window.innerWidth + "px";
        div.style.height = window.innerHeight + "px";
        div.style.display = "none";
        div.style.position = "fixed";
        div.style.zIndex = "100000";
        // Le code HTML de la demande de consentement
        // Vous pouvez modifier le contenu ainsi que le style
        div.innerHTML = '<div style="width: 300px; background-color: white; repeat scroll 0% 0% white; border: 1px solid #cccccc; padding :10px 10px;text-align:center; position: fixed; top:30px; left:50%; margin-top:0; margin-left:-150px; z-index:100000; opacity:1" id="inform-and-consent">\
		<div><span><b>Les cookies Google Analytics</b></span></div><br><div>Ce site utilise  des cookies de Google Analytics,\
		ces cookies nous aident à identifier le contenu qui vous interesse le plus ainsi qu\'à repérer certains \
		dysfonctionnements. Vos données de navigations sur ce site sont envoyées à Google Inc</div><div style="padding :10px 10px;text-align:center;"><button style="margin-right:50px;text-decoration:underline;" \
		name="S\'opposer" onclick="tagAnalyticsCNIL.CookieConsent.gaOptout();tagAnalyticsCNIL.CookieConsent.hideInform();" id="optout-button" >S\'opposer</button><button style="text-decoration:underline;" name="cancel" onclick="tagAnalyticsCNIL.CookieConsent.hideInform()" >Accepter</button></div></div>';
        bodytag.insertBefore(div, bodytag.firstChild); // Ajoute la banniére juste au début de la page
    }


    function isClickOnOptOut(evt) { // Si le noeud parent ou le noeud parent du parent est la banniére, on ignore le clic
        return (evt.target.parentNode.id === 'cookie-banner' || evt.target.parentNode.parentNode.id === 'cookie-banner' || evt.target.id === 'optout-button')
    }

    function consent(evt) {
        if (!isClickOnOptOut(evt)) { // On vérifie qu'il ne s'agit pas d'un clic sur la banniére
            if (!clickprocessed) {
                evt.preventDefault();
                document.cookie = 'hasConsent=true; ' + getCookieExpireDate() + ' ; ' + getCookieDomainName() + ' ; path=/';
                callGoogleAnalytics();
                clickprocessed = true;
                window.setTimeout(function () {
                    evt.target.click();
                }, 1000)
            }
        }
    }

    // Cette fonction en test permet de faire une call GA  afin de pouvoir compter le nombre de visite sans faire de suivi des utilisateurs (fonction en cours de test)
    // Cela crée un evenement page qui est consultable depuis le panneau evenement de GA
    // Potentiellement cette méthode pourrait être utilisé pour comptabiliser les click sur l'opt-out
    function callGABeforeConsent() {
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', '__gaTracker');
        // Ici on desactive les cookie
        __gaTracker('create', gaProperty, {'storage': 'none', 'clientId': '0'});
        __gaTracker('send', 'event', 'page', 'load', {'nonInteraction': 1});
    }


    // Tag Google Analytics, cette version est avec le tag Universal Analytics
    function callGoogleAnalytics() {
        if (firstCall) return;
        else firstCall = true;
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', gaProperty, 'auto');  // Replace with your property ID.
        ga('send', 'pageview');
    }

    return {

        // La fonction d'opt-out
        gaOptout: function () {
            document.cookie = disableStr + '=true;' + getCookieExpireDate() + ' ; ' + getCookieDomainName() + ' ; path=/';
            document.cookie = 'hasConsent=false;' + getCookieExpireDate() + ' ; ' + getCookieDomainName() + ' ; path=/';
            let div = document.getElementById('cookie-banner');
            // on considère que le site a été visité
            clickprocessed = true;
            // Ci dessous le code de la bannière affichée une fois que l'utilisateur s'est opposé au dépot
            // Vous pouvez modifier le contenu et le style
            if (div !== null) div.innerHTML = '<div style="background-color:#fff;text-align:center;padding:5px;font-size:12px;border-bottom:1px solid #eeeeee;" id="cookie-message"> Vous vous êtes opposé \
			au dépôt de cookies de mesures d\'audience dans votre navigateur </div>';
            window[disableStr] = true;
            deleteAnalyticsCookies();
        },


        showInform: function () {
            let div = document.getElementById("inform-and-ask");
            div.style.display = "";
        },


        hideInform: function () {
            let div = document.getElementById("inform-and-ask");
            div.style.display = "none";
            let div1 = document.getElementById("cookie-banner");
            div1.style.display = "none";
        },


        start: function () {
            //Ce bout de code vérifie que le consentement n'a pas déjà été obtenu avant d'afficher
            // la bannière
            let consentCookie = getCookie('hasConsent');
            clickprocessed = false;
            if (!consentCookie) {//L'utilisateur n'a pas encore de cookie, on affiche la banniére et si il clique sur un autre élément que la banniére, on enregistre le consentement
                if (notToTrack()) { //L'utilisateur a activé DoNotTrack. Do not ask for consent and just opt him out
                    tagAnalyticsCNIL.CookieConsent.gaOptout();
                    alert("You've enabled DNT, we're respecting your choice")
                } else {
                    if (isToTrack()) { //DNT is set to 0, no need to ask for consent just set cookies
                        consent();
                    } else {
                        if (window.addEventListener) { // See note https://github.com/CNILlab/Cookie-consent_Google-Analytics/commit/e323b3be2c4a4d05300e35cdc11102841abdcbc9
                            // Standard browsers
                            window.addEventListener("load", showBanner, false);
                            document.addEventListener("click", consent, false);
                        } else {
                            window.attachEvent("onload", showBanner);
                            document.attachEvent("onclick", consent);
                        }
                        callGABeforeConsent()
                    }
                }
            } else {
                if (document.cookie.indexOf('hasConsent=false') > -1)
                    window[disableStr] = true;
                else
                    callGoogleAnalytics();
            }
        }
    }

}();

tagAnalyticsCNIL.CookieConsent.start();
