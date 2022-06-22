/* The Multilingualizer, copyright Matiogi Ltd.

For more info visit www.multilingualizer.com

GDPR compliance: We store a cookie called 'language' for 30 days, solely for the purpose of user interface customisation. This cookie is in full compliance with GDPR. 

For more info, visit http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm and search for 'user interface customisation'

*/
var jQueryScriptOutputted = false;
var mllastrun = Date.now();
var totalupdates = 0;
var recheckpulse = 0;
var resizeruns = 5;
var ct = new Date().getTime();
var firstdocmod = true;
var mllastmutated = (Date.now() - 5000);
var mutated = true;
var currentlyrunning = false;
var mltextblockboundary = '....';
var mlsecondtextblockboundary = '';
var mlresized = false;
var urlpath = window.location.href;
var jQuery3loaded = false;
var useralteredform = false;
var recheckfrequency = 0;
var mlobserver;
var mlrechecktrigger;
var currentlanguage;
var currentpagelanguageindex = 0;

if (typeof forcenonburger === 'undefined') {
	var forcenonburger = true;
}
if ((typeof Y !== 'undefined' && Y.Lang.isValue(Static.SQUARESPACE_CONTEXT.authenticatedAccount)) || document.getElementsByClassName('w-editor-body').length > 0) {
	console.log('not running multilingualizer because logged in as admin');
} else {

	function writeHeadTags(mlLangs) {
		var langs = [], metaTranslate = document.createElement('meta');
		metaTranslate.setAttribute('name', 'google');
		metaTranslate.setAttribute('value', 'notranslate');
		metaTranslate.setAttribute('content', 'notranslate');
		document.head.appendChild(metaTranslate);
		for (var mllangkey in mlLangs){
			if (mlLangs.hasOwnProperty(mllangkey)) {
				langs.push(get2digitlanguage(mllangkey));
			}
		}
		langs.forEach(
			function(l) {
				var langTag = document.createElement('link');
				langTag.setAttribute('rel', 'alternate');
				langTag.setAttribute('hreflang', l);
				langTag.setAttribute('href',  window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + '?lang=' + l);
				document.head.appendChild(langTag);
			}
		);
	}

	function setHtmlLang(currentlanguage) {
		for (var mllangkey in mllanguages){
			if (mllanguages.hasOwnProperty(mllangkey)) {
				//console.log('current language: ' + currentlanguage);
				//console.log('mllanguage:' + mllanguages[mllangkey]);
				//console.log('2digit:' + get2digitlanguage(mllangkey));
				if (mllanguages[mllangkey] === currentlanguage) {
                    document.documentElement.setAttribute('lang', get2digitlanguage(mllangkey));
                    jQuery('.ml-langspecificpage').addClass('ml-hidelangspecificpage');
                    jQuery('.ml-langspecificpage-' + get2digitlanguage(mllangkey).toUpperCase()).removeClass('ml-hidelangspecificpage');
                    jQuery('.ml-langspecificpage-' + get2digitlanguage(mllangkey).toLowerCase()).removeClass('ml-hidelangspecificpage');
				}
			}
		}
	}
    jQuery(function() {  
        // do anything that needs to be done on document.ready
        // don't really need this dom ready thing if used in footer
        if (!Date.now) {
          Date.now = function() { return new Date().getTime(); };
        }      
        
        (function(jQuery){jQuery.fn.replaceText=function(b,a,c){return this.each(function(){var f=this.firstChild,g,e,d=[];if(f){do{if(f.nodeType===3){g=f.nodeValue;e=g.replace(b,a);if(e!==g){if(!c&&/</.test(e)){jQuery(f).before(e);d.push(f)}else{f.nodeValue=e}}}}while(f=f.nextSibling)}d.length&&jQuery(d).remove()})}})(jQuery);
        jQuery.expr[':'].hasNoText = function(obj) {
            return jQuery.trim(jQuery(obj).text()).length === 0;
        };
        
        jQuery.fn.sortByDepth = function() {
            var ar = this.map(function() {
                    return {length: jQuery(this).parents().length, elt: this};
                }).get(),
                result = [],
                i = ar.length;


            ar.sort(function(a, b) {
                return a.length - b.length;
            });

            while (i--) {
                result.push(ar[i].elt);
            }
            return jQuery(result);
        };	
        (function(jQuery){
            /*if (typeof(jQuery(document).on) != 'undefined') {
                jQuery(document).on('click', 'a', function() {
                    jQuery('#multilingualizerloadingscreen').removeClass('loaded');
                });
            } else {
                $(document).on('click', 'a', function() {
                    jQuery('#multilingualizerloadingscreen').removeClass('loaded');
                });

            }*/
            jQuery.browserLanguage = function(callback){
             var language;
             try {
                 language = navigator.language.toLowerCase().substring(0,2);
             } catch (e) {
                 
             }
             callback(languageLookup[language]);
            };

            /*
            Language list from http://en.wikipedia.org/wiki/ISO_639-1_language_matrix
            */
            for (var mllangkey in mllanguages){
                if (mllanguages.hasOwnProperty(mllangkey)) {
                    tlang = get2digitlanguage(mllangkey);
                    if (typeof(jQuery(document).on) != 'undefined') {							
                        jQuery(document).on('click', 'a[href$="?lang=' + tlang + '"]', function() {
                            thref = jQuery(this).attr('href');
                            tlang = thref.substr(thref.length - 2);
                            tlangindex = mllanguages[languageLookup[tlang]];
                            languageClicked(tlangindex);
                        });
                    } else {
                        $(document).on('click', 'a[href$="?lang=' + tlang + '"]', function() {
                            thref = jQuery(this).attr('href');
                            tlang = thref.substr(thref.length - 2);
                            tlangindex = mllanguages[languageLookup[tlang]];
                            languageClicked(tlangindex);
                        });
                    }								
                }
            }
            jQuery('body').append('<div id="mlbranding"><a target="_blank" href="https://www.multilingualizer.com/multilingualizer-enabled/?client=' + encodeURI(window.location.href) + '"><img src="https://www.multilingualizer.com/assets/multilingualizer-tinylogo.png" title="Multilingualizer - make any website multilingual"></a></div><style>#mlbranding {-webkit-transition: opacity 0.2s ease-in-out;-moz-transition: all 0.2s ease-in-out;-ms-transition: all 0.2s ease-in-out;-o-transition: all 0.2s ease-in-out;transition: all 0.2s ease-in-out;position:fixed;left:5px;bottom:5px;opacity:0;}</style>');
			if (jQuery('meta[http-equiv="X-Wix-Meta-Site-Id"]').length > 0) {
				jQuery('body').append('<style>.ml-hidelangspecificpage {width:0px!important; height:0px!important; overflow:hidden!important;}</style>');
			} else {
				jQuery('body').append('<style>.ml-hidelangspecificpage, #mobileNav .ml-hidelangspecificpage {display:none!important;}</style>');
			}				

			setTimeout(function() {jQuery('#mlbranding').css('opacity', '1'); jQuery('#mlbranding img').animate({zoom: '120%'}, 200).animate({zoom: '100%'}, 200); }, 2000);

        })(jQuery);				
        
        window.setTimeout(function() {
            jQuery('#multilingualizerloadingscreen').addClass('loaded');			
        }, 1000); // backup plan incase some unforeseen error causes loading to stay on
        jQuery(document).ready(function() {
            
            if (typeof Y !== 'undefined' && ("MutationObserver" in window) && document.documentElement.clientWidth > 1000 && forcenonburger) {
                /*fix burger menu*/
                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
                var observer = new MutationObserver(function(mutations,observer) {
                    mutations.forEach(function(mutation) {
                        if (mutation.attributeName === "class") {
                            var attributeValue = jQuery(mutation.target).prop(mutation.attributeName);
                            if (attributeValue.indexOf('force-mobile-nav') > -1) { 
                                document.getElementsByTagName('body')[0].classList.remove('force-mobile-nav'); 
                            }
                        }
                    });
                });    
                observer.observe(document.getElementsByTagName('body')[0],  {
                    attributes: true,
                    characterData: false,
                    childList: false
                });
            }
            if ("MutationObserver" in window || "WebKitMutationObserver" in window) {
                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
                mlobserver = new MutationObserver(function(mutations, observer) {
                    // fired when a mutation occurs
                    if (!currentlyrunning) {
                        mutated = true;
                        mllastmutated = Date.now();
                        updateLanguageText(true);
                    } 
                });
                //removed observe function from here, inserted to end of runupdate function instead, allows us to switch observation off at start of function, modify doc, then observe again

            } else {
                if (typeof dontrepeatforever !== 'undefined' && dontrepeatforever == true) {
                } else {
                    window.setInterval(function() {
                        if (!currentlyrunning) {
                            mutated = true;
                            mllastmutated = Date.now();
                            updateLanguageText(false);							
                        }
                    }, 250);
                }
            }
            window.setInterval(function() {
                /*
                console.log ('1: ' + (Date.now() - mllastmutated));
                console.log ('2: ' + Date.now());
                console.log ('3: ' + mllastmutated);
                console.log ('4: ' + mutated);
                console.log ('5 ' + currentlyrunning);
                */
                if ((Date.now() - mllastmutated > 250) && mutated && !currentlyrunning) { // last mutation was more than 100 milliseconds ago - to prevent continuous repetition
                    currentlyrunning = true;
                    updateLanguageText(true);
                    jQuery('#multilingualizerloadingscreen').addClass('loaded');			
                    mllastmutated = Date.now();
                    mutated = false;
                    window.setTimeout(function() {
                        currentlyrunning = false;
                        if (totalupdates > 0 && !mlresized) {
                            mlresized = true; // moved before dispatchevent(resize) in case resize causes mutation and we loop infinitely by accident
                            window.dispatchEvent(new Event('resize'));
                        }
                    }, 100); // insert delay before we reset currently running - there can be delay in elements being updated
                }										
            }, 100);

            if (typeof forcerepeat !== 'undefined' && forcerepeat == true) {
                window.setInterval(function() {
                    if (!currentlyrunning) {
                        mutated = true;
                        mllastmutated = Date.now();
                        updateLanguageText(true);							
                    }
                }, 250);
            }
        });
    });


	writeHeadTags(mllanguages);

	function mlgetURLLocation(href) {
		var location = document.createElement("a");
		location.href = href;
		// IE doesn't populate all link properties when setting .href with a relative URL,
		// however .href will return an absolute URL which then can be used on itself
		// to populate these additional fields.
		if (location.host == "") {
		  location.href = location.href;
		}
		return location;
	};
	
    function maybeRedirectToDifferentURL(isolang,l) { //isolang = target 2 digit lang, l = target lang number
        //first check if we need to change pages because of language-specific menus
		currentpage = jQuery(location).attr('pathname');
		var newurl = currentpage;
		cpisolang = '';
		for (var mllangkey in mllanguages){
			if (mllanguages.hasOwnProperty(mllangkey)) {
				if (currentlanguage == mllanguages[mllangkey]) {
					cpisolang = get2digitlanguage(mllangkey);
				}
			}
		}
		npisolang = '';
		for (var mllangkey in mllanguages){
			if (mllanguages.hasOwnProperty(mllangkey)) {
				if (l == mllanguages[mllangkey]) {
					npisolang = get2digitlanguage(mllangkey);
				}
			}
		}

		cpclass = 'ml-langspecificpage-' + cpisolang;
		newclass = 'ml-langspecificpage-' + npisolang;
		console.log('comparing ' + cpclass + ' to ' + newclass);
		if (cpisolang != npisolang) {
			var tempindex=0;
			var desiredindex=0;
			var foundpage = false;
			jQuery('header,footer,nav, .nav').find('.'+cpclass + ' a, a.' + cpclass).each(function() {
				try{
					possibleurl = jQuery(new URL(jQuery(this).attr('href'), location)).attr('pathname');
					console.log('found url ' + possibleurl);
				} catch(e) {
					possibleurl = jQuery(this).attr('href');
					console.log('endurl ' + possibleurl);
				}
				console.log('currenturl ' + currentpage);
				if (possibleurl == currentpage) {
					console.log('matched ' + possibleurl + ' to ' + currentpage);
					desiredindex = tempindex;
					foundpage = true;
					return false;
				}
				tempindex++;
			});
			console.log('desired index: ' + desiredindex);
			tempindex = 0;
			if (foundpage) {
				jQuery('header,footer,nav,.nav').find('.'+newclass + ' a, a.'+newclass).each(function() {
					if (tempindex == desiredindex) {
						try {
							newurl = new URL(jQuery(this).attr('href'), location).pathname;
						} catch(e) {
							newurl = jQuery(this).attr('href');
						}
						if (!newurl.startsWith(window.location.protocol + '//' + window.location.host)) {
							newurl = window.location.protocol + '//' + window.location.host + newurl;
						} 
					}
					tempindex++;
				});
			}
		}
		console.log('redirecting to ' + newurl);
		if (newurl !== currentpage) {
			return newurl;
		}
        return window.location.href;
    }


	function languageClicked(l) {
		createCookie('language', l, 30);
		var tlang = '', url;
		for (var mllangkey in mllanguages){
			if (mllanguages.hasOwnProperty(mllangkey)) {
				if (l == mllanguages[mllangkey]) {
					tlang = get2digitlanguage(mllangkey);
				}
			}
		}
		//        if (jQuery('meta[http-equiv="X-Wix-Meta-Site-Id"]').length > 0) { // if we need to spot wix we can use this

		if (tlang && tlang !== '') {
			url = maybeRedirectToDifferentURL(tlang, l); // will either find the equivalent URL in another language, or it will add ?lang=de parameter to current URL
			if (url != window.location.href) {
				window.location.href = url;
			} else {
				window.location.reload(true);			
			}			
			window.location.href = url;
			
		} else {
			url = mlremoveURLParameter(window.location.href, 'lang');
			if (url != window.location.href) {
				window.location.href = url;
			} else {
				window.location.reload(true);			
			}
		}
	}
	function get2digitlanguage(languagename) {
		var reverselanguageLookup = {
		"Abkhazian": "ab",
		"Afrikaans": "af",
		"Aragonese": "an",
		"Arabic": "ar",
		"Assamese": "as",
		"Azerbaijani": "az",
		"Belarusian": "be",
		"Bulgarian": "bg",
		"Bengali": "bn",
		"Tibetan": "bo",
		"Breton": "br",
		"Bosnian": "bs",
		"Catalan / Valencian": "ca",
		"Chechen": "ce",
		"Corsican": "co",
		"Czech": "cs",
		"Church Slavic": "cu",
		"Welsh": "cy",
		"Danish": "da",
		"German": "de",
		"Greek": "el",
		"English": "en",
		"Esperanto": "eo",
		"Spanish / Castilian": "es",
		"Estonian": "et",
		"Basque": "eu",
		"Persian": "fa",
		"Finnish": "fi",
		"Fijian": "fj",
		"Faroese": "fo",
		"French": "fr",
		"Western Frisian": "fy",
		"Irish": "ga",
		"Gaelic / Scottish Gaelic": "gd",
		"Galician": "gl",
		"Manx": "gv",
		"Hebrew": "he",
		"Hindi": "hi",
		"Croatian": "hr",
		"Haitian; Haitian Creole": "ht",
		"Hungarian": "hu",
		"Armenian": "hy",
		"Indonesian": "id",
		"Icelandic": "is",
		"Italian": "it",
		"Japanese": "ja",
		"Javanese": "jv",
		"Georgian": "ka",
		"Kongo": "kg",
		"Korean": "ko",
		"Kurdish": "ku",
		"Cornish": "kw",
		"Kirghiz": "ky",
		"Latin": "la",
		"Luxembourgish Letzeburgesch": "lb",
		"Limburgan Limburger Limburgish": "li",
		"Lingala": "ln",
		"Lithuanian": "lt",
		"Latvian": "lv",
		"Malagasy": "mg",
		"Macedonian": "mk",
		"Mongolian": "mn",
		"Moldavian": "mo",
		"Malay": "ms",
		"Maltese": "mt",
		"Burmese": "my",
		"Norwegian (Bokm¬l)": "nb",
		"Nepali": "ne",
		"Dutch": "nl",
		"Norwegian (Nynorsk)": "nn",
		"Norwegian": "no",
		"Occitan (post 1500); ProvenÁal": "oc",
		"Polish": "pl",
		"Portuguese": "pt",
		"Raeto-Romance": "rm",
		"Romanian": "ro",
		"Russian": "ru",
		"Sardinian": "sc",
		"Northern Sami": "se",
		"Slovak": "sk",
		"Slovenian": "sl",
		"Somali": "so",
		"Albanian": "sq",
		"Serbian": "sr",
		"Swedish": "sv",
		"Swahili": "sw",
		"Turkmen": "tk",
		"Turkish": "tr",
		"Tahitian": "ty",
		"Ukrainian": "uk",
		"Urdu": "ur",
		"Uzbek": "uz",
		"Vietnamese": "vi",
		"Volapuk": "vo",
		"Yiddish": "yi",
		"Chinese (Mandarin)": "zi",
		"Chinese (Cantonese)": "zh",
		"Chinese": "zh"
		
		};
		return reverselanguageLookup[languagename];
	}
	var languageLookup = {
	 "ab": "Abkhazian",
	 "af": "Afrikaans",
	 "an": "Aragonese",
	 "ar": "Arabic",
	 "as": "Assamese",
	 "az": "Azerbaijani",
	 "be": "Belarusian",
	 "bg": "Bulgarian",
	 "bn": "Bengali",
	 "bo": "Tibetan",
	 "br": "Breton",
	 "bs": "Bosnian",
	 "ca": "Catalan / Valencian",
	 "ce": "Chechen",
	 "co": "Corsican",
	 "cs": "Czech",
	 "cu": "Church Slavic",
	 "cy": "Welsh",
	 "da": "Danish",
	 "de": "German",
	 "el": "Greek",
	 "en": "English",
	 "eo": "Esperanto",
	 "es": "Spanish / Castilian",
	 "et": "Estonian",
	 "eu": "Basque",
	 "fa": "Persian",
	 "fi": "Finnish",
	 "fj": "Fijian",
	 "fo": "Faroese",
	 "fr": "French",
	 "fy": "Western Frisian",
	 "ga": "Irish",
	 "gd": "Gaelic / Scottish Gaelic",
	 "gl": "Galician",
	 "gv": "Manx",
	 "he": "Hebrew",
	 "hi": "Hindi",
	 "hr": "Croatian",
	 "ht": "Haitian; Haitian Creole",
	 "hu": "Hungarian",
	 "hy": "Armenian",
	 "id": "Indonesian",
	 "is": "Icelandic",
	 "it": "Italian",
	 "ja": "Japanese",
	 "jv": "Javanese",
	 "ka": "Georgian",
	 "kg": "Kongo",
	 "ko": "Korean",
	 "ku": "Kurdish",
	 "kw": "Cornish",
	 "ky": "Kirghiz",
	 "la": "Latin",
	 "lb": "Luxembourgish Letzeburgesch",
	 "li": "Limburgan Limburger Limburgish",
	 "ln": "Lingala",
	 "lt": "Lithuanian",
	 "lv": "Latvian",
	 "mg": "Malagasy",
	 "mk": "Macedonian",
	 "mn": "Mongolian",
	 "mo": "Moldavian",
	 "ms": "Malay",
	 "mt": "Maltese",
	 "my": "Burmese",
	 "nb": "Norwegian (Bokm¬l)",
	 "ne": "Nepali",
	 "nl": "Dutch",
	 "nn": "Norwegian (Nynorsk)",
	 "no": "Norwegian",
	 "oc": "Occitan (post 1500); ProvenÁal",
	 "pl": "Polish",
	 "pt": "Portuguese",
	 "rm": "Raeto-Romance",
	 "ro": "Romanian",
	 "ru": "Russian",
	 "sc": "Sardinian",
	 "se": "Northern Sami",
	 "sk": "Slovak",
	 "sl": "Slovenian",
	 "so": "Somali",
	 "sq": "Albanian",
	 "sr": "Serbian",
	 "sv": "Swedish",
	 "sw": "Swahili",
	 "tk": "Turkmen",
	 "tr": "Turkish",
	 "ty": "Tahitian",
	 "uk": "Ukrainian",
	 "ur": "Urdu",
	 "uz": "Uzbek",
	 "vi": "Vietnamese",
	 "vo": "Volapuk",
	 "yi": "Yiddish", 
	 "zi": "Chinese (Mandarin)",
	 "zh": "Chinese (Cantonese)"
	};
	function mlremoveURLParameter(url, parameter) {
		//prefer to use l.search if you have a location/link object
		var urlparts= url.split('?');   
		if (urlparts.length>=2) {

			var prefix= encodeURIComponent(parameter)+'=';
			var pars= urlparts[1].split(/[&;]/g);

			//reverse iteration as may be destructive
			for (var i= pars.length; i-- > 0;) {    
				//idiom for string.startsWith
				if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
					pars.splice(i, 1);
				}
			}

			url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
			return url;
		} else {
			return url;
		}
	}
	function mlupdateURLParameter(url, param, paramVal)
	{
		var TheAnchor = null;
		var newAdditionalURL = "";
		var tempArray = url.split("?");
		var baseURL = tempArray[0];
		var additionalURL = tempArray[1];
		var temp = "";
		var tmpAnchor, TheParams;

		if (additionalURL) 
		{
			tmpAnchor = additionalURL.split("#");
			TheParams = tmpAnchor[0];
				TheAnchor = tmpAnchor[1];
			if(TheAnchor)
				additionalURL = TheParams;

			tempArray = additionalURL.split("&");

			for (var i=0; i<tempArray.length; i++)
			{
				if(tempArray[i].split('=')[0] != param)
				{
					newAdditionalURL += temp + tempArray[i];
					temp = "&";
				}
			}        
		}
		else
		{
			tmpAnchor = baseURL.split("#");
			TheParams = tmpAnchor[0];
			TheAnchor  = tmpAnchor[1];

			if(TheParams)
				baseURL = TheParams;
		}

	//		if(TheAnchor)
	//			paramVal += "#" + TheAnchor;

		var rows_txt = temp + "" + param + "=" + paramVal;
		return baseURL + "?" + newAdditionalURL + rows_txt;
	}	
	function changeLanguageAndMove(languagenumber, destinationpage) {
		createCookie('language', languagenumber, 30);
		window.location.href = destinationpage;
		jQuery(this).preventDefault();
	}	
	function createCookie(name,value,days) {
		var expires;
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires="+date.toGMTString();
		}
		else expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}	
	function updateLanguageText(runblocktranslation) {
		if (typeof Y !== 'undefined' && Y.Lang.isValue(Static.SQUARESPACE_CONTEXT.authenticatedAccount)) {
			return;
		}
		if (new Date().getTime() > 3359145600000) {
			return;
		}
		var lastupdates = totalupdates;
		runUpdate(runblocktranslation);

		if (typeof replaceSquarespaceText == 'function') {
			replaceSquarespaceText();
		}
		recheckpulse--;
		if (totalupdates > 0 && resizeruns > 0) {
			window.setTimeout(function() {
				// console.log(Date.now() + ': resizing window');
				jQuery('#multilingualizerloadingscreen').addClass('loaded');
			},50);
			resizeruns--;
		}
        // re-render layout for wix users	
        if (typeof rendered !== 'undefined' && typeof rendered.requestRelayout === "function") { 
			rendered.forceFullReLayout = true;
			rendered.requestRelayout();
		}  
		window.dispatchEvent(new Event('resize'));
		if (recheckfrequency != 0) {
			// instead of monitoring the doc, we will check every X milliseconds - this can be useful if a particular theme uses parallax or similar which doesn't actually change text, but does invoke the observer code
			mlrechecktrigger = window.setInterval(function() {
				if (!currentlyrunning) {
					mutated = true;
					mllastmutated = Date.now();
					updateLanguageText(true);							
				}
			}, recheckfrequency);
		} else {
			mlbodytarget = document.querySelector('#PAGES_CONTAINER, body');		
			mlobserver.observe(mlbodytarget, {
				subtree: true,
				attributes: false,
				characterData: false,
				childList: true
			});
		}
		currentlyrunning = false;
	}	
	function hasSomeParentTheClass(element, classname) {
	if (element.hasOwnProperty('element.className')) {
		if (element.className.split(' ').indexOf(classname)>=0) return true;
	}
	return element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
	}	
	function isHidden(el) {
	var style = window.getComputedStyle(el);
	return (style.display === 'none');
	}
	function mlgetParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	var tmpAnchor = results[2].split("#");
	var resultwithoutanchor = tmpAnchor[0];
	return decodeURIComponent(resultwithoutanchor.replace(/\+/g, " "));
	}
	function escapeRegExp(stringToGoIntoTheRegex) {
	return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }                             
    
    function findLanguageSpecificPages() {
		if (jQuery('title').length > 0) {
			var regExp = /\{([^\}]+)\}/;
			var matches = regExp.exec(jQuery('title').text());
			if (matches) {
				linklanguage = '{' + matches[1] + '}';
				//since this page has a language specified in it, we'll reset the cookie
				currentpagelanguageindex = languageLookup[matches[1]];

				jQuery('title').text(jQuery('title').text().replace(linklanguage, ''));
			}	
		}
		jQuery("a").filter(
			function(index) {
			  if(jQuery(this).text().indexOf('{') < 0 || jQuery(this).text().indexOf('}') < 0) {
				return false;
              }
			  return true; 
			}
		).each(function() {
            var regExp = /\{([^\}]+)\}/;
            var matches = regExp.exec(jQuery(this).text());
            
            //matches[1] contains the value between the parentheses
            if (matches) {
//                console.log ('matching ' + matches[1]);
//                console.log (matches);
				//check if this is current URL
				var locationpath = jQuery(location).attr('pathname');
				var locationhref = jQuery(location).attr('href');
				if (jQuery(this).attr('href') == locationpath || jQuery(this).attr('href') == locationhref) {
					// found current page in anchor tag on page
					console.log('found ' + matches[1] + ' in ' + jQuery(this).attr('href'));
					currentpagelanguageindex = languageLookup[matches[1]];
				}

                var linklanguage = matches[1];
                // then remove the text

                containernode = jQuery(this);
                //traverse upwards from this hyperlink to find the div or li container for it
                for (i=0; i<4; i++) {
                    if (jQuery(containernode).parent().children().length == 1) {
						containernode = jQuery(containernode).parent();
                    } else {
                        // add class for whatever the language is
                        jQuery(containernode).addClass('ml-langspecificpage-' + linklanguage);
                        jQuery(containernode).addClass('ml-langspecificpage');
                        break;
                    }
                }

                var rereplace = new RegExp(escapeRegExp('{' + linklanguage + '}'), "g");
                findAndReplaceDOMText(jQuery(this)[0], {
                    preset: 'prose', // this skips script tags for us
                    find: rereplace,  //semi working regex
                    replace: function(portion, match) {
                        return ''; 
                    }
                });			
        

//                jQuery(this).replaceText(new RegExp('\{' + linklanguage + '\}', 'i'), '');
            }
        });

    }

	function runUpdate(runblocktranslation) {
//		if (jQuery('meta[content="Webflow"]').length > 0) { // todo: insert detection of webflow editor here
		if (document.getElementsByClassName('w-editor-body').length > 0) {
			console.log('Not running because webflow editor identified');
			return;
		}
		if (mlobserver != undefined) { // we know it's defined, but need to check if it has a value which this does
			mlobserver.disconnect();
		}
		if (mlrechecktrigger != undefined) {
			window.clearInterval(mlrechecktrigger);
		}


				//lang-specific-override
		// test for language override
	
		thisurl = jQuery('header, nav, footer, .nav').find('a[href="' + location.href + '"], a[href="' + location.pathname + '"]').first();
		if (jQuery(thisurl).length > 0) {
			var regExp = /\{([^\}]+)\}/;
			var matches = regExp.exec(jQuery(thisurl).text());
			
			//matches[1] contains the value between the parentheses
			if (matches) {
				var currentpagelanguage = matches[1];
				//since this page has a language specified in it, we'll reset the cookie
				currentlanguage = mllanguages[languageLookup[currentpagelanguage]];
				createCookie('language', currentlanguage, 30);
				setHtmlLang(currentlanguage);

			}
		}


		findLanguageSpecificPages();
		currentlanguage=0; // firstlanguage
		
		if (mlgetParameterByName('lang') && typeof mllanguages[languageLookup[mlgetParameterByName('lang')]] != 'undefined') {
			createCookie('language', mllanguages[languageLookup[mlgetParameterByName('lang')]], 30);
			currentlanguage=mllanguages[languageLookup[mlgetParameterByName('lang')]];
			setHtmlLang(currentlanguage);
		} else {	
			if (readCookie('language') != '' && typeof Number(readCookie('language')) == 'number') {
				currentlanguage=Number(readCookie('language'));
				setHtmlLang(currentlanguage);
			} else {
				jQuery.browserLanguage(function( language , acceptHeader ){
					try {
						if (typeof mllanguages[language] === 'undefined') {
							currentlanguage = 0;
							createCookie('language', 0, 30);
						} else {
							createCookie('language', mllanguages[language], 30);
							currentlanguage=mllanguages[language];							
						}
						setHtmlLang(currentlanguage);
					} catch(e) {
						currentlanguage=0;
						createCookie('language', 0, 30);
						setHtmlLang(currentlanguage);
					}
				});			
			}
		}
		if (isNaN(currentlanguage)) {
			currentlanguage = 0;
		}

		
					

		var rereplace = new RegExp(escapeRegExp("…."), "g");
		findAndReplaceDOMText(jQuery('#PAGES_CONTAINER,body')[0], {
			preset: 'prose', // this skips script tags for us
			find: rereplace,  //semi working regex
			replace: function(portion, match) {
				return '....'; 
			}
		});			

		var langblockprefix = '';
	  var langblockpostfix = '';
	  if (ct > 3359145600000) return;
	  if (mllanguages['Hebrew'] == currentlanguage) {
	//      console.log('RTL LANGUAGE DETECTED');
		jQuery('html').attr('dir', 'rtl');
		langblockprefix = '';
		langblockpostfix = '';
	  } else {
	  }
		jQuery('body').addClass('mllanguage' + currentlanguage);
		jQuery('.language:nth-child(' + (currentlanguage+1) + ')').addClass('active');
		// run shorthand/fast translation first as this is often used in menus
		
		jQuery("a,li,option,h1,h2,h3,h4,h5,h6,label,title,legend,span,strong,em,td,b,p").replaceText(/\/\/\//gi, "..");
		jQuery("a,li,option,h1,h2,h3,h4,h5,h6,label,title,legend,span,strong,em,td,b,p").replaceText(/\[\[/gi, "....");
		jQuery("a,li,option,h1,h2,h3,h4,h5,h6,label,title,legend,span,strong,em,td,b,p").replaceText(/\]\]/gi, "....");

		jQuery("a,li,option,h1,h2,h3,h4,h5,h6,label,title,legend,span,strong,em,td,b,p,div,button").filter(
			function(index) {
				if (jQuery(this).children().length > 0) {
					return false; // this part only deals with leaves
                }
				if (jQuery(this).text().replace('&nbsp;', '').trim() == '') { return false; } 
			  if(jQuery(this).text().indexOf('//') < 0 && jQuery(this).text().indexOf('..') < 0 && jQuery(this).text().indexOf('¬') < 0) {
				return false;
			  }
			  var oc = findoccurrences(jQuery(this).html(), mltextblockboundary);
			  if (oc !== 0 && oc!==2)   {
				return false;
			  }		  
			  if(jQuery(this).text() === '....') {
				return false;
				}
				if(jQuery(this).text() === '….') {
					return false;
				}
					
			  if (jQuery(this).html().indexOf('<script') > -1) {
				return false;
			  }
			  if (jQuery(this).html().indexOf('<iframe') > -1) {
				return false;
			  }
			  if (jQuery(this).html().indexOf('&lt;iframe') > -1) {
				return false;
			  }					  
			  if (jQuery(this).html().indexOf('<noscript') > -1) {
				return false;
			  }
			  if (jQuery(this).html().indexOf('sqs-gallery') > -1) {
				return false;
			  }
			  if (jQuery(this).html().indexOf('data-block-json=') > -1) {
				return false;
			  }
			  if (jQuery(this).html().indexOf('data-edit-main-image=') > -1) { 
				return false;
			  }
			  
			  return true; 
			}
		).each(function() {
			var oldtext, languagetokens;
			if((jQuery(this).text().indexOf('..') > -1 || jQuery(this).text().indexOf('¬¬') > -1) && jQuery(this).text().length > 4) {
				oldtext = jQuery(this).text();
				languagetokens = jQuery(this).text().replace(mltextblockboundary, '').replace(mltextblockboundary, '').replace('~~~~', '').replace('~~~~', '').split('..');
				if (jQuery(this).text().indexOf('¬¬') >= 0) {
					languagetokens = jQuery(this).text().replace(mltextblockboundary, '').replace(mltextblockboundary, '').replace('~~~~', '').replace('~~~~', '').split('¬¬');
				}
				jQuery(this).text(langblockprefix + languagetokens[currentlanguage] + langblockpostfix);
				 totalupdates++;
			}
			if(jQuery(this).text().indexOf('//') > -1) {
				oldtext = jQuery(this).text();
				// console.log(Date.now() + ': replacing leaf - ' + oldtext);					
				languagetokens = jQuery(this).text().split('//');
				if (currentlanguage > languagetokens.length -1) {
					jQuery(this).text(langblockprefix + languagetokens[0] + langblockpostfix);
				} else {
					jQuery(this).text(langblockprefix + languagetokens[currentlanguage] + langblockpostfix);
				}
				  totalupdates++;
			}
		});  	
		jQuery('input,textarea').each(function() {
			oldtext = jQuery(this).attr('placeholder');
			if(typeof oldtext !== typeof undefined && oldtext !== false && oldtext.indexOf("..") > -1 && oldtext.length > 4) {
				languagetokens = oldtext.replace(mltextblockboundary, '').replace(mltextblockboundary, '').replace('~~~~', '').replace('~~~~', '').split('..');
				jQuery(this).attr('placeholder', languagetokens[currentlanguage]);
			}

		});
		if (!runblocktranslation) {
			return;
        }
		var markerindexes = [];
		rereplace = new RegExp(escapeRegExp(mltextblockboundary), "g");
		findAndReplaceDOMText(jQuery('#PAGES_CONTAINER,body')[0], {
			preset: 'prose', // this skips script tags for us
			find: rereplace,  //semi working regex
			replace: function(portion, match) {
				markerindexes.push(match.endIndex);
				return '~~~~'; 
			}
		});			

		// replace ellipses symbol + single dot with same thing 
		rereplace = new RegExp(escapeRegExp("…."), "g");
		findAndReplaceDOMText(jQuery('#PAGES_CONTAINER,body')[0], {
			preset: 'prose', // this skips script tags for us
			find: rereplace,  //semi working regex
			replace: function(portion, match) {
				//console.log('found ellipses');
				markerindexes.push(match.endIndex);
				return '~~~~'; 
			}
		});			
		// replace ellipses symbol + single dot with same thing 
		if (mlsecondtextblockboundary != "") {
			rereplace = new RegExp(escapeRegExp(mlsecondtextblockboundary), "g");
			findAndReplaceDOMText(jQuery('#PAGES_CONTAINER,body')[0], {
				preset: 'prose', // this skips script tags for us
				find: rereplace,  //semi working regex
				replace: function(portion, match) {
					markerindexes.push(match.endIndex);
					return '~~~~'; 
				}
			});			
		}

		findAndReplaceDOMText(jQuery('#PAGES_CONTAINER,body')[0], {
			preset: 'prose',
			find: /\.{3}/g,  //semi working regex
			replace: 'ØØØ'
		});			
		var currentMLBlock = 0;
		var resetmarkerbase = 0;		
		findAndReplaceDOMText(jQuery('#PAGES_CONTAINER,body')[0], {
			preset: 'prose',
			find: /\.\./g,   //previous regex broke thanks to matching across elements
			replace: function(portion, match) {
				if (match.startIndex > markerindexes[currentMLBlock+1]) {
					currentMLBlock = currentMLBlock + 2;
					resetmarkerbase = match.index;
				}
				return '¬' + ((match.index + 1 - resetmarkerbase)); 
			}
		});			
		//the regex for first language is always the same
		var mln = document.createElement('span');
		mln.style.display = 'none';
		mln.className = 'mltext';
		var mln2 = document.createElement('span');
		mln2.style.display = 'none';
		mln2.className = 'mltext2';
		
    function findAndReplaceByLanguageWrapper(rg) {
			findAndReplaceDOMText(jQuery('#PAGES_CONTAINER,body')[0], {
				find: rg,  //semi working regex
				wrap: mln,		
				portionMode: 'first',
				filterElements: function(el) {
					if (jQuery(el).hasClass('mltext')) {
						return false;
					}
					return true;
				},
				filterElements: function(el) {
					if (jQuery(el).is('script')) {
						return false;
					}
					if (jQuery(el).parents('script').length > 0) {
						return false;
					}
					return true;
				}
			});
		}
		
		var languageRegexes = [
			[/¬1[^~]+~~~~/g],
			[/~~~~[^~]+¬1/g, /¬2[^~]+~~~~/g],
			[/~~~~[^~]+¬2/g, /¬3[^~]+~~~~/g],
			[/~~~~[^~]+¬3/g, /¬4[^~]+~~~~/g],
			[/~~~~[^~]+¬4/g, /¬5[^~]+~~~~/g],
			[/~~~~[^~]+¬5/g, /¬6[^~]+~~~~/g],
			[/~~~~[^~]+¬6/g, /¬7[^~]+~~~~/g],
			[/~~~~[^~]+¬7/g, /¬8[^~]+~~~~/g],
			[/~~~~[^~]+¬8/g, /¬9[^~]+~~~~/g],
			[/~~~~[^~]+¬9/g]
		];
		(languageRegexes[(parseInt(currentlanguage) || 0)] || languageRegexes[0]).forEach(findAndReplaceByLanguageWrapper);

        //max 9 languages until someone asks for more, then use them for case study
		
		//fallback gracefully for partially translated pages
        jQuery('*').replaceText(/~~~~/gi, "");	
		findAndReplaceDOMText(jQuery('#PAGES_CONTAINER,body')[0], {
			find: /(¬1)|(¬2)|(¬3)|(¬4)|(¬5)|(¬6)|(¬7)|(¬8)|(¬9)/g,  //semi working regex
			replace: '  ',
			filterElements: function(el) {
				if (jQuery(el).is('script')) {
					return false;
				}
				if (jQuery(el).parents('script').length > 0) {
					return false;
				}
				return true;
			}
		});			
		jQuery('span.mltext').remove();
		jQuery('ul:hasNoText').each(function() {
			if (jQuery(this).find('img').length === 0 && jQuery(this).find('a').length === 0 && jQuery(this).css('visibility') != 'hidden') {
				jQuery(this).remove(); 
			}
		});
		jQuery('ol:hasNoText').each(function() {
			if (jQuery(this).find('img').length === 0 && jQuery(this).find('a').length === 0 && jQuery(this).css('visibility') != 'hidden' ) {
				jQuery(this).remove(); 
			}
		});
		jQuery('h1,h2,h3,h4,h5,h6,p').not('.logo').filter(
			function(index) {
				if (jQuery(this).text().replace('&nbsp;', '').trim() != '') { return false; } 
				if (jQuery(this).find().not('strong,em,br,a').length > 0) {
					return false; // this part only deals with leaves
				}
				if (jQuery(this).find('img').length > 0) {
					return false;
				}
				var pseudocontentexists = false;
				jQuery('a', this).each(function() {
					if (window.getComputedStyle(this,':before').content != '') {
						pseudocontentexists = true;
					}
					if (window.getComputedStyle(this,':after').content != '') {
						pseudocontentexists = true;
					}
				});
				if (pseudocontentexists) {
					return false;
				}
				return true;
		}).each(function() {
			jQuery(this).remove();
		});
        jQuery('div.sqs-row,h2').filter( //these ones can have children, but if no text we want to remove to fix spacing issues
			function(index) {
				if (jQuery(this).text().replace('&nbsp;', '').trim() != '') { return false; } 
				if (jQuery(this).find('.intrinsic, .embed-block-wrapper,.sqs-video-wrapper,hr,.spacer-block,svg,img,video,object,a,script,input,button').length > 0) { return false; }
				return true;
		}).each(function() {
			jQuery(this).remove();
		});		
		jQuery('div.sqs-block-content').filter(
			function(index) {
			  if (jQuery(this).children().length > 0) {
				return false; // this part only deals with leaves
			  }
			  if (jQuery(this).html().trim() != '') { return false; } 
			  return true;
		}).each(function() {
			jQuery(this).remove();
		});

		jQuery('div.sqs-block-html, div.sqs-block-markdown').filter(
			function(index) {
				if (jQuery(this).children().length > 0) {
					return false; // this part only deals with leaves
				}
				if (jQuery(this).html().trim() != '') { return false; } 
				if (jQuery(this).find('.intrinsic, .embed-block-wrapper,.sqs-video-wrapper').length > 0) { return false; }
				return true;
		}).each(function() {
			jQuery(this).remove();
		});
		
		for (var mllangkey in mllanguages){
			if (mllanguages.hasOwnProperty(mllangkey)) {
				if (currentlanguage != mllanguages[mllangkey]) {
					jQuery(".sqs-block-image:contains('[" + mllangkey + "]')").css("display", "none");
					jQuery(".sqs-block-image:contains('[" + mllangkey.toLowerCase() + "]')").css("display", "none");
					jQuery('img[alt="[' + mllangkey + ']"]').css('display', 'none');
					jQuery('img[alt="[' + mllangkey.toLowerCase() + ']"]').css('display', 'none');
					jQuery('img[alt="[' + mllangkey + ']"]').closest('.sqs-block-image').css('display', 'none');
					jQuery('img[alt="[' + mllangkey.toLowerCase() + ']"]').closest('.sqs-block-image').css('display', 'none');
					jQuery('.sqs-gallery-container img[alt="[' + mllangkey.toLowerCase() + ']"]').closest('.sqs-block').css("display", "none");
					jQuery('.sqs-gallery-container:contains("[' + mllangkey.toLowerCase() + ']")').closest('.sqs-block').css("display", "none");
					jQuery('.gallery:contains("[' + mllangkey.toLowerCase() + ']")').css("display", "none");
					jQuery('.gallery img[alt="[' + mllangkey.toLowerCase() + ']"]').closest('.gallery').css("display", "none");
					jQuery(".sqs-block-video:contains('[" + mllangkey + "]')").css("display", "none");
					jQuery(".sqs-block-video:contains('[" + mllangkey.toLowerCase() + "]')").css("display", "none");
					jQuery(".sqs-block-video").each(function() {
						//console.log('printing json of video');
						//console.log(jQuery(this).attr('data-block-json'));
						if (jQuery(this).attr('data-block-json').indexOf('[' + mllangkey.toLowerCase() + ']') !== -1) {
							jQuery(this).css("display", "none");
						}
					});

					jQuery("nav div:contains('[" + mllangkey.toLowerCase() + "]')").css("display", "none");
					jQuery("nav > ul:contains('[" + mllangkey.toLowerCase() +"]')").css("display", "none");
				}
				jQuery("nav div .external:contains('[" + mllangkey.toLowerCase() + "]')").css("display", "none");
				jQuery("nav > ul > li:contains('[" + mllangkey.toLowerCase() + "]')").css("display", "none");
			}
		}
		var mlLanguageFilter = function(index) {
			if (jQuery(this).children().length > 0) {
				return false; // only deals with leaves
			}
			return true;
		};
		var mlLanguageReplace = function() {
			jQuery(this).text(jQuery(this).text().replace("[" + mllangkey + "]", ""));
			jQuery(this).text(jQuery(this).text().replace("[" + mllangkey.toLowerCase() + "]", ""));
		};

		for (var mllangkey in mllanguages){
			if (mllanguages.hasOwnProperty(mllangkey)) {
				if (currentlanguage == mllanguages[mllangkey]) {
					jQuery(".gallery .description p:contains('[" + mllangkey + "]')")
						.filter(mlLanguageFilter)
						.each(mlLanguageReplace);
					jQuery(".gallery .description p:contains('[" + mllangkey.toLowerCase() + "]')")
						.filter(mlLanguageFilter)
						.each(mlLanguageReplace);
					jQuery(".sqs-block-image *:contains('[" + mllangkey + "]')")
						.filter(mlLanguageFilter)
						.each(mlLanguageReplace);
						jQuery(".sqs-block-image *:contains('[" + mllangkey.toLowerCase() + "]')")
						.filter(mlLanguageFilter)
						.each(mlLanguageReplace);
					jQuery(".sqs-block-video *:contains('[" + mllangkey.toLowerCase() + "]')")
						.filter(mlLanguageFilter)
						.each(mlLanguageReplace);
				}
			}
		}

		//replace placeholder text
		jQuery("textarea, input").filter(
			function(index) {
				try {
					if (jQuery(this).attr('placeholder').indexOf('//') > -1 || jQuery(this).attr('placeholder').indexOf('..') > -1) {
						return true;
					}
				} catch(e) {}
				return false;
			}
		).each(function() {
			var oldtext = jQuery(this).attr('placeholder');
			var languagetokens = jQuery(this).attr('placeholder').split('//');
			if (languagetokens.count === 0) languagetokens = jQuery(this).attr('placeholder').replace(mltextblockboundary, '').replace(mltextblockboundary, '').split('..');
			if (currentlanguage > languagetokens.length -1) {
				jQuery(this).attr('placeholder', langblockprefix + languagetokens[0] + langblockpostfix);
			} else {
				jQuery(this).attr('placeholder', langblockprefix + languagetokens[currentlanguage] + langblockpostfix);
			}
			totalupdates++;
		});  
		jQuery("input").filter(
			function(index) {
				try {
					if (String(jQuery(this).attr('value')).indexOf('..') > -1) {
						return true;
					}
				} catch(e) {}
				return false;
			}
		).each(function() {
			var oldtext = jQuery(this).attr('value');
			var languagetokens = jQuery(this).attr('value').replace(mltextblockboundary, '').replace(mltextblockboundary, '').split('..');
			if (currentlanguage > languagetokens.length -1) {
				jQuery(this).attr('value', langblockprefix + languagetokens[0] + langblockpostfix);
			} else {
				jQuery(this).attr('value', langblockprefix + languagetokens[currentlanguage] + langblockpostfix);
			}
			totalupdates++;
		});  
		jQuery("span").filter(
			function(index) {
				try {
					if (String(jQuery(this).attr('data-title')).indexOf('..') > -1) {
						return true;
					}
				} catch(e) {}
				return false;
			}
		).each(function() {
			var oldtext = jQuery(this).attr('data-title');
			var languagetokens = jQuery(this).attr('data-title').replace(mltextblockboundary, '').replace(mltextblockboundary, '').split('..');
			if (currentlanguage > languagetokens.length -1) {
				jQuery(this).attr('data-title', langblockprefix + languagetokens[0] + langblockpostfix);
			} else {
				jQuery(this).attr('data-title', langblockprefix + languagetokens[currentlanguage] + langblockpostfix);
			}
			totalupdates++;
		});  			


		findAndReplaceDOMText(jQuery('#PAGES_CONTAINER,body')[0], {
			preset: 'prose', 
			find: /Ø{3}/g,  //semi working regex
			replace: '...',
			forceContext: true
		});

	}	


	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
		}
		return '';
	}


	function findoccurrences(string, subString, allowOverlapping){

	string+=""; subString+="";
	if(subString.length<=0) return string.length+1;

	var n=0, pos=0;
	var step=(allowOverlapping)?(1):(subString.length);

	while(true){
		pos=string.indexOf(subString,pos);
		if(pos>=0){ n++; pos+=step; } else break;
	}
	return(n);
	}		
	/**
	 * findAndReplaceDOMText v 0.4.5
	 * @author James Padolsey http://james.padolsey.com
	 * @license http://unlicense.org/UNLICENSE
	 *
	 * Matches the text of a DOM node against a regular expression
	 * and replaces each match (or node-separated portions of the match)
	 * in the specified element.
	 */
	 (function (root, factory) {
		 if (typeof module === 'object' && module.exports) {
			 // Node/CommonJS
			 module.exports = factory();
		 } else {
			 // Browser globals
			 root.findAndReplaceDOMText = factory();
		 }
	 }(this, function factory() {

		var PORTION_MODE_RETAIN = 'retain';
		var PORTION_MODE_FIRST = 'first';

		var doc = document;
		var hasOwn = {}.hasOwnProperty;

		function escapeRegExp(s) {
			return String(s).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
		}

		function exposed() {
			// Try deprecated arg signature first:
			return deprecated.apply(null, arguments) || findAndReplaceDOMText.apply(null, arguments);
		}

		function deprecated(regex, node, replacement, captureGroup, elFilter) {
			if ((node && !node.nodeType) && arguments.length <= 2) {
				return false;
			}
			var isReplacementFunction = typeof replacement == 'function';

			if (isReplacementFunction) {
				replacement = (function(original) {
					return function(portion, match) {
						return original(portion.text, match.startIndex);
					};
				}(replacement));
			}

			// Awkward support for deprecated argument signature (<0.4.0)
			var instance = findAndReplaceDOMText(node, {

				find: regex,

				wrap: isReplacementFunction ? null : replacement,
				replace: isReplacementFunction ? replacement : '$' + (captureGroup || '&'),

				prepMatch: function(m, mi) {

					// Support captureGroup (a deprecated feature)

					if (!m[0]) throw 'findAndReplaceDOMText cannot handle zero-length matches';

					if (captureGroup > 0) {
						var cg = m[captureGroup];
						m.index += m[0].indexOf(cg);
						m[0] = cg;
					}

					m.endIndex = m.index + m[0].length;
					m.startIndex = m.index;
					m.index = mi;

					return m;
				},
				filterElements: elFilter
			});

			exposed.revert = function() {
				return instance.revert();
			};

			return true;
		}

		/**
		 * findAndReplaceDOMText
		 *
		 * Locates matches and replaces with replacementNode
		 *
		 * @param {Node} node Element or Text node to search within
		 * @param {RegExp} options.find The regular expression to match
		 * @param {String|Element} [options.wrap] A NodeName, or a Node to clone
		 * @param {String} [options.wrapClass] A classname to append to the wrapping element
		 * @param {String|Function} [options.replace='$&'] What to replace each match with
		 * @param {Function} [options.filterElements] A Function to be called to check whether to
		 *	process an element. (returning true = process element,
		 *	returning false = avoid element)
		 */
		function findAndReplaceDOMText(node, options) {
			return new Finder(node, options);
		}

		exposed.NON_PROSE_ELEMENTS = {
			br:1, hr:1,
			// Media / Source elements:
			script:1, style:1, img:1, video:1, audio:1, canvas:1, svg:1, map:1, object:1,
			// Input elements
			input:1, textarea:1, select:1, option:1, optgroup: 1, button:1
		};

		exposed.NON_CONTIGUOUS_PROSE_ELEMENTS = {

			// Elements that will not contain prose or block elements where we don't
			// want prose to be matches across element borders:

			// Block Elements
			address:1, article:1, aside:1, blockquote:1, dd:1, div:1,
			dl:1, fieldset:1, figcaption:1, figure:1, footer:1, form:1, h1:1, h2:1, h3:1,
			h4:1, h5:1, h6:1, header:1, hgroup:1, hr:1, main:1, nav:1, noscript:1, ol:1,
			output:1, p:1, pre:1, section:1, ul:1,
			// Other misc. elements that are not part of continuous inline prose:
			br:1, li: 1, summary: 1, dt:1, details:1, rp:1, rt:1, rtc:1,
			// Media / Source elements:
			script:1, style:1, img:1, video:1, audio:1, canvas:1, svg:1, map:1, object:1,
			// Input elements
			input:1, textarea:1, select:1, option:1, optgroup:1, button:1,
			// Table related elements:
			table:1, tbody:1, thead:1, th:1, tr:1, td:1, caption:1, col:1, tfoot:1, colgroup:1

		};

		exposed.NON_INLINE_PROSE = function(el) {
			return hasOwn.call(exposed.NON_CONTIGUOUS_PROSE_ELEMENTS, el.nodeName.toLowerCase());
		};

		// Presets accessed via `options.preset` when calling findAndReplaceDOMText():
		exposed.PRESETS = {
			prose: {
				forceContext: exposed.NON_INLINE_PROSE,
				filterElements: function(el) {
					return !hasOwn.call(exposed.NON_PROSE_ELEMENTS, el.nodeName.toLowerCase());
				}
			}
		};

		exposed.Finder = Finder;

		/**
		 * Finder -- encapsulates logic to find and replace.
		 */
		function Finder(node, options) {

			var preset = options.preset && exposed.PRESETS[options.preset];

			options.portionMode = options.portionMode || PORTION_MODE_RETAIN;

			if (preset) {
				for (var i in preset) {
					if (hasOwn.call(preset, i) && !hasOwn.call(options, i)) {
						options[i] = preset[i];
					}
				}
			}

			this.node = node;
			this.options = options;

			// Enable match-preparation method to be passed as option:
			this.prepMatch = options.prepMatch || this.prepMatch;

			this.reverts = [];

			this.matches = this.search();

			if (this.matches.length) {
				this.processMatches();
			}

		}

		Finder.prototype = {

			/**
			 * Searches for all matches that comply with the instance's 'match' option
			 */
			search: function() {

				var match;
				var matchIndex = 0;
				var offset = 0;
				var regex = this.options.find;
				var textAggregation = this.getAggregateText();
				var matches = [];
				var self = this;

				regex = typeof regex === 'string' ? RegExp(escapeRegExp(regex), 'g') : regex;

				matchAggregation(textAggregation);

				function matchAggregation(textAggregation) {
					for (var i = 0, l = textAggregation.length; i < l; ++i) {

						var text = textAggregation[i];

						if (typeof text !== 'string') {
							// Deal with nested contexts: (recursive)
							matchAggregation(text);
							continue;
						}

						if (regex.global) {
							while (match = regex.exec(text)) {
								matches.push(self.prepMatch(match, matchIndex++, offset));
							}
						} else {
							if (match = text.match(regex)) {
								matches.push(self.prepMatch(match, 0, offset));
							}
						}

						offset += text.length;
					}
				}

				return matches;

			},

			/**
			 * Prepares a single match with useful meta info:
			 */
			prepMatch: function(match, matchIndex, characterOffset) {

				if (!match[0]) {
					throw new Error('findAndReplaceDOMText cannot handle zero-length matches');
				}

				match.endIndex = characterOffset + match.index + match[0].length;
				match.startIndex = characterOffset + match.index;
				match.index = matchIndex;

				return match;
			},

			/**
			 * Gets aggregate text within subject node
			 */
			getAggregateText: function() {

				var elementFilter = this.options.filterElements;
				var forceContext = this.options.forceContext;

				return getText(this.node);

				/**
				 * Gets aggregate text of a node without resorting
				 * to broken innerText/textContent
				 */
				function getText(node) {

					if (node.nodeType === Node.TEXT_NODE) {
						return [node.data];
					}

					if (elementFilter && !elementFilter(node)) {
						return [];
					}

					var txt = [''];
					var i = 0;

					if (node = node.firstChild) do {

						if (node.nodeType === Node.TEXT_NODE) {
							txt[i] += node.data;
							continue;
						}

						var innerText = getText(node);

						if (
							forceContext &&
							node.nodeType === Node.ELEMENT_NODE &&
							(forceContext === true || forceContext(node))
						) {
							txt[++i] = innerText;
							txt[++i] = '';
						} else {
							if (typeof innerText[0] === 'string') {
								// Bridge nested text-node data so that they're
								// not considered their own contexts:
								// I.e. ['some', ['thing']] -> ['something']
								txt[i] += innerText.shift();
							}
							if (innerText.length) {
								txt[++i] = innerText;
								txt[++i] = '';
							}
						}
					} while (node = node.nextSibling);

					return txt;

				}

			},

			/**
			 * Steps through the target node, looking for matches, and
			 * calling replaceFn when a match is found.
			 */
			processMatches: function() {

				var matches = this.matches;
				var node = this.node;
				var elementFilter = this.options.filterElements;

				var startPortion,
					endPortion,
					innerPortions = [],
					curNode = node,
					match = matches.shift(),
					atIndex = 0, // i.e. nodeAtIndex
					matchIndex = 0,
					portionIndex = 0,
					doAvoidNode,
					nodeStack = [node];

				out: while (true) {

					if (curNode.nodeType === Node.TEXT_NODE) {

						if (!endPortion && curNode.length + atIndex >= match.endIndex) {

							// We've found the ending
							endPortion = {
								node: curNode,
								index: portionIndex++,
								text: curNode.data.substring(match.startIndex - atIndex, match.endIndex - atIndex),
								indexInMatch: atIndex - match.startIndex,
								indexInNode: match.startIndex - atIndex, // always zero for end-portions
								endIndexInNode: match.endIndex - atIndex,
								isEnd: true
							};

						} else if (startPortion) {
							// Intersecting node
							innerPortions.push({
								node: curNode,
								index: portionIndex++,
								text: curNode.data,
								indexInMatch: atIndex - match.startIndex,
								indexInNode: 0 // always zero for inner-portions
							});
						}

						if (!startPortion && curNode.length + atIndex > match.startIndex) {
							// We've found the match start
							startPortion = {
								node: curNode,
								index: portionIndex++,
								indexInMatch: 0,
								indexInNode: match.startIndex - atIndex,
								endIndexInNode: match.endIndex - atIndex,
								text: curNode.data.substring(match.startIndex - atIndex, match.endIndex - atIndex)
							};
						}

						atIndex += curNode.data.length;

					}

					doAvoidNode = curNode.nodeType === Node.ELEMENT_NODE && elementFilter && !elementFilter(curNode);

					if (startPortion && endPortion) {

						curNode = this.replaceMatch(match, startPortion, innerPortions, endPortion);

						// processMatches has to return the node that replaced the endNode
						// and then we step back so we can continue from the end of the
						// match:

						atIndex -= (endPortion.node.data.length - endPortion.endIndexInNode);

						startPortion = null;
						endPortion = null;
						innerPortions = [];
						match = matches.shift();
						portionIndex = 0;
						matchIndex++;

						if (!match) {
							break; // no more matches
						}

					} else if (
						!doAvoidNode &&
						(curNode.firstChild || curNode.nextSibling)
					) {
						// Move down or forward:
						if (curNode.firstChild) {
							nodeStack.push(curNode);
							curNode = curNode.firstChild;
						} else {
							curNode = curNode.nextSibling;
						}
						continue;
					}

					// Move forward or up:
					while (true) {
						if (curNode.nextSibling) {
							curNode = curNode.nextSibling;
							break;
						}
						curNode = nodeStack.pop();
						if (curNode === node) {
							break out;
						}
					}

				}

			},

			/**
			 * Reverts ... TODO
			 */
			revert: function() {
				// Reversion occurs backwards so as to avoid nodes subsequently
				// replaced during the matching phase (a forward process):
				for (var l = this.reverts.length; l--;) {
					this.reverts[l]();
				}
				this.reverts = [];
			},

			prepareReplacementString: function(string, portion, match) {
				var portionMode = this.options.portionMode;
				if (
					portionMode === PORTION_MODE_FIRST &&
					portion.indexInMatch > 0
				) {
					return '';
				}
				string = string.replace(/\$(\d+|&|`|')/g, function($0, t) {
					var replacement;
					switch(t) {
						case '&':
							replacement = match[0];
							break;
						case '`':
							replacement = match.input.substring(0, match.startIndex);
							break;
						case '\'':
							replacement = match.input.substring(match.endIndex);
							break;
						default:
							replacement = match[+t];
					}
					return replacement;
				});

				if (portionMode === PORTION_MODE_FIRST) {
					return string;
				}

				if (portion.isEnd) {
					return string.substring(portion.indexInMatch);
				}

				return string.substring(portion.indexInMatch, portion.indexInMatch + portion.text.length);
			},

			getPortionReplacementNode: function(portion, match) {

				var replacement = this.options.replace || '$&';
				var wrapper = this.options.wrap;
				var wrapperClass = this.options.wrapClass;

				if (wrapper && wrapper.nodeType) {
					// Wrapper has been provided as a stencil-node for us to clone:
					var clone = doc.createElement('div');
					clone.innerHTML = wrapper.outerHTML || new XMLSerializer().serializeToString(wrapper);
					wrapper = clone.firstChild;
				}

				if (typeof replacement == 'function') {
					replacement = replacement(portion, match);
					if (replacement && replacement.nodeType) {
						return replacement;
					}
					return doc.createTextNode(String(replacement));
				}

				var el = typeof wrapper == 'string' ? doc.createElement(wrapper) : wrapper;

				if (el && wrapperClass) {
					el.className = wrapperClass;
				}

				replacement = doc.createTextNode(
					this.prepareReplacementString(
						replacement, portion, match
					)
				);

				if (!replacement.data) {
					return replacement;
				}

				if (!el) {
					return replacement;
				}

				el.appendChild(replacement);

				return el;
			},

			replaceMatch: function(match, startPortion, innerPortions, endPortion) {

				var matchStartNode = startPortion.node;
				var matchEndNode = endPortion.node;

				var precedingTextNode;
				var followingTextNode;

				if (matchStartNode === matchEndNode) {

					var node = matchStartNode;

					if (startPortion.indexInNode > 0) {
						// Add `before` text node (before the match)
						precedingTextNode = doc.createTextNode(node.data.substring(0, startPortion.indexInNode));
						node.parentNode.insertBefore(precedingTextNode, node);
					}

					// Create the replacement node:
					var newNode = this.getPortionReplacementNode(
						endPortion,
						match
					);

					node.parentNode.insertBefore(newNode, node);

					if (endPortion.endIndexInNode < node.length) { // ?????
						// Add `after` text node (after the match)
						followingTextNode = doc.createTextNode(node.data.substring(endPortion.endIndexInNode));
						node.parentNode.insertBefore(followingTextNode, node);
					}

					node.parentNode.removeChild(node);

					this.reverts.push(function() {
						if (precedingTextNode === newNode.previousSibling) {
							precedingTextNode.parentNode.removeChild(precedingTextNode);
						}
						if (followingTextNode === newNode.nextSibling) {
							followingTextNode.parentNode.removeChild(followingTextNode);
						}
						newNode.parentNode.replaceChild(node, newNode);
					});

					return newNode;

				} else {
					// Replace matchStartNode -> [innerMatchNodes...] -> matchEndNode (in that order)


					precedingTextNode = doc.createTextNode(
						matchStartNode.data.substring(0, startPortion.indexInNode)
					);

					followingTextNode = doc.createTextNode(
						matchEndNode.data.substring(endPortion.endIndexInNode)
					);

					var firstNode = this.getPortionReplacementNode(
						startPortion,
						match
					);

					var innerNodes = [];

					for (var i = 0, l = innerPortions.length; i < l; ++i) {
						var portion = innerPortions[i];
						var innerNode = this.getPortionReplacementNode(
							portion,
							match
						);
						portion.node.parentNode.replaceChild(innerNode, portion.node);
						this.reverts.push((function(portion, innerNode) {
							return function() {
								innerNode.parentNode.replaceChild(portion.node, innerNode);
							};
						}(portion, innerNode)));
						innerNodes.push(innerNode);
					}

					var lastNode = this.getPortionReplacementNode(
						endPortion,
						match
					);

					matchStartNode.parentNode.insertBefore(precedingTextNode, matchStartNode);
					matchStartNode.parentNode.insertBefore(firstNode, matchStartNode);
					matchStartNode.parentNode.removeChild(matchStartNode);

					matchEndNode.parentNode.insertBefore(lastNode, matchEndNode);
					matchEndNode.parentNode.insertBefore(followingTextNode, matchEndNode);
					matchEndNode.parentNode.removeChild(matchEndNode);

					this.reverts.push(function() {
						precedingTextNode.parentNode.removeChild(precedingTextNode);
						firstNode.parentNode.replaceChild(matchStartNode, firstNode);
						followingTextNode.parentNode.removeChild(followingTextNode);
						lastNode.parentNode.replaceChild(matchEndNode, lastNode);
					});

					return lastNode;
				}
			}

		};

		return exposed;

	}));
}
