(function($){
    $.marquee = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("marquee", base);
        var $marquee = base.$el;
        var $window = $(window);
		var $filmList = $marquee.find(".film-block");
		var $marqueeNav = $("#marquee-nav");
		var $marqueeNavItems;
		var slideshowTimeout;

        marqueeInit = function(){
            $filmList.each(function(index){
                var $this = $(this);
                $this.hide();
                $this.attr("data-index", $this.index());
                $marqueeNav.append('<a class="marquee-nav-item" data-index="'+$this.index()+'" ></a>');
            })
        }
        marqueeNavInit = function(){
            $marqueeNavItems = $marqueeNav.find(".marquee-nav-item")
            $marqueeNavItems.on("click", function(){
                jumpToFilm($(this).attr("data-index"));
            })
        }
		showFilm = function(index){
			base.options.currentIndex = index;
			var $filmItem = $marquee.find('[data-index="'+base.options.currentIndex+'"]');
            if($window.width()<600){
                $filmItem.hide();
                $marquee.append($filmItem);
                $filmItem.show();
            }else{
                $filmItem.hide();
                $marquee.append($filmItem);
                $filmItem.fadeIn(base.options.animateTime);
            }
            base.resizeAll();
			base.updateNav();
		}
		jumpToFilm = function(index){
            clearInterval(slideshowTimeout);
			if(base.options.currentIndex != index) showFilm(index);
            slideshowTimeout = setTimeout(autoAnimate, base.options.holdTime);
		}
		autoAnimate = function(){ 
            clearInterval(slideshowTimeout);
			base.options.currentIndex++;
			if(base.options.currentIndex>$filmList.length-1) base.options.currentIndex = 0;
			showFilm(base.options.currentIndex);
            if($filmList.length >1){
                slideshowTimeout = setTimeout(autoAnimate, base.options.holdTime);
            }else{
                $marqueeNav.hide();
            }
		}
		base.updateNav = function(){
			$marqueeNavItems.removeClass("selected");
			$marqueeNavItems.eq(base.options.currentIndex).addClass("selected")
		}

        /********** resizer ***********/

        base.scaleImage = function($jqThisImage, $jqThis){
            $jqThisImage.removeAttr("style")
                        .css("width",$jqThis.width());
            
            if($jqThisImage.height() < $jqThis.height()){
                $jqThisImage.removeAttr("style")
                            .css("height",$jqThis.height());
            }

            $jqThisImage.css("max-width", "none")
                        .css("position", "absolute")
                        .css("left", (($jqThis.width()-$jqThisImage.width())/2))
                        .css("top", (($jqThis.height()-$jqThisImage.height())/2));
        }
        base.positionImage = function($jqThisImage, $jqThis){
            $jqThisImage.removeAttr("style")
                        .css("max-width", "none")
                        .css("height",$jqThisImage.attr("data-height"))
                        .css("width",$jqThisImage.attr("data-width"))
                        .css("left", (($jqThis.width()-$jqThisImage.width())/2))
                        .css("top", (($jqThis.height()-$jqThisImage.height())/2));
        }
        base.setOriginalSize = function($jqThisImage){
            if(!$jqThisImage.attr("data-width")){
                $(".film-block").css("overflow","hidden").css("position","absolute");
                $jqThisImage.attr("data-width", $jqThisImage.width())
                            .attr("data-height", $jqThisImage.height());
            }
        }
        base.setWindowDims = function(){
            if($window.width() > 600 ){
                base.options.winWidth = $window.width() - 160;
                base.options.winHeight = $window.height() - 160;
                $("#film-marquee").css("padding","0px 80px");
                $marqueeNav.show();
            }else{
                base.options.winWidth = $window.width();
                base.options.winHeight = $window.height() - 160;
                $("#film-marquee").css("padding","0px");
                $marqueeNav.hide();
            }

        }
        base.resizeAll = function(){
            base.setWindowDims();
            $("#film-marquee").css("height", (base.options.winHeight + 80) - $("#masthead").height()).
                               css("padding-bottom","0px")
            $(".film-block").each(function(index){
                var $this = $(this);
                var $thisImage = $this.find("img");
                var $filmInfo = $(this).find(".film-info-center");

                base.setOriginalSize($thisImage);
                $this.css("width", base.options.winWidth).css("height", base.options.winHeight);

                if($thisImage.attr("data-width") > $this.width() && $thisImage.attr("data-height") > $this.height()){
                    base.positionImage($thisImage, $this);
                }else{
                    base.scaleImage($thisImage, $this);
                }

                $filmInfo.css("position","absolute")
                            .css("left",($(this).width()/2)-($filmInfo.width()/2)-50+"px")
                            .css("top", ($(this).height()/2)-($filmInfo.height()/2)-30+"px");
            })
        }

        /********** resizer end ***********/

        base.init = function(){
            base.options = $.extend({},$.marquee.defaultOptions, options);
            marqueeInit();
            marqueeNavInit();
            autoAnimate();
            var timer_id;
            $(window).resize(function() {
                clearTimeout(timer_id);
                timer_id = setTimeout(function() {
                    base.resizeAll();
                }, 100);
            });
            base.resizeAll();
            $marquee.find("img").hide().load(function(){
                base.resizeAll();
            })
        };
        
        base.init();
    };
    
    $.marquee.defaultOptions = {
        currentIndex: -1,
        holdTime: 10000,
        animateTime: 1000,
        winWidth: 0,
        winHeight: 0
    };
    
    $.fn.marquee = function(options){
        return this.each(function(){
            (new $.marquee(this, options));
        });
    };
    
})(jQuery);