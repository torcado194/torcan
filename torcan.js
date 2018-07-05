(function(window){
    
    window.torcan = function(w = 100, h = 100, cover = false){
        
        let torcan = this;
        let t = torcan;
        
        t.scale = 1;
        //TODO: allow user specified virtual size and aspect ratio
        t.w = w; //virtual width/height
        t.h = h;
        t.offsetH = 0;
        t.offsetV = 0;
        t.tweenTouch = true;
        
        t.tweenQueue = [];
        
        t.Tween = function(prop, from, to, duration){
            
            let tween = this;
            
            this.prop = prop;
            this.from = from;
            this.to = to;
            this.duration = duration;
            
            let exists = false;
            
            for(let i = 0; i < t.tweenQueue.length; i++){
                if(t.tweenQueue[i].prop === prop){
                    exists = true;
                    t.tweenQueue.splice(i, 1);
                }
            }
            
            let search = prop.split(".");
            let item = search[search.length - 1];
            let endpoint = torcan;
            for(let i = 0; i < search.length - 1; i++){
                endpoint = endpoint[search[i]];
            }
            if(endpoint[item] === undefined){
                return false;
            }
            endpoint[item] = from;
            let start = Date.now();
            this.step = function(endpoint){
                let now = Date.now();
                let t = (now - start) / duration;
                
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
        let cursorHandler = function(){
            
            let h = this; //handler
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
            
            h.press = function(){
                //template, overritten by user
            }
            
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
                
                if((Math.abs(h.cursorX - h.cursorStartX) < h.clickRange) && (Math.abs(h.cursorY - h.cursorStartY) < h.clickRange)){
                    h.press();
                }
            }
            
            h.touchUp = function(e){
                h.pressed = false;
                h.cursorStart = false;
                if((Math.abs(h.cursorX - h.cursorStartX) < h.clickRange) && (Math.abs(h.cursorY - h.cursorStartY) < h.clickRange)){
                    h.press();
                }
            }
            
            h.mouseXY = function(e){
                if (!e)
                    e = window.event;
                h.cursorX = e.pageX - t.canvasX;
                h.cursorY = e.pageY - t.canvasY;
                h.x = ((h.cursorX - (t.offsetH / 2)) / t.scale);
                h.y = ((h.cursorY - (t.offsetV / 2)) / t.scale);
            }
            
            h.touchXY = function(e){
                if (!e)
                    e = window.event;
                e.preventDefault();
                if((Math.abs(h.cursorX - h.cursorStartX) < h.dragRange) && (Math.abs(h.cursorY - h.cursorStartY) < h.dragRange)){
                    h.dragging = false;
                    
                    h.cursorX = e.targetTouches[0].pageX - t.canvasX;
                    h.cursorY = e.targetTouches[0].pageY - t.canvasY;
                    
                    if(t.tweenTouch){
                        t.tweenQueue.push(new t.Tween("cursorHandler.x", h.x, (h.cursorX - (t.offsetH / 2)) / t.scale, 100));
                        t.tweenQueue.push(new t.Tween("cursorHandler.y", h.y, (h.cursorY - (t.offsetV / 2)) / t.scale, 100));
                    } else {
                        h.x = ((h.cursorX - (t.offsetH / 2)) / t.scale);
                        h.y = ((h.cursorY - (t.offsetV / 2)) / t.scale);
                    }
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
        
        t.setup = function(mutation){
            if(Array.isArray(mutation)){
                t.canvas.width  = getWidth(t.parent, mutation);
                t.canvas.height = getHeight(t.parent, mutation);
            } else {
                t.canvas.width  = t.parent ? getWidth(t.parent)  : window.innerWidth;
                t.canvas.height = t.parent ? getHeight(t.parent) : window.innerHeight;
            }
            
            t.offsetH = 0;
            t.offsetV = 0;
            
            if(cover){ //set viewport size to smallest covering square
                if((t.canvas.width / t.canvas.height) < (t.w / t.h)){
                    t.offsetH = ((t.canvas.width / t.canvas.height) - (t.w / t.h)) * t.canvas.height;
                    t.scale = (t.canvas.height / t.h);
                } else {
                    t.offsetV = ((t.canvas.height / t.canvas.width) - (t.h / t.w)) * t.canvas.width;
                    t.scale = (t.canvas.width / t.w);
                }
            } else { //set viewport size to largest contained square
                if((t.canvas.width / t.canvas.height) < (t.w / t.h)){
                    t.offsetV = ((t.canvas.height / t.canvas.width) - (t.h / t.w)) * t.canvas.width;
                    t.scale = (t.canvas.width / t.w);
                } else {
                    t.offsetH = ((t.canvas.width / t.canvas.height) - (t.w / t.h)) * t.canvas.height;
                    t.scale = (t.canvas.height / t.h);
                }
            }
            
            t.c.setTransform(t.scale, 0, 0, t.scale, t.offsetH / 2, t.offsetV / 2); //center and scale viewport
            t.viewX = -(t.offsetH / 2) / t.scale;
            t.viewY = -(t.offsetV / 2) / t.scale;
            t.viewW = t.w + (t.offsetH / t.scale);
            t.viewH = t.h + (t.offsetV / t.scale);
            t.viewRight  = t.viewX + t.viewW;
            t.viewLeft   = t.viewX;
            t.viewBottom = t.viewY + t.viewH;
            t.viewTop    = t.viewY;
        }
        
        t.init = function(canvas, parent){
            t.canvas = canvas;
            t.parent = parent;
            t.c = t.canvas.getContext('2d');
            t.c.imageSmoothingEnabled = true;
            t.c.globalCompositeOperation = 'source-over';
            
            t.canvasX = canvas.offsetLeft;
            t.canvasY = canvas.offsetTop;
            
            t.cursorHandler = new cursorHandler();
            
            //event listeners
            canvas.addEventListener("mousedown",  t.cursorHandler.mouseDown, false);
            canvas.addEventListener("mousemove",  t.cursorHandler.mouseXY,   false);
            canvas.addEventListener("touchstart", t.cursorHandler.touchDown, false);
            canvas.addEventListener("touchmove",  t.cursorHandler.touchXY,   true);
            canvas.addEventListener("touchend",   t.cursorHandler.touchUp,   false);
            
            document.body.addEventListener("mouseup",     t.cursorHandler.mouseUp, false);
            document.body.addEventListener("touchcancel", t.cursorHandler.touchUp, false);
            
            t.setup();
            
            if(parent){
                let observer = new MutationObserver(t.setup);
                observer.observe(parent, { attributes: true });
            } else {
                window.addEventListener("resize", t.setup, false);
            }
        }
    }
    
    function getWidth(element, mutation){
        let style = window.getComputedStyle(element, null);
        if(mutation && style.boxSizing !== "border-box"){
            return parseFloat(mutation[0].target.style.width);
        } else {
            return style.boxSizing === "border-box" ? parseFloat(style.width) - (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)) - (parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth)) : parseFloat(style.width);
        }
    }
    
    function getHeight(element, mutation){
        let style = window.getComputedStyle(element, null);
        if(mutation && style.boxSizing !== "border-box"){
            return parseFloat(mutation[0].target.style.height);
        } else {
            return style.boxSizing === "border-box" ? parseFloat(style.height) - (parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)) - (parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)) : parseFloat(style.height);
        }
    }
    
})(typeof window !== "undefined" ? window : this)