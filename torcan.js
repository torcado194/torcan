(function(window){
    
    window.torcan = function(){

        var torcan = this;
        var t = torcan;

        t.scale = 1;
        t.w = 100; //virtual width/height
        t.h = 100;
        t.offsetH = 0;
        t.offsetV = 0;

        t.canvasX = document.getElementById("canvas").offsetLeft;
        t.canvasY = document.getElementById("canvas").offsetTop;
        
        t.tweenQueue = [];
        
        t.Tween = function(prop, from, to, duration){

            var tween = this;

            this.prop = prop;
            this.from = from;
            this.to = to;
            this.duration = duration;

            var exists = false;

            for(var i = 0; i < t.tweenQueue.length; i++){
                if(t.tweenQueue[i].prop === prop){
                    exists = true;
                    t.tweenQueue.splice(i, 1);
                }
            }

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
            this.step = function(endpoint){
                var now = Date.now();
                var t = (now - start) / duration;

                endpoint[item] = from + ((to - from) * t)
                console.log(endpoint[item]);

                if(now - start > duration){
                    endpoint[item] = to;
                } else {
                    window.requestAnimationFrame(function(){tween.step(endpoint)});
                }
            }
            this.step(endpoint);
        }

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
                h.x = ((h.cursorX - (t.offsetH / 2)) / t.scale);
                h.y = ((h.cursorY - (t.offsetV / 2)) / t.scale);
            }

            h.touchXY = function(e){
                if (!e)
                    var e = window.event;
                e.preventDefault();
                if((Math.abs(h.cursorX - h.cursorStartX) < h.dragRange) && (Math.abs(h.cursorY - h.cursorStartY) < h.dragRange)){
                    h.dragging = false;

                    h.cursorX = e.targetTouches[0].pageX - t.canvasX;
                    h.cursorY = e.targetTouches[0].pageY - t.canvasY;
                    
                    t.tweenQueue.push(new t.Tween("cursorHandler.x", h.x, (h.cursorX - (t.offsetH / 2)) / t.scale, 200));
                    t.tweenQueue.push(new t.Tween("cursorHandler.y", h.y, (h.cursorY - (t.offsetV / 2)) / t.scale, 200));
                } else {
                    h.dragging = true;
                    h.cursorStartX = null;
                    h.cursorStartY = null;

                    h.cursorX = e.targetTouches[0].pageX - t.canvasX;
                    h.cursorY = e.targetTouches[0].pageY - t.canvasY;

                    h.x = ((h.cursorX - (t.offsetH / 2)) / t.scale);
                    h.y = ((h.cursorY - (t.offsetV / 2)) / t.scale);
                }
            }
        };
        
        t.setup = function(){
            t.canvas.width = window.innerWidth;
            t.canvas.height = window.innerHeight;
            t.offsetH = 0;
            t.offsetV = 0;
            var width = document.getElementById("canvas").width;
            var height = document.getElementById("canvas").height;
            if(width < height){
                t.offsetV = t.canvas.height - t.canvas.width;
                t.scale = (width / t.w);
            } else {
                t.offsetH = t.canvas.width - t.canvas.height;
                t.scale = (height / t.h);
            }
            t.c.setTransform(t.scale, 0, 0, t.scale, t.offsetH / 2, t.offsetV / 2);
        }
        
        t.init = function(canvas){
            t.canvas = canvas;
            t.c = t.canvas.getContext('2d');
            t.c.imageSmoothingEnabled = true;
            t.c.globalCompositeOperation = 'source-over';
            
            t.cursorHandler = new cursorHandler();
            
            canvas.addEventListener("mousedown",  t.cursorHandler.mouseDown, false);
            canvas.addEventListener("mousemove",  t.cursorHandler.mouseXY,   false);
            canvas.addEventListener("touchstart", t.cursorHandler.touchDown, false);
            canvas.addEventListener("touchmove",  t.cursorHandler.touchXY,   true);
            canvas.addEventListener("touchend",   t.cursorHandler.touchUp,   false);
            
            document.body.addEventListener("mouseup",     t.cursorHandler.mouseUp, false);
            document.body.addEventListener("touchcancel", t.cursorHandler.touchUp, false);
            
            t.setup();
            window.addEventListener("resize", t.setup, false);
        }
    }
    
})(typeof window !== "undefined" ? window : this)