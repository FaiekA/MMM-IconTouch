Module.register("MMM-IconTouch", {
    defaults: {
        menuAutoHideDelay: 5000, // Default delay in milliseconds (5 seconds)
        rotationTime: 3000, // Time in milliseconds for each rotation step
        buttons: [],
        buttonsRight: [], // Add right-side buttons if needed
        hiddenModules: [] // Not included in on screen rotation 
    },

    start: function() {
        Log.info(`${this.name} has started...`);
        this.sendSocketNotification("CONFIG", this.config);

        this.standbyMode = false;
        this.rotationActive = false;
        this.rotationIndex = 0;
        this.activeModules = [];

        setTimeout(() => this.toggleStandby(), 3000);
    },

    
    getStyles: function() {
        return [this.file("css/mmm-icontouch.css"), "font-awesome.css"];
    },

    getTranslations: function() {
        return {
            en: "translations/en.json",
            nb: "translations/nb.json",
        };
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "ALL_MODULES_STARTED") {
            if (this.suspended) {
                MM.getModules().enumerate(module => {
                    if (module.name !== this.name) {
                        module.suspend(this);
                    }
                });
            }
        } else if (notification === "TOGGLE_MAIN_MENU" || notification === "TOGGLE_RIGHT_MENU" || notification === "STANDBY_MODE") {
            this.stopRotation();
        }
    },

    stopRotation: function() {
        if (this.rotationTimeout) {
            clearTimeout(this.rotationTimeout);
            this.rotationTimeout = null;
        }
        this.rotationActive = false;
    },

    handleButtonClick: function(buttonConfig) {
        this.stopRotation();

        if (this.activeModules.length > 0) {
            this.activeModules.forEach(module => {
                module.hide(1000);
            });
            this.activeModules = [];
            setTimeout(() => {
                this.showModules(buttonConfig);
            }, 1000);
        } else {
            this.showModules(buttonConfig);
        }
    },

    showModules: function(buttonConfig) {
        const modulesToShow = buttonConfig.modules && Array.isArray(buttonConfig.modules) && buttonConfig.modules.length > 1
            ? buttonConfig.modules
            : [buttonConfig.module];
    
        modulesToShow.forEach(moduleName => {
            const module = MM.getModules().find(m => m.name === moduleName);
            if (module) {
                module.hidden ? module.show(1000) : module.hide(1000);
                if (module.hidden) {
                    this.activeModules.push(module);
                }
            }
        });
    },
    

    createModuleButton: function(buttonConfig) {
        const buttonContainer = document.createElement("li");
        buttonContainer.className = "st-container__module-button flip-container";
    
        const button = document.createElement("div");
        button.className = "flip";
    
        let iconElement;
        if (buttonConfig.icon && buttonConfig.icon.trim() !== "") {
            const iconUrl = this.data.path + "icons/" + buttonConfig.icon;
            iconElement = document.createElement("img");
            iconElement.src = iconUrl;
            iconElement.className = "flip-icon"; // Add class to icon element
            iconElement.onerror = () => console.error(`Failed to load icon: ${iconUrl}`);
            button.appendChild(iconElement);
        } else {
            button.innerText = buttonConfig.label || "Button";
        }
    
        const label = document.createElement("div");
        label.className = "label";
        label.innerText = buttonConfig.label || "Label";
        button.appendChild(label);
    
        button.addEventListener("click", () => {
            this.handleButtonClick(buttonConfig);
            if (iconElement) {
                iconElement.classList.add("flipped"); // Apply flipped class to icon
            }
            setTimeout(() => {
                if (iconElement) {
                    iconElement.classList.remove("flipped");
                }
            }, 600); // Duration of the flip animation
        });
    
        buttonContainer.appendChild(button);
        return buttonContainer;
    },
    
    createMultiModuleButton: function(buttonConfig) {
        const buttonContainer = document.createElement("li");
        buttonContainer.className = "st-container__module-button flip-container";
    
        const button = document.createElement("div");
        button.className = "flip";
    
        const iconUrl = this.data.path + "icons/" + buttonConfig.icon;
        const iconElement = document.createElement("img");
        iconElement.src = iconUrl;
        iconElement.className = "flip-icon"; // Add class to icon element
        iconElement.onerror = () => console.error(`Failed to load icon: ${iconUrl}`);
        button.appendChild(iconElement);
    
        const label = document.createElement("div");
        label.className = "label";
        label.innerText = buttonConfig.label;
        button.appendChild(label);
    
        button.addEventListener("click", () => {
            this.handleButtonClick(buttonConfig);
            iconElement.classList.add("flipped"); // Apply flipped class to icon
            setTimeout(() => {
                iconElement.classList.remove("flipped");
            }, 600); // Duration of the flip animation
        });
    
        buttonContainer.appendChild(button);
        return buttonContainer;
    },
    
    

    createMainMenuDiv: function() {
        const mainMenuDiv = document.createElement("div");
        mainMenuDiv.className = "st-container__main-menu";
        mainMenuDiv.id = "st-main-menu";
    
        const buttons = this.config.buttons;
        if (Array.isArray(buttons) && buttons.length > 0) {
            const buttonList = document.createElement("ul");
    
            buttons.forEach(button => {
                const buttonElement = button.modules && Array.isArray(button.modules) && button.modules.length > 1 ?
                    this.createMultiModuleButton(button) : this.createModuleButton(button);
                buttonList.appendChild(buttonElement);
            });
    
            buttonList.appendChild(this.createRotationButton());
            buttonList.appendChild(this.createHiddenMenuButton()); // Add hidden menu button here  
            buttonList.appendChild(this.createRestartButton());                      
            buttonList.appendChild(this.createShutdownButton());


    
            mainMenuDiv.appendChild(buttonList);
        }
    
        return mainMenuDiv;
    },
    

    createRightMainMenuDiv: function() {
        const rightMainMenuDiv = document.createElement("div");
        rightMainMenuDiv.className = "st-container__main-menu-right";
        rightMainMenuDiv.id = "st-main-menu-right";

        const buttonsRight = this.config.buttonsRight;
        if (Array.isArray(buttonsRight) && buttonsRight.length > 0) {
            const rightModuleButtonsDiv = document.createElement("div");
            rightModuleButtonsDiv.className = "st-container__module-buttons-right";

            buttonsRight.forEach(buttonConfig => {
                const buttonElement = buttonConfig.modules && Array.isArray(buttonConfig.modules) && buttonConfig.modules.length > 1 ?
                    this.createMultiModuleButton(buttonConfig) : this.createModuleButton(buttonConfig);
                rightModuleButtonsDiv.appendChild(buttonElement);
            });

            rightMainMenuDiv.appendChild(rightModuleButtonsDiv);
        }

        return rightMainMenuDiv;
    },

    createHiddenMenuDiv: function() {
        const hiddenMenuDiv = document.createElement("div");
        hiddenMenuDiv.className = "st-container__hidden-menu";
        hiddenMenuDiv.id = "st-hidden-menu";
    
        const hiddenModules = this.config.hiddenModules;
        if (Array.isArray(hiddenModules) && hiddenModules.length > 0) {
            const buttonList = document.createElement("ul");
    
            hiddenModules.forEach(buttonConfig => {
                const buttonElement = buttonConfig.modules && Array.isArray(buttonConfig.modules) && buttonConfig.modules.length > 1 ?
                    this.createMultiModuleButton(buttonConfig) : this.createModuleButton(buttonConfig);
                buttonList.appendChild(buttonElement);
            });
    
            hiddenMenuDiv.appendChild(buttonList);
        }
    
        return hiddenMenuDiv;
    },
    

    toggleStandby: function() {
        this.standbyMode = !this.standbyMode;
        this.stopRotation();

        MM.getModules().enumerate(module => {
            if (module.name !== this.name) {
                this.standbyMode ? module.hide(1000) : module.hide(1000);
            }
        });
    },

    toggleMainMenu: function() {
        const mainMenuDiv = document.getElementById("st-main-menu");
        const rightMenuDiv = document.getElementById("st-main-menu-right");

        mainMenuDiv.classList.toggle('show');
        rightMenuDiv.classList.toggle('show');

        const autoHideDelay = this.config.menuAutoHideDelay;
        if (autoHideDelay !== 'none') {
            setTimeout(() => {
                mainMenuDiv.classList.remove('show');
                rightMenuDiv.classList.remove('show');
            }, autoHideDelay);
        }
    },

    toggleHiddenMenu: function() {
        const hiddenMenu = document.querySelector(".st-container__hidden-menu");
    
        if (hiddenMenu.classList.contains("show")) {
            hiddenMenu.classList.remove("show");
        } else {
            hiddenMenu.classList.add("show");
    
            // Hide the menu after 5 seconds
            setTimeout(() => {
                hiddenMenu.classList.remove("show");
            }, 10000);
        }
    },
    
    

    createStandByButtonDiv: function() {
        const standByButtonDiv = document.createElement("div");
        standByButtonDiv.className = "st-container__standby-button";

        const iconUrl = this.data.path + "icons/standby.png";
        const iconElement = document.createElement("img");
        iconElement.src = iconUrl;
        iconElement.onerror = () => console.error(`Failed to load icon: ${iconUrl}`);
        standByButtonDiv.appendChild(iconElement);

        standByButtonDiv.addEventListener("click", () => this.toggleStandby());

        return standByButtonDiv;
    },

    createRotationButton: function() {
        const rotationButtonContainer = document.createElement("li");
        rotationButtonContainer.className = "st-container__module-button flip-container";
    
        const button = document.createElement("div");
        button.className = "flip";
    
        const iconUrl = this.data.path + "icons/rotate.png";
        const iconElement = document.createElement("img");
        iconElement.src = iconUrl;
        iconElement.className = "flip-icon"; // Add class to icon element
        iconElement.onerror = () => console.error(`Failed to load icon: ${iconUrl}`);
        button.appendChild(iconElement);
    
        const label = document.createElement("div");
        label.className = "label";
        label.innerText = this.translate('ROTATE');
        button.appendChild(label);
    
        button.addEventListener("click", () => {
            this.toggleMainMenu();
            this.startRotation();
            iconElement.classList.add("flipped"); // Apply flipped class to icon
            setTimeout(() => {
                iconElement.classList.remove("flipped");
            }, 600); // Duration of the flip animation
        });
    
        rotationButtonContainer.appendChild(button);
        return rotationButtonContainer;
    },    

    startRotation: function() {
        this.rotationActive = true;
        const allButtons = [...this.config.buttons, ...this.config.buttonsRight];

        // Hide all currently active modules
        if (this.activeModules.length > 0) {
            this.activeModules.forEach(module => {
                module.hide(1000);
            });
            this.activeModules = [];
        }

        // Show the next module or set of modules
        const buttonConfig = allButtons[this.rotationIndex];
        if (buttonConfig) {
            setTimeout(() => {
                if (buttonConfig.modules && Array.isArray(buttonConfig.modules) && buttonConfig.modules.length > 1) {
                    buttonConfig.modules.forEach(moduleName => {
                        const module = MM.getModules().find(m => m.name === moduleName);
                        if (module && module.hidden) {
                            module.show(1000);
                            this.activeModules.push(module);
                        }
                    });
                } else {
                    const module = MM.getModules().find(m => m.name === buttonConfig.module);
                    if (module && module.hidden) {
                        module.show(1000);
                        this.activeModules.push(module);
                    }
                }
            }, 1000); // Delay to allow previous modules to hide
        }

        this.rotationIndex = (this.rotationIndex + 1) % allButtons.length;
        this.rotationTimeout = setTimeout(() => this.startRotation(), this.config.rotationTime + 1000); // Adjust timing for smooth transition
    },

    createHiddenMenuButton: function() {
        const hiddenMenuButtonContainer = document.createElement("li");
        hiddenMenuButtonContainer.className = "st-container__module-button flip-container";
    
        const button = document.createElement("div");
        button.className = "flip";
    
        const iconUrl = this.data.path + "icons/hidden.png";
        const iconElement = document.createElement("img");
        iconElement.src = iconUrl;
        iconElement.className = "flip-icon"; // Add class to icon element
        iconElement.onerror = () => console.error(`Failed to load icon: ${iconUrl}`);
        button.appendChild(iconElement);
    
        const label = document.createElement("div");
        label.className = "label";
        label.innerText = "Hidden";
        button.appendChild(label);
    
        button.addEventListener("click", () => {
            this.toggleHiddenMenu();
            iconElement.classList.add("flipped"); // Apply flipped class to icon
            setTimeout(() => {
                iconElement.classList.remove("flipped");
            }, 600); // Duration of the flip animation
        });
    
        hiddenMenuButtonContainer.appendChild(button);
        return hiddenMenuButtonContainer;
    },  
    
    createRestartButton: function() {
        const restartButtonContainer = document.createElement("li");
        restartButtonContainer.className = "st-container__module-button flip-container";
    
        const button = document.createElement("div");
        button.className = "flip";
    
        const iconUrl = `${this.data.path}icons/restart.png`;
        const iconElement = document.createElement("img");
        iconElement.src = iconUrl;
        iconElement.className = "flip-icon";
        iconElement.onerror = () => console.error(`Failed to load icon: ${iconUrl}`);
        button.appendChild(iconElement);
    
        const label = document.createElement("div");
        label.className = "label";
        label.innerText = this.translate('RESTART');
        button.appendChild(label);
    
        button.addEventListener("click", () => {
            this.sendSocketNotification("RESTART", {});
            iconElement.classList.add("flipped");
            setTimeout(() => {
                iconElement.classList.remove("flipped");
            }, 600);
        });
    
        restartButtonContainer.appendChild(button);
        return restartButtonContainer;
    },    

    createShutdownButton: function() {
        const shutdownButtonContainer = document.createElement("li");
        shutdownButtonContainer.className = "st-container__module-button flip-container";
    
        const button = document.createElement("div");
        button.className = "flip";
    
        const iconUrl = this.data.path + "icons/shutdown.png";
        const iconElement = document.createElement("img");
        iconElement.src = iconUrl;
        iconElement.className = "flip-icon";
        iconElement.onerror = () => console.error(`Failed to load icon: ${iconUrl}`);
        button.appendChild(iconElement);
    
        const label = document.createElement("div");
        label.className = "label";
        label.innerText = this.translate('S/DOWN');
        button.appendChild(label);
    
        button.addEventListener("click", () => {
            this.sendSocketNotification("SHUTDOWN", {});
            this.stopRotation();
            iconElement.classList.add("flipped");
            setTimeout(() => {
                iconElement.classList.remove("flipped");
            }, 600);
        });
    
        shutdownButtonContainer.appendChild(button);
        return shutdownButtonContainer;
    },      

    createMenuToggleButtonDiv: function() {
        const menuToggleButtonDiv = document.createElement("div");
        menuToggleButtonDiv.className = "st-container__menu-toggle";
        menuToggleButtonDiv.id = "st-menu-toggle";

        const iconUrl = `${this.data.path}icons/menu.png`;
        const iconElement = document.createElement("img");
        iconElement.src = iconUrl;
        iconElement.onerror = () => console.error(`Failed to load icon: ${iconUrl}`);
        menuToggleButtonDiv.appendChild(iconElement);

        menuToggleButtonDiv.addEventListener("click", () => this.toggleMainMenu());

        return menuToggleButtonDiv;
    },

    getDom: function() {
        const container = this.createContainerDiv();
        const standByButton = this.createStandByButtonDiv();
        container.appendChild(standByButton);
    
        const menuToggleButton = this.createMenuToggleButtonDiv();
        container.appendChild(menuToggleButton);
    
        const mainMenu = this.createMainMenuDiv();
        document.body.appendChild(mainMenu);
    
        const rightMainMenu = this.createRightMainMenuDiv();
        document.body.appendChild(rightMainMenu);
    
        const hiddenMenu = this.createHiddenMenuDiv(); // Create hidden menu
        document.body.appendChild(hiddenMenu); // Append hidden menu
    
        return container;
    },    

    createContainerDiv: function() {
        const containerDiv = document.createElement("div");
        containerDiv.className = "st-container";
        return containerDiv;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "SHUTDOWN") {
            console.log("Shutting down Rpi...");
            require('child_process').exec('shutdown -h now', console.log);
        }

        if (notification === "RESTART") {
            console.log("Restarting Rpi...");
            require('child_process').exec('sudo reboot', console.log);
        }
    },
});
       




