# torcan
another canvas library


## usage
torcan makes a fullscreen canvas that scales with the device. It creates a viewport box that is always contained and centered within the screen.

```
var t = new torcan();
t.init(document.getElementById("canvas"));

t.c //canvas context
```
   
torcan will make your canvas visually identical on all devices
it works by fullscreening the canvas and setting up a viewport box which scales with and is always contained in the screen

it also handles both touch and mouse inputs

[here's an example project](http://torcado.com/toys/chromab.html)