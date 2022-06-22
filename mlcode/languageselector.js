function mldefer(method) {
    if (window.jQuery) {
        method();
    } else {
        setTimeout(function() { mldefer(method) }, 50);
    }
}
mldefer (function() {
    jQuery(document).ready(function() {
        if (jQuery('.languagewrapper').length == 0) {
            langhtml = '<div class="languagewrapper">';
            console.log(mllanguagenames);
            for (var i=0; i<mllanguagenames.length; i++) {
                langhtml = langhtml + '<div class="language"><a href="javascript:void(0);" onclick="languageClicked(' + i + ');">' + mllanguagenames[i] + '</a></div>';
            }
            langhtml = langhtml + '</div>';
            csshtml = "<style>.languagewrapper{position:fixed;top:0;right:0;z-index:999999;background-color:black;padding:2px}.languagewrapper .language{float:left}.languagewrapper .language{display:block}.languagewrapper .language.active{display:block}.languagewrapper .language.active a{color:white;font-weight:bold}.languagewrapper .language a{padding:2px 5px;text-decoration:none;color:white}.languagewrapper .language{display:block}.languagewrapper .language.active{display:block}</style>";

            jQuery('body').append(csshtml);
            jQuery('body').append(langhtml);
            cssoptions = "";
            if (mllanguagestyle.verticalposition == 'top') {
                jQuery('.languagewrapper').css('top', '0px');
            } else if (mllanguagestyle.verticalposition = 'bottom') {
                jQuery('.languagewrapper').css('bottom', '0px');
            } else if (mllanguagestyle.verticalposition.replace('px', '') < 0) {
                jQuery('.languagewrapper').css('bottom', mllanguagestyle.verticalposition.replace('-', ''));
            } else {
                jQuery('.languagewrapper').css('top', mllanguagestyle.verticalposition);
            }
            if (mllanguagestyle.horizontalposition == 'left') {
                jQuery('.languagewrapper').css('left', '0px');
            } else if (mllanguagestyle.horizontalposition = 'right') {
                jQuery('.languagewrapper').css('right', '0px');
            } else if (mllanguagestyle.horizontalposition.replace('px', '') < 0) {
                jQuery('.languagewrapper').css('right', mllanguagestyle.horizontalposition.replace('-', ''));
            } else {
                jQuery('.languagewrapper').css('left', mllanguagestyle.horizontalposition);
            }
            jQuery('.languagewrapper').css('background-color', mllanguagestyle.backgroundcolor);
            jQuery('.languagewrapper').css('font-family', mllanguagestyle.font);
            jQuery('.languagewrapper').css('font-size', mllanguagestyle.fontsize);
            if (mllanguagestyle.layout == 'horizontal') {
                jQuery('.languagewrapper .language').css('float', 'left');    
            }
            jQuery('.languagewrapper .language a').css('color', mllanguagestyle.fontcolor);
            jQuery('.languagewrapper .language a').css('color', mllanguagestyle.fontcolor);        
        }
    });
});
