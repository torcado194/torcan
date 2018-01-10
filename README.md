# torcan
another canvas library


## usage
torcan makes a fullscreen canvas that scales with the device. It creates a viewport box that is always contained and centered within the screen.

```
var t = new torcan();
t.init(document.getElementById("canvas")); //give torcan an existing canvas element

t.c //canvas context
t.cursorHandler; //handles mouse and touch
t.cursorHandler.x //x and y of touch/mouse
t.cursorHandler.y

t.press //overload, called when user clicks or taps
```
   
torcan will make your canvas visually identical on all devices
it works by fullscreening the canvas and setting up a viewport box which scales with and is always contained in the screen

it also handles both touch and mouse inputs, and tweens touch positions

[here's an example project](http://torcado.com/toys/chromab.html)
![chromab gif](http://torcado.com/chromab.gif)