var torcan = function(){
    
    var torcan = this;
    
    torcan.scale = 1;
    torcan.offsetH = 0;
    torcan.offsetV = 0;
    
    torcan.canvasX = $("#canvas").offset().left;
    torcan.canvasY = $("#canvas").offset().top;
    
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
            h.cursorX = e.pageX - torcan.canvasX;
            h.cursorY = e.pageY - torcan.canvasY;
            h.x = (h.cursorX - (torcan.offsetH / 2)) / torcan.scale;
            h.y = (h.cursorY - (torcan.offsetV / 2)) / torcan.scale;
        }
        
        h.touchXY = function(e){
            if (!e)
                var e = window.event;
            e.preventDefault();
            if((Math.abs(h.cursorX - h.cursorStartX) < h.dragRange) && (Math.abs(h.cursorY - h.cursorStartY) < h.dragRange)){
                h.dragging = false;
                
                h.cursorX = e.targetTouches[0].pageX - torcan.canvasX;
                h.cursorY = e.targetTouches[0].pageY - torcan.canvasY;
                //TODO
                //mouseTween("mouseRelX", mouseRelX, ((e.targetTouches[0].pageX - $("#canvas").offset().left) - (offsetH / 2)) / scale, 200, "linear", true, false)
                //mouseTween("mouseRelY", mouseRelY, ((e.targetTouches[0].pageY - $("#canvas").offset().left) - (offsetV / 2)) / scale, 200, "linear", true, false)
                h.x = (h.cursorX - (torcan.offsetH / 2)) / torcan.scale;
                h.y = (h.cursorY - (torcan.offsetV / 2)) / torcan.scale;
            } else {
                h.dragging = true;
                h.cursorStartX = null;
                h.cursorStartY = null;
                
                h.cursorX = e.targetTouches[0].pageX - torcan.canvasX;
                h.cursorY = e.targetTouches[0].pageY - torcan.canvasY;

                h.x = (h.cursorX - (torcan.offsetH / 2)) / torcan.scale;
                h.y = (h.cursorY - (torcan.offsetV / 2)) / torcan.scale;
            }
        }
    };
    
    torcan.init = function(canvas){
        torcan.canvas = canvas;
        torcan.c = torcan.canvas.getContext('2d');
        torcan.c.imageSmoothingEnabled = true;
        torcan.c.globalCompositeOperation = 'source-over';
        
        torcan.cursorHandler = new cursorHandler();
        
        canvas.addEventListener("mousedown",  torcan.cursorHandler.mouseDown(e), false);
        canvas.addEventListener("mousemove",  torcan.cursorHandler.mouseXY(e),   false);
        canvas.addEventListener("touchstart", torcan.cursorHandler.touchDown(e), false);
        canvas.addEventListener("touchmove",  torcan.cursorHandler.touchXY(e),   true);
        canvas.addEventListener("touchend",   torcan.cursorHandler.touchUp(e),   false);

        document.body.addEventListener("mouseup",     torcan.cursorHandler.mouseUp, false);
        document.body.addEventListener("touchcancel", torcan.cursorHandler.touchUp, false);
    }
}






var can, c, canX, canY, mouseIsDown = 0;
    var cursorX = 0;
    var cursorY = 0;
    var mouseRelX = 0;
    var mouseRelY = 0;
    var mouseup = false;
    var usingTouch = false;
    var istouchstart = false;
    var isdrag = false;
    var cursorStart = false;
    var cursorXStart, cursorYStart = 0;
    var clickRange = 20;
    var dragRange = 40;
    var canvas = document.getElementById("canvas");
    var c = canvas.getContext('2d');
    c.imageSmoothingEnabled= true;
    c.globalCompositeOperation = 'source-over';
    canvas.addEventListener("mousedown", function(event){mouseDown(event)}, false);
canvas.addEventListener("mousemove", function(event){mouseXY(event)}, false);
canvas.addEventListener("touchstart", function(event){touchDown(event)}, false);
canvas.addEventListener("touchmove", function(event){touchXY(event)}, true);
canvas.addEventListener("touchend", function(event){touchUp(event)}, false);

document.body.addEventListener("mouseup", mouseUp, false);
document.body.addEventListener("touchcancel", touchUp, false);

//touch/mouse device polyfill stuff. dont mess

function mouseUp(event) {
    mouseIsDown = 0;
    mouseXY(event);
    cursorStart = false;
    if((cursorX < cursorXStart + clickRange && cursorX > cursorXStart - clickRange) && (cursorY < cursorYStart + clickRange && cursorY > cursorYStart - clickRange)){
        mouseup = true;
    }
}

function touchUp(event) {
    mouseIsDown = 0;
    cursorStart = false;
    if((cursorX < cursorXStart + clickRange && cursorX > cursorXStart - clickRange) && (cursorY < cursorYStart + clickRange && cursorY > cursorYStart - clickRange)){
        mouseup = true;
    }
}

function mouseDown(event) {
    mouseIsDown = 1;
    mouseXY(event);
    usingTouch = false;
    if(!cursorStart){
        cursorStart = true;
        cursorXStart = cursorX;
        cursorYStart = cursorY;
    }
}

function touchDown(event) {
    mouseIsDown = 1;
    touchXY(event);
    usingTouch = true;
    istouchstart = true;
    if(!cursorStart){
        cursorStart = true;
        cursorXStart = cursorX;
        cursorYStart = cursorY;
    }
}

function mouseXY(e) {
    if (!e)
        var e = event;
    canX = e.pageX - $("#canvas").offset().left;
    canY = e.pageY - $("#canvas").offset().top;
    cursorX = canX;
    cursorY = canY;
    mouseRelX = (cursorX - (offsetH / 2)) / scale;
    mouseRelY = (cursorY - (offsetV / 2)) / scale;
}

function touchXY(e) {
    if (!e)
        var e = event;
    e.preventDefault();
    if((cursorX < cursorXStart + dragRange && cursorX > cursorXStart - dragRange) && (cursorY < cursorYStart + dragRange && cursorY > cursorYStart - dragRange)){
        isdrag = false;
    } else {
        isdrag = true;
        cursorXStart = null;
        cursorYStart = null;
    }
    if(!isdrag){
        istouchstart = false;

        canX = e.targetTouches[0].pageX - $("#canvas").offset().left;
        canY = e.targetTouches[0].pageY - $("#canvas").offset().top;
        cursorX = canX;
        cursorY = canY;
        mouseTween("mouseRelX", mouseRelX, ((e.targetTouches[0].pageX - $("#canvas").offset().left) - (offsetH / 2)) / scale, 200, "linear", true, false)
        mouseTween("mouseRelY", mouseRelY, ((e.targetTouches[0].pageY - $("#canvas").offset().left) - (offsetV / 2)) / scale, 200, "linear", true, false)
    } else {
        canX = e.targetTouches[0].pageX - $("#canvas").offset().left;
        canY = e.targetTouches[0].pageY - $("#canvas").offset().top;

        cursorX = canX;
        cursorY = canY;
        mouseRelX = (cursorX - (offsetH / 2)) / scale;
        mouseRelY = (cursorY - (offsetV / 2)) / scale;
    }

}

//var initialization
var transformScaleWidth = 1;
var transformScaleHeight = 1;
var prevWidth = $("#content").width();
var prevHeight = $("#content").height();
var w = 500;
var h = 500;
var offsetH = 0;
var offsetV = 0;
var scale = 1;
var lineWidth = 4;
var mouseDist;

//variable and other initialization that is based on screen size
function setup(){
    $("#content").width(window.innerWidth);
    $("#content").height(window.innerHeight);
    canvas.width = $("#content").width();
    canvas.height = $("#content").height();
    offsetH = 0;
    offsetV = 0;
    if($("#content").width() < $("#content").height()){
        offsetV = canvas.height - canvas.width;
        scale = ($("#content").width()/100);
    } else {
        offsetH = canvas.width - canvas.height;
        scale = ($("#content").height()/100);
    }
    w = 100;
    h = 100;
    transformScaleWidth = $("#content").width() / prevWidth;
    transformScaleHeight = $("#content").height() / prevHeight;
    prevWidth = $("#content").width();
    prevHeight = $("#content").height();
    lineWidth = 2;
    c.lineWidth = 1 * scale;
    c.setTransform(1, 0, 0, 1, offsetH / 2, offsetV / 2);

}
$(window).resize(function(){
    setup();
});
setup();


//the animation loop
function step(){
    window.requestAnimationFrame(step);
    //DO CANVAS STUFF HERE

    c.fillStyle = '#FFCE94';
    c.save();
    c.translate(0 - offsetH / 2, 0 - offsetV / 2);
    c.fillRect(0,0,canvas.width,canvas.height); // clear canvas
    c.restore();

    c.lineWidth = 0.5 * scale;
    c.strokeStyle = '#000';
    c.strokeRect(0, 0, w * scale, h * scale);

    c.lineWidth = 2 * scale;
    c.strokeStyle = '#F3B97F';
    c.beginPath();
    c.arc((mouseRelX + 2) * scale, (mouseRelY + 2) * scale, 50, 0, 2 * Math.PI, false);
    c.stroke();

    c.strokeStyle = '#7AA563';
    c.beginPath();
    c.arc(mouseRelX * scale, mouseRelY * scale, 50, 0, 2 * Math.PI, false);
    c.stroke();
}