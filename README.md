# MMM-IconTouch

A module for controlling your [MagicMirror](https://github.com/MichMich/MagicMirror) using a
touchscreen interface project by [SmartBuilds.io](http:smartbuilds.io)

## How it works

This module allows you to transform your magic mirror into a touchscreen interactive experience.
This includes:

* **Standby Mode** - Hide all magic mirror modules and convert back to a normal mirror by pressing tne
  cycle button.
* **Side Menu** - Menu widget includes a _shutdown_ and _restart_ of Rpi to safely power down your mirror
  without unplugging and forced shutdowns (preventing SD card corruptions).

## Screenshots

| ![Screenshot 1](https://github.com/FaiekA/MMM-IconTouch/assets/52759676/b011c57c-669c-471b-a010-6581ef6cdada) | ![Side M![Screenshot 2](https://github.com/FaiekA/MMM-IconTouch/assets/52759676/52c8dbbb-7162-4392-af72-79e701caf5b1)
enu](img/readme/side-menu.png) | (https://github.com/FaiekA/MMM-IconTouch/assets/52759676/8f185921-62e0-4da5-8ada-7cefde1b096e)|
|---|---|---|
| Menu option | Shutdown & Restart option | Transform back to mirror on Standby mode |

## View Demo of full integration

![Touchscreen UI](img/readme/touchscreen-ui.png)

View full demo on [SmartBuilds.io](http:smartbuilds.io)

## Preconditions

* You will need a Interactive Touch screen peripheral such as an IR Frame or Capacitive Touch)
* MagicMirror<sup>2</sup> instance
* Node.js version >= 7
* npm

## Step 1 – Install the module

In your MagicMirror directory:

```bash 
cd modules
cd ~/MagicMirror/modules
git clone https://github.com/EbenKouao/MMM-SmartTouch.git
cd MMM-SmartTouch
npm install
```

## Step 2 – Add files to the Config.js

Here is an example for an entry in `config.js`

```javascript
{
  module: 'MMM-SmartTouch', 
  position: 'bottom_center',    // This can be any of the regions.(bottom-center Recommended)
  config:{ 
    // None configuration options defined 
  }
}
```

## Configuration options

None configuration options
