(function(window){

    var torcan = function(){

        var torcan = this;
        var t = torcan;

        t.scale = 1;
        t.w; //virtual width/height
        t.h;
        t.offsetH = 0;
        t.offsetV = 0;

        t.canvasX = $("#canvas").offset().left;
        t.canvasY = $("#canvas").offset().top;

        //manage mouse and touch control
        var cursorHandler = function(){

            var h = this; //handler
            h.x = 0; //final relative cursor position (within virtual size and offset)
            h.y = 0;
            //cursor is mouse/touch agnostic
            h.cursorX = 0; //absolute cursor position relative to element origin
            h.cursorY = 0;
            h.cursorStart = false; //start of press
            h.cursorStartX = 0;
            h.cursorStartY = 0;
            h.clickRange = 20; //how far from origin until press becomes drag (taxi distance)
            h.dragRange = 40;

            h.pressed = false;
            h.dragging = false;
            h.usingTouch = false; //changes per action, if for some reason a user has both

            h.mouseDown = function(e){
                h.pressed = true;
                h.usingTouch = false;
                h.mouseXY(e);
                if(!h.cursorStart){
                    h.cursorStart = true;
                    h.cursorStartX = h.cursorX;
                    h.cursorStartY = h.cursorY;
                }
            }

            h.touchDown = function(e){
                h.pressed = true;
                h.usingTouch = true;
                h.touchXY(e);
                if(!h.cursorStart){
                    h.cursorStart = true;
                    h.cursorStartX = h.cursorX;
                    h.cursorStartY = h.cursorY;
                }
            }

            h.mouseUp = function(e){
                h.pressed = false;
                h.cursorStart = false;
                h.mouseXY(e);

                //????
                if((Math.abs(h.cursorX - h.cursorStartX) < h.clickRange) && (Math.abs(h.cursorY - h.cursorStartY) < h.clickRange)){
                    //h.mouseup = true;
                }
            }

            h.touchUp = function(e){
                h.pressed = false;
                h.cursorStart = false;
                if((Math.abs(h.cursorX - h.cursorStartX) < h.clickRange) && (Math.abs(h.cursorY - h.cursorStartY) < h.clickRange)){
                    //h.mouseup = true;
                }
            }

            h.mouseXY = function(e){
                if (!e)
                    var e = window.event;
                h.cursorX = e.pageX - t.canvasX;
                h.cursorY = e.pageY - t.canvasY;
                h.x = (h.cursorX - (t.offsetH / 2)) / t.scale;
                h.y = (h.cursorY - (t.offsetV / 2)) / t.scale;
            }

            h.touchXY = function(e){
                if (!e)
                    var e = window.event;
                e.preventDefault();
                if((Math.abs(h.cursorX - h.cursorStartX) < h.dragRange) && (Math.abs(h.cursorY - h.cursorStartY) < h.dragRange)){
                    h.dragging = false;

                    h.cursorX = e.targetTouches[0].pageX - t.canvasX;
                    h.cursorY = e.targetTouches[0].pageY - t.canvasY;
                    //TODO
                    //mouseTween("mouseRelX", mouseRelX, ((e.targetTouches[0].pageX - $("#canvas").offset().left) - (offsetH / 2)) / scale, 200, "linear", true, false)
                    //mouseTween("mouseRelY", mouseRelY, ((e.targetTouches[0].pageY - $("#canvas").offset().left) - (offsetV / 2)) / scale, 200, "linear", true, false)
                    h.x = (h.cursorX - (t.offsetH / 2)) / t.scale;
                    h.y = (h.cursorY - (t.offsetV / 2)) / t.scale;
                } else {
                    h.dragging = true;
                    h.cursorStartX = null;
                    h.cursorStartY = null;

                    h.cursorX = e.targetTouches[0].pageX - t.canvasX;
                    h.cursorY = e.targetTouches[0].pageY - t.canvasY;

                    h.x = (h.cursorX - (t.offsetH / 2)) / t.scale;
                    h.y = (h.cursorY - (t.offsetV / 2)) / t.scale;
                }
            }
        };
        
        t.setup = function(){
            t.canvas.width = window.innerWidth;
            t.canvas.height = window.innerHeight;
            t.offsetH = 0;
            t.offsetV = 0;
            if($("#content").width() < $("#content").height()){
                t.offsetV = t.canvas.height - t.canvas.width;
                t.scale = ($("#content").width()/100);
            } else {
                t.offsetH = t.canvas.width - t.canvas.height;
                t.scale = ($("#content").height()/100);
            }
            t.c.setTransform(1, 0, 0, 1, t.offsetH / 2, t.offsetV / 2);
            
        }
        
        t.init = function(canvas){
            t.canvas = canvas;
            t.c = t.canvas.getContext('2d');
            t.c.imageSmoothingEnabled = true;
            t.c.globalCompositeOperation = 'source-over';
            
            t.cursorHandler = new cursorHandler();
            
            canvas.addEventListener("mousedown",  t.cursorHandler.mouseDown(e), false);
            canvas.addEventListener("mousemove",  t.cursorHandler.mouseXY(e),   false);
            canvas.addEventListener("touchstart", t.cursorHandler.touchDown(e), false);
            canvas.addEventListener("touchmove",  t.cursorHandler.touchXY(e),   true);
            canvas.addEventListener("touchend",   t.cursorHandler.touchUp(e),   false);
            
            document.body.addEventListener("mouseup",     t.cursorHandler.mouseUp, false);
            document.body.addEventListener("touchcancel", t.cursorHandler.touchUp, false);
            
            t.setup();
            $(window).resize(t.setup);
        }
    }
    
    //TODO queue tweens and clear from/run through queue
    function tween(prop, from, to, duration){
        var search = prop.split(".");
        var item = search[search.length - 1];
        var endpoint = torcan;
        for(var i = 0; i < search.length - 1; i++){
            endpoint = endpoint[search[i]];
        }
        if(endpoint[item] === undefined){
            return false;
        }
        endpoint[item] = from;
        var start = Date.now();
        function step(){
            var now = Date.now();
            var t = now / duration;
            
            endpoint[item] = from + ((to - from) * t)
            
            if(now - start > duration){
                endpoint[item] = to;
            } else {
                window.requestAnimationFrame(step);
            }
        }
    }
    
})(typeof window !== "undefined" ? window : this)