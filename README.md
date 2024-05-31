# MMM-IconTouch

A module for controlling your [MagicMirror](https://github.com/MichMich/MagicMirror) using a
touchscreen interface or other.

## How it works

This module allows you to transform your magic mirror into a touchscreen interactive experience.

This includes:

* **Standby Mode** - Hide all magic mirror modules and convert back to a normal mirror by pressing the  button.
* **Side Menus** - Two Menus left and right populated with icons for Modules and Module sets.
* **Fixed Icons** - In Left menu are 4 fixed icons _hidden_, _rotate_, _shutdown_ and _restart_.
* **Rotaion Icon** - Start the Rotation - through the Modules or Module sets - similar to MMM-Pages.
* **Hidden Menu Icon** - Calls a hidden menu from the top of the screen with the hidden module icon/icons.
  
## Module Features
* **Menu Left** - Main left menu - With fixed _Rotate_, _Hidden_, _Restart_ and _Shutdown_ icons with addtional space for modules configurable via your config.
* **Menu Right** - Additional menu that could hold more icons for modules or module sets.
* **Hiddden Menu** - these Module or Modules sets are not included in the rotation cycle and is set in the config.
* **Module Icons** - Choose your own icons for your module or module sets and name then as you please.
* **Rotation Icon** - Rotates through your module or module set linked to a specific icon like Pages - excluding hidden module or module sets  -  set in the config.
* **Restart & Shudown** - Self explanatory - for the Rpi to safely power down your mirror
  
## General Behaviour
 * Main Menu toggles the left and right menus and has a auto hide
 * Rotate Icon starts the rotation throught module setup.
 * Standby Icon clear the screen of any current modules and stop the rotation.
 * Hidden Icon call hidden menu with hidden module and has a auto hide  
 * It's possible to have only the left menu and leave right empty in the config



## Screenshots

| ![Screenshot 1](https://github.com/FaiekA/MMM-IconTouch/assets/52759676/b011c57c-669c-471b-a010-6581ef6cdada) | ![Screenshot 2](https://github.com/FaiekA/MMM-IconTouch/assets/52759676/76ff50cc-d7d6-4973-b17b-0068b01f1434) | ![Screenshot 4](https://github.com/FaiekA/MMM-IconTouch/assets/52759676/5e185bcd-7d8e-499c-9963-acf9623ec85e)|
|---|---|---|
| Menu option | Module Icons, Rotation, Restart & Shutdown option | Call Modules via Icon |

| ![Screenshot 2024-05-30 104403](https://github.com/FaiekA/MMM-IconTouch/assets/52759676/dc7e81bc-b22b-428e-b406-cf44edf05d7a) | ![Screenshot 6](https://github.com/FaiekA/MMM-IconTouch/assets/52759676/effed13e-6c63-4a9f-aa6d-303008eba229) | ![Screenshot 1](https://github.com/FaiekA/MMM-IconTouch/assets/52759676/d533d060-8086-4ff1-8c05-6f58caeb4b30)|
|---|---|---|
| Hidden Menu | Module Rotation | Transform back to mirror on Standby mode |

## View Demo


|![Animation3](https://github.com/FaiekA/MMM-IconTouch/assets/52759676/7204c34c-3b97-46cf-a159-c171e049b18c)|
|---|---|
| Demo  | In Action  |
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
git clone https://github.com/FaiekA/MMM-IconTouch.git
cd MMM-IconTouch
npm install
```

## Step 2 – Add files to the Config.js

Here is the config entry 

```javascript
	   {
	 		module: 'MMM-IconTouch', 
			 animateIn: 'backInDown',     // Optional 
			 animateOut: 'backOutDown',  	// Optional 
			position: 'bottom_center',    // This can be any of the regions. (bottom_center recommended)
			config: {
				menuAutoHideDelay: 5000,  // Default value, set to 'none' to disable
				hiddenMenuAutoHideDelay: 6000, // Default delay in milliseconds (6 seconds)
				rotationTime: 3000, // Time in milliseconds for each rotation step			
				buttons: [
					// Add more buttons as needed
				],
				buttonsRight: [
								
					// Add more buttons for the right-side menu as needed
				],
				hiddenModules: [ ]

			}
		},
```

Here is an example for an entry - change to your Modules in the `config.js`

```javascript
	   {
	 		module: 'MMM-IconTouch', 
			 animateIn: 'backInDown',     // Optional 
			 animateOut: 'backOutDown',  	// Optional 
			position: 'bottom_center',    // This can be any of the regions. (bottom_center recommended)
			config: {
				menuAutoHideDelay: 5000,  // Default value, set to 'none' to disable
				hiddenMenuAutoHideDelay: 6000, // Default delay in milliseconds (6 seconds)
				rotationTime: 3000, // Time in milliseconds for each rotation step			
				buttons: [
					{ label: 'Clock', icon: 'clock.png', modules: ['clock','calendar','weather','newsfeed'] },    // Multiple Modules entry 
					{ label: 'Calendar', icon: 'calendar.png',modules: ['MMM-CalendarExt3','MMM-CalendarExt3Agenda','MMM-CalendarExt3Journal','calendar'] },
					{ label: 'News', icon: 'news.png',modules: ['MMM-NewsAPI','newsfeed','MMM-anotherNewsFeed'] },					
					{ label: 'Weather', icon: 'weather.png' ,modules: ['MMM-OpenWeatherMapForecast','MMM-OpenWeatherMap'] },
					{ module: 'MMM-birthdays', label: 'Home', icon: 'home.png'},   // Single module entry	

					// Add more buttons as needed
				],
				buttonsRight: [
					{ module: 'MMM-HA', label: 'HA', icon: 'hasos.png' },				// Single module entry	
					{ label: 'Sports', icon: 'sport.png', modules: ['MMM-SoccerLiveScore','MMM-Rugby','MMM-Formula1'] },   // Multiple Modules entry 

									
					// Add more buttons for the right-side menu as needed
				],
				hiddenModules: [
					{ module: 'compliments', label: 'Comps', icon: 'Activa.png' },	// a hiddem module or modules that is not included in the rotation 
					{ label: "Islamic", icon: "islam.png", modules: ["MMM-RandomQuranAyah", "MMM-IPT"] },

					// Add more buttons for the right-side menu as needed		
				]

			}
		},
```

## Configuration options
None configuration options

## Known Limitations / Issues
* Left and Right menus extends over modules althought the semi trasparent you have the option to reduce regions away from the conners for better aesthetics via custom css
```javascript
	.region.top.left {
	  left: 4%;
	 }
	.region.top.right {
	  right: 4%;
	}
	
	.region.bottom.left {
	  left: 4%;
	}
	.region.bottom.right {
	  right: 4%;
	}
```
  Adjust as needs 
  
## License
MIT License

