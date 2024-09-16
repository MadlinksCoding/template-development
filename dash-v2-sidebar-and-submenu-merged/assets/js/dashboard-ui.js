/**
 *
 *  @fileoverview Fansocial Dashboard UI Scripts - Logics for behavior and handling of dashboard UI elements and events
 *
 *  @author Abirlal Maiti <abirlal.maiti@gmail.com>
 *  @version 1.0.0
 *  @license MIT License
 *
 */


/**
 * 
 * @class DashSideBarHandler
 * @author Abirlal Maiti <abirlal.maiti@gmail.com>
 * @classdesc Fansocial Dashboard Sidebar UI & Behavior handler - Logics for behavior of multi level push menu (desktop & mobile) and floating menu panel for small screens, profile panel, notifications panel
 * Once invoked and initialized using {@link init}, it will create an instance of Fansocial Dash Menu and call all additional constructors and methods.
 * 
 */
class DashSideBarHandler {
	constructor(options) {
		this.options = Object.assign({
				screenSizeDesktop: false, // if device screensize is desktop
				screenSizeTablet: false, // if device screensize is tablet
				screenSizeMobile: false, // if device screensize is mobile

				dashNavElSelector: '[data-dashboard-main-nav]', // dash menu main selector

				dashNavEl: '', // dash menu main container

				floatingPanelWrapperSelector: '[data-floating-panel-wrapper]', // floating panel wrapper selector
				floatingPanelSelector: '[data-floating-panel]', // floating panel wrapper selector
				floatingPanelTriggerSelector: '[data-floating-panel-trigger]', // floating panel trigger selector

				floatingPanelWrapperEl: '', // floating panel wrapper element
				floatingPanelEl: '', // floating panel element
				floatingPanelTriggerEl: '', // floating panel trigger element

				profilePanelTriggerSelector: '[data-profile-panel-trigger]', // profile panel trigger selector
				profilePanelSelector: '[data-profile-panel-container]', // profile panel selector

				profilePanelTriggerEl: '', // profile panel trigger element
				profilePanelEl: '', // profile panel element

				profileDottedButtonSelector: '[data-profile-dotted-button]', // profile dotted button selector

				profileDottedButtonEl: '', // profile dotted button selector

				profileAutoRepostSettingTriggerSelector: '[data-auto-repost-setting-toggle]', // profile auto repost setting trigger selector
				profileAutoRepostSettingSelector: '[data-auto-repost-setting]', // profile auto repost setting selector

				profileAutoRepostSettingTriggerEl: '', // profile auto repost setting trigger element
				profileAutoRepostSettingEl: '', // profile auto repost setting element

				notificationsPanelTriggerSelector: '[data-notifications-panel-trigger]', // notifications panel trigger selector
				notificationsPanelSelector: '[data-notifications-container]', // notifications panel selector

				notificationsPanelTriggerEl: '', // notifications panel trigger element
				notificationsPanelEl: '', // notifications panel element

				mobileNavOpenTriggerSelector: '[data-mobile-nav-open]', // mobile nav open trigger selector
				mobileNavCloseTriggerSelector: '[data-mobile-nav-close]', // mobile nav close trigger selector
				mobileNavSelector: '[data-mobile-nav-main-wrapper]', // mobile nav selector

				mobileNavOpenTriggerEl: '', // mobile nav open trigger element
				mobileNavCloseTriggerEl: '', // mobile nav close trigger element
				mobileNavEl: '', // mobile nav element

				mainMenuSelector: '[data-main-menu-item]', // dash main menu items selector
				subMenuSelector: '[data-submenu-item]', // dash sub menu items selector

				currentMainMenu: '', // current main menu element
				currentMainMenuTitle: '', // current main menu title

				currentSubmenuContainer: '', // current submenu container element
				currentSubmenuMainEl: '', // current submenu container element
				
				currentBackButton: '', // current back button element

				currentSubmenuTitleEl: '', // current submenu title element
				currentSubmenuTitleStack: [], // current submenu title history stack

				currentSubmenuEl: '', // current submenu element
				currentSubmenuElStack: [], // current submenu elements history stack

				currentSubmenuLevel: 0, // current submenu level
			},
			options
		);
	}


	/** 
	 * 
	 * @method handleEvent 
	 * @description Helper function to attach & handle events to selector (mimic of jQuery $.on)
	 * https://stackoverflow.com/a/30880807/3588706
	 * 
	 */
	handleEvent(element, type, selector, handler) {
		element.addEventListener(type, (event) => {
			if (event.target.closest(selector)) {
				handler(event.target.closest(selector), event);
			}
		});
	}


	/** 
	 * 
	 * @method resetMenu 
	 * @description Helper function to reset UI and class vars
	 * 
	 */
	resetMenu() {
		let _self = this;

		// hide current submenu container (if not empty)
		_self.options.currentSubmenuContainer !== '' ? (
			_self.options.currentSubmenuContainer.setAttribute('hidden', true),
			_self.options.currentSubmenuContainer = '',
			_self.options.currentSubmenuMainEl.style.transform = `translateX(0%)`,
			_self.options.currentSubmenuMainEl = '',
			_self.options.currentBackButton = '',
			_self.options.currentSubmenuTitleEl = '',
			_self.options.currentSubmenuTitleStack.length = 0,
			_self.options.currentSubmenuEl = '',
			_self.options.currentSubmenuElStack.forEach(element => {
				element.setAttribute('hidden', true)
			}),
			_self.options.currentSubmenuElStack.length = 0,
			_self.options.currentSubmenuLevel = 0,
			_self.options.currentMainMenu.classList.remove('js-event-handler-attached'),
			_self.options.currentMainMenu.dataset.isActive = false,
			_self.options.currentMainMenu = '',
			_self.options.currentMainMenuTitle = ''
		) : '';

		// hide floating menu (if applicable)
		_self.options.floatingPanelWrapperEl !== '' ? (
			_self.options.floatingPanelTriggerEl.querySelector('a[data-floating-panel-trigger-btn]').dataset.isActive = 'false',
			_self.options.floatingPanelEl.dataset.isActive = 'false'
		) : '';

		// hide notification panel (if applicable)
		_self.options.notificationsPanelEl !== '' ? (
			_self.options.notificationsPanelTriggerEl.forEach(element => {
				element.dataset.isActive = 'false';
			}),
			_self.options.notificationsPanelEl.setAttribute('hidden', true)
		) : '';

		// hide profile panel (if applicable)
		_self.options.profilePanelEl !== '' ? (
			_self.options.profilePanelTriggerEl.forEach(element => {
				element.dataset.isActive = 'false';
			}),
			_self.options.profilePanelEl.setAttribute('hidden', true)
		) : '';
	}


	/** 
	 * 
	 * @method updateSubMenuTitle 
	 * @description Helper function to update currect active submenu title
	 * 
	 */
	updateSubMenuTitle() {
		let _self = this;

		// update submenu title
		if (_self.options.currentSubmenuTitleStack.length == 1) {
			_self.options.currentSubmenuTitleEl.textContent = _self.options.currentSubmenuTitleStack[0];
		} else if (_self.options.currentSubmenuTitleStack.length > 1) {
			_self.options.currentSubmenuTitleEl.textContent = _self.options.currentSubmenuTitleStack[_self.options.currentSubmenuTitleStack.length - 1];
		}
	}


	/** 
	 * 
	 * @method slideCurrentSubMenu 
	 * @description Helper function to update currect active main submenu transform property
	 * 
	 */
	slideCurrentSubMenu() {
		let _self = this;

		_self.options.currentSubmenuMainEl.style.transform = `translateX(-${(_self.options.currentSubmenuLevel * 100)}%)`;
	}


	/** 
	 * 
	 * @method subMenuBack 
	 * @description Helper function to handle back event of submenu levels
	 * 
	 */
	subMenuBack() {
		let _self = this;

		// check if submenu stack length is one, if true then close submenu and reset menu. If the stack length is greater than one, then pop one out and go back to one level
		if (_self.options.currentSubmenuElStack.length == 1) {
			_self.resetMenu();
		} else if (_self.options.currentSubmenuElStack.length > 1) {
			// reduce current submenu level
			_self.options.currentSubmenuLevel--;

			// pop the last item from submenu & submenu title stack (after adding back 'hidden' attribute)
			_self.options.currentSubmenuElStack[_self.options.currentSubmenuElStack.length - 1].setAttribute('hidden', true);
			_self.options.currentSubmenuElStack.pop();
			_self.options.currentSubmenuTitleStack.pop();

			// update submenu title
			_self.updateSubMenuTitle();

			// update submenu position
			_self.slideCurrentSubMenu();
		}

		//console.log('submenu back', _self.options);
	}


	/** 
	 * 
	 * @method handleBackButtonClick 
	 * @description Helper function to handle current back button click event
	 * 
	 */
	handleBackButtonClick() {
		let _self = this;

		if (_self.options.currentBackButton !== '' && !_self.options.currentBackButton.classList.contains('js-event-handler-attached')) {
			_self.options.currentBackButton.addEventListener('click', (event) => {
				_self.subMenuBack();

				//console.log('back button clicked', _self.options);
			});

			// adding js injected class to indicate handler is attached and not to add second time
			_self.options.currentBackButton.classList.add('js-event-handler-attached');
		}
	}


	/** 
	 * 
	 * @method handleSubMenuClick 
	 * @param {HTMLElement} element - clicked submenu item.
	 * @description Helper function to handle sub menu click (of current active submenu container)
	 * 
	 */
	handleSubMenuClick(subMenuEl) {
		let _self = this;

		// if subMenuEl has a submenu as next immediate sibling, then proceed further, or else do nothing
		if (subMenuEl.nextElementSibling !== null) {
			//console.log('sub menu exists');

			// update current submenu element and history stack
			_self.options.currentSubmenuEl = subMenuEl.nextElementSibling;
			_self.options.currentSubmenuEl.removeAttribute('hidden'),
				_self.options.currentSubmenuElStack.push(_self.options.currentSubmenuEl);

			// update submenu title stack
			_self.options.currentSubmenuTitleStack.push(subMenuEl.dataset.submenuName);

			// update submenu level
			_self.options.currentSubmenuLevel++;

			// update submenu title
			_self.updateSubMenuTitle();

			// update submenu position
			_self.slideCurrentSubMenu();

			//console.log('sub menu clicked', _self.options);
		} else {
			//console.log('sub menu does not exist');
		}
	}


	/** 
	 * 
	 * @method handleMainMenuClick 
	 * @param {HTMLElement} element - main menu items (which one is clicked).
	 * @description Helper function to handle active main menu
	 * 
	 */
	handleMainMenuClick(mainMenuEl) {
		let _self = this;

		if (mainMenuEl.classList.contains('js-event-handler-attached')) {
			// reset the UI & Dash Menu options
			_self.resetMenu();

			return;
		} else {
			// reset the UI & Dash Menu options
			_self.resetMenu();

			// update current current main menu, current main menu title, submenu container element and show the submenu, also update other selectors (if applicable)
			mainMenuEl.dataset.targetSubmenuContainer ? (
				_self.options.currentMainMenu = mainMenuEl,
				_self.options.currentMainMenu.classList.add('js-event-handler-attached'),
				_self.options.currentMainMenu.dataset.isActive = true,
				_self.options.currentMainMenuTitle = mainMenuEl.dataset.mainMenuName,
				_self.options.currentSubmenuContainer = document.querySelector(`[data-submenu-container-id="${mainMenuEl.dataset.targetSubmenuContainer}"]`),
				_self.options.currentSubmenuContainer.removeAttribute('hidden'),
				_self.options.currentSubmenuMainEl = _self.options.currentSubmenuContainer.querySelector('[data-submenu]'),
				_self.options.currentBackButton = _self.options.currentSubmenuContainer.querySelector('[data-back-button]'),
				_self.options.currentSubmenuTitleEl = _self.options.currentSubmenuContainer.querySelector('[data-submenu-title]'),
				_self.options.currentSubmenuTitleStack.push(mainMenuEl.dataset.mainMenuName),
				_self.options.currentSubmenuEl = _self.options.currentSubmenuContainer.querySelector('[data-submenu]'),
				_self.options.currentSubmenuEl.removeAttribute('hidden'),
				_self.options.currentSubmenuElStack.push(_self.options.currentSubmenuContainer.querySelector('[data-submenu]'))
			) : '';

			// attach event handler to back button (if not already attached)
			_self.handleBackButtonClick();

			// handle sub menu click event (only once)\
			if (!_self.options.currentSubmenuContainer.classList.contains('js-event-handler-attached')) {
				_self.handleEvent(_self.options.currentSubmenuContainer, "click", _self.options.subMenuSelector, function(el, event) {
					_self.handleSubMenuClick(el);
				});

				_self.options.currentSubmenuContainer.classList.add('js-event-handler-attached');
			}

			//console.log('main menu clicked', _self.options);
		}
	}


	/** 
	 * 
	 * @method handleDashNavElClick 
	 * @param {HTMLElement} element - main dashboard <nav> element.
	 * @description Attached and listens to click event on dashNavEl element
	 * 
	 */
	handleDashNavElClick(dashNavEl) {
		let _self = this;

		// handle main menu click event (if has a corresponding submenu)
		this.handleEvent(dashNavEl, "click", _self.options.mainMenuSelector, function(el, event) {
			el.dataset.targetSubmenuContainer ? _self.handleMainMenuClick(el) : _self.resetMenu();
		});
	}


	/** 
	 * 
	 * @method handleFloatingMenu 
	 * @description independent method to handle floating menu behavior (hide the floating menu panel and show on click on "more" button)
	 * 
	 */
	handleFloatingMenu() {
		let _self = this;

		// handle click on trigger (attach event only once)
		if ( _self.options.floatingPanelTriggerEl.classList.contains('js-event-handler-attached') ) {
			return;
		}
		else {
			_self.options.floatingPanelTriggerEl.addEventListener('click', (evt) => {
				//console.log('Floating trigger click');

				if ( _self.options.floatingPanelTriggerEl.querySelector('a[data-floating-panel-trigger-btn]').dataset.isActive !== 'true' ) {
					_self.resetMenu();

					_self.options.floatingPanelTriggerEl.querySelector('a[data-floating-panel-trigger-btn]').dataset.isActive = 'true';
					_self.options.floatingPanelEl.dataset.isActive = 'true';
				}
				else {
					_self.resetMenu();
				}
			});

			_self.options.floatingPanelTriggerEl.classList.add('js-event-handler-attached');
		}
	}


	/** 
	 * 
	 * @method handleNotificationPanel 
	 * @description method to handle notification panel behavior
	 * 
	 */
	handleNotificationPanel() {
		let _self = this;

		// loop through the triggers
		_self.options.notificationsPanelTriggerEl.forEach( (trigger) => {
			// handle click on trigger (attach event only once)
			if ( trigger.classList.contains('js-event-handler-attached') ) {
				return;
			}
			else {
				trigger.addEventListener('click', (event) => {
					//console.log('Navigation Panel trigger click');

					if ( trigger.dataset.isActive !== 'true' ) {
						_self.resetMenu();

						trigger.dataset.isActive = 'true';
						_self.options.notificationsPanelEl.removeAttribute('hidden');
					}
					else {
						_self.resetMenu();
					}
				});

				trigger.classList.add('js-event-handler-attached');
			}
		});

		// handle click on back button (attach event only once)
		if ( _self.options.notificationsPanelEl.querySelector('[data-back-button]').classList.contains('js-event-handler-attached') ) {
			return;
		}
		else {
			_self.options.notificationsPanelEl.querySelector('[data-back-button]').addEventListener('click', (event) => {
				//console.log('Floating trigger click');

				_self.resetMenu();
			});

			_self.options.notificationsPanelEl.querySelector('[data-back-button]').classList.add('js-event-handler-attached');
		}
	}


	/** 
	 * 
	 * @method handleProfilePanel 
	 * @description method to handle profile panel behavior
	 * 
	 */
	handleProfilePanel() {
		let _self = this;

		// loop through the triggers
		_self.options.profilePanelTriggerEl.forEach( (trigger) => {
			// handle click on trigger (attach event only once)
			if ( trigger.classList.contains('js-event-handler-attached') ) {
				return;
			}
			else {
				trigger.addEventListener('click', (event) => {
					//console.log('Navigation Panel trigger click');

					if ( trigger.dataset.isActive !== 'true' ) {
						_self.resetMenu();

						trigger.dataset.isActive = 'true';
						_self.options.profilePanelEl.removeAttribute('hidden');
					}
					else {
						_self.resetMenu();
					}
				});

				trigger.classList.add('js-event-handler-attached');
			}
		});

		// handle click on back button (attach event only once)
		if ( _self.options.profilePanelEl.querySelector('[data-back-button]').classList.contains('js-event-handler-attached') ) {
			return;
		}
		else {
			_self.options.profilePanelEl.querySelector('[data-back-button]').addEventListener('click', (event) => {
				//console.log('Floating trigger click');

				_self.resetMenu();
			});

			_self.options.profilePanelEl.querySelector('[data-back-button]').classList.add('js-event-handler-attached');
		}

		// handle profile dotted button click
		_self.options.profileDottedButtonEl.addEventListener('click', (evt) => {
			if ( _self.options.profileDottedButtonEl.dataset.isActive === 'false' ) {
				_self.options.profileDottedButtonEl.dataset.isActive = 'true';
			}
			else {
				_self.options.profileDottedButtonEl.dataset.isActive = 'false';
			}
		});

		// handle profile auto repost setting toggle
		_self.options.profileAutoRepostSettingTriggerEl.addEventListener('click', (evt) => {
			if ( _self.options.profileAutoRepostSettingTriggerEl.dataset.isActive === 'false' ) {
				_self.options.profileAutoRepostSettingTriggerEl.dataset.isActive = 'true';
				_self.options.profileAutoRepostSettingEl.dataset.isActive = 'true';
			}
			else {
				_self.options.profileAutoRepostSettingTriggerEl.dataset.isActive = 'false';
				_self.options.profileAutoRepostSettingEl.dataset.isActive = 'false';
			}
		});
	}


	/** 
	 * 
	 * @method handleMobileNav 
	 * @description method to handle mobile nav open close
	 * 
	 */
	handleMobileNav() {
		let _self = this;

		// open mobile nav
		_self.options.mobileNavOpenTriggerEl.addEventListener('click', (evt) => {
			_self.options.mobileNavEl.dataset.isActive = true;
		});

		// close mobile nav
		_self.options.mobileNavCloseTriggerEl.addEventListener('click', (evt) => {
			_self.options.mobileNavEl.dataset.isActive = false;
		});
	}


	/** 
	 * 
	 * @method init
	 * @description Initializes the main DashMenu App by calling additional UI methods as well as core methods.
	 * 
	 * @returns {Boolean} Returns boolean.
	 * 
	 */
	init() {
		//console.log('%c DashMenu init', 'background: #3300ff; color: white; padding: 8px; border-radius: 4px;');

		let _self = this;

		//console.log(this.options);

		// check if dash nav is present in the DOM, otherwise exit
		if ( document.querySelector(this.options.dashNavElSelector) !== null && document.querySelector(this.options.dashNavElSelector) !== 'undefined') {
			//console.log('%c Valid "Dashboard Main Nav Found", Start Application.', 'background: #fb5ba2; color: white; padding: 8px; border-radius: 4px;');

			// update initial vars
			this.options.screenSizeDesktop = window.screen.width > 1024 ? true : false;
			this.options.screenSizeTablet = window.screen.width >= 768 && window.screen.width <= 1024 ? true : false;
			this.options.screenSizeMobile = window.screen.width < 768 ? true : false;

			// update initial selectors
			this.options.dashNavEl = document.querySelector(this.options.dashNavElSelector);

			// attach click handler to dashNavEl
			this.handleDashNavElClick(this.options.dashNavEl);

			// handle floating menu panel (if the panel structure exists in DOM, mobile nav will not have it)
			if ( this.options.dashNavEl.querySelector(this.options.floatingPanelWrapperSelector) !== null && this.options.dashNavEl.querySelector(this.options.floatingPanelWrapperSelector) !== 'undefined') {
				this.options.floatingPanelWrapperEl = this.options.dashNavEl.querySelector(this.options.floatingPanelWrapperSelector);
				this.options.floatingPanelEl = this.options.dashNavEl.querySelector(this.options.floatingPanelSelector);
				this.options.floatingPanelTriggerEl = this.options.dashNavEl.querySelector(this.options.floatingPanelTriggerSelector);

				// call floating menu method
				this.handleFloatingMenu();
			}

			// handle notification panel (if the panel exists in DOM)
			if ( document.querySelector(this.options.notificationsPanelSelector) !== null && document.querySelector(this.options.notificationsPanelSelector) !== 'undefined' ) {
				this.options.notificationsPanelTriggerEl = document.querySelectorAll(this.options.notificationsPanelTriggerSelector);
				this.options.notificationsPanelEl = document.querySelector(this.options.notificationsPanelSelector);

				this.handleNotificationPanel();
			}

			// handle profile panel (if the panel exists in DOM)
			if ( document.querySelector(this.options.profilePanelSelector) !== null && document.querySelector(this.options.profilePanelSelector) !== 'undefined' ) {
				this.options.profilePanelTriggerEl = document.querySelectorAll(this.options.profilePanelTriggerSelector);
				this.options.profilePanelEl = document.querySelector(this.options.profilePanelSelector);

				this.options.profileDottedButtonEl = document.querySelector(this.options.profileDottedButtonSelector);

				this.options.profileAutoRepostSettingTriggerEl = document.querySelector(this.options.profileAutoRepostSettingTriggerSelector);
				this.options.profileAutoRepostSettingEl = document.querySelector(this.options.profileAutoRepostSettingSelector);

				this.handleProfilePanel();
			}

			// handle mobile nav (if the panel exists in DOM)
			if ( document.querySelector(this.options.mobileNavSelector) !== null && document.querySelector(this.options.mobileNavSelector) !== 'undefined' ) {
				this.options.mobileNavOpenTriggerEl = document.querySelector(this.options.mobileNavOpenTriggerSelector);
				this.options.mobileNavCloseTriggerEl = document.querySelector(this.options.mobileNavCloseTriggerSelector);
				this.options.mobileNavEl = document.querySelector(this.options.mobileNavSelector);

				this.handleMobileNav();
			}
			
			//console.log(this.options);

			// handle "Esc" key event to close the submenu (if opened)
			document.addEventListener('keydown', function(event) {
				// close submenu
				event.key === 'Escape' ? _self.resetMenu() : '';

				// go one step back of submenu level
				event.key === 'Backspace' ? _self.subMenuBack() : '';
			});

			return true;
		}
		else {
			//console.log('%c No Valid "Dashboard Main Nav Found", Exit Application.', 'background: tomato; color: white; padding: 8px; border-radius: 4px;');
		}
	}
}


/**
 * 
 * @class DashCurrentPageDetector
 * @author Abirlal Maiti <abirlal.maiti@gmail.com>
 * @classdesc Fansocial Dashboard - Detect Current Active Page
 * When initialized, it will search and match the last two segments of 'window.location.href' with matching 'data-page' attribute and mark the menu item (parents as well if applicable) as current page
 * 
 */
class DashCurrentPageDetector {
  constructor() {
    this.menuItems = document.querySelectorAll('[data-current-page-detector]'); // get all menu items
  }


	/** 
	 * 
	 * @method detectCurrentPage 
	 * @description Detects current page based on location.href and highlights the corresponding menu item
	 * 
	 */
  detectCurrentPage() {
    const url = new URL(window.location.href); // get location href
    const pathname = url.pathname; // get only pathname
    const pathSegments = pathname.replace(/^\//, '').replace(/\/$/, '').split('/'); // create array of path segments
    const lastTwoSegments = pathSegments.length > 1 ? pathSegments.slice(-2).join('/') : pathSegments.join('/'); // take and join only last two

    this.menuItems.forEach((item) => {
			// retrieve the data-page attribute, ensuring it's formatted without leading/trailing slashes
      const dataPage = item.getAttribute('data-page').replace(/^\//, '').replace(/\/$/, '');

			// if match found then call marking method for further processing
      if (lastTwoSegments === dataPage) {
        this.markCurrentPage(item);
      }
    });
  }


	/** 
	 * 
	 * @method markCurrentPage 
	 * @description Highlights the selected menu item and (if applicable) it's parents (in case of submenu items)
	 * 
	 */
  markCurrentPage(item) {
		// get current page menu item
    const menuItem = item.closest('[data-current-page-detector]');
    menuItem.classList.add('is-current-page');

    // Traverse parent li elements and add class (in case of submenu items)
    let parentMenuItem = menuItem.parentElement.closest('[data-current-page-detector]');
    while (parentMenuItem) {
      parentMenuItem.classList.add('is-current-page');
      parentMenuItem = parentMenuItem.parentElement.closest('[data-current-page-detector]');
    }

    // if item is part of a submenu then try getting the submenu
    const submenuContainer = item.closest('[data-submenu-container]');

		// if matched as submenu then highlight corresponding main menu item
    if (submenuContainer) {
      const mainMenuItem = document.querySelector(`[data-main-menu-item][data-target-submenu-container="${submenuContainer.dataset.submenuContainerId}"]`);
      if (mainMenuItem) {
        mainMenuItem.closest('[data-current-page-detector]').classList.add('is-current-page');
      }
    }
  }
}


/**
 * 
 * @class DashSidebarMenuAdjuster
 * @author Abirlal Maiti <abirlal.maiti@gmail.com>
 * @classdesc Fansocial Dashboard - Adjust Number of Sidebar Main Menu Items and Show/Hide Floating Menu Panel
 * When initialized, it will calculate how many main menu item will fit in the main menu panel, the rest of menu items will be moved to floating panel and vice versa
 * 
 */
class DashSidebarMenuAdjuster {
  constructor() {
    this.menuItems = document.querySelectorAll('[data-menu-panel-wrapper] [data-sidebar-menu-item]'); // get all main menu items
    this.menuPanel = document.querySelector('[data-menu-panel]'); // main menu container panel
    this.floatingPanel = document.querySelector('[data-floating-panel]'); // floating main menu container panel
    this.moreButton = document.querySelector('[data-floating-panel-trigger]'); // floating menu panel trigger

    this.windowHeight = window.innerHeight; // get current window height
    this.menuItemHeight = this.menuPanel.querySelector('[data-sidebar-menu-item]').getBoundingClientRect().height + 4; // calculate single menu item height with addition of 4px as flex gap compensation
		this.desktopLogoHeight = document.querySelector('[data-site-logo][data-desktop-only]').getBoundingClientRect().height; // calculate desktop logo height
		this.desktopTopControlsHeight = document.querySelector('[data-sidebar-top-controls][data-desktop-only]').getBoundingClientRect().height; // calculate desktop top controls height
		this.desktopBottomControlsHeight = document.querySelector('[data-sidebar-bottom-controls]:not(.dn)').getBoundingClientRect().height; // calculate desktop bottom controls height

		// logic - height of other elements + (12px padding y of sidebar wrapper) + (6px * 3 flex gap compensation) + 'more' menu item height
    this.otherElementsHeight = this.desktopLogoHeight + this.desktopTopControlsHeight + this.desktopBottomControlsHeight + (12 * 2) + (6 * 3) + this.menuItemHeight; 

    this.maxVisibleItems = Math.floor((this.windowHeight - this.otherElementsHeight) / this.menuItemHeight); // calculate number of possible visible items
  }


	/** 
	 * 
	 * @method debounce 
	 * @description Added a delay between rapidly thorwing events (resize, scroll etc.)
	 * 
	 */
  debounce(func, wait) {
    let timeout;

    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }


	/** 
	 * 
	 * @method adjustMenu 
	 * @description Moves/Restores main menu items from menu panel to floating panel and shows/hides floating panel trigger
	 * 
	 */
  adjustMenu() {
		console.log('adjustMenu - start excute');

    if (window.innerWidth <= 767) {
      // move items back to menu panel if window width is less than or equal to 767px
      const floatingItems = this.floatingPanel.children;

      while (floatingItems.length > 0) {
        this.menuPanel.appendChild(floatingItems[0]);
      }

      this.moreButton.hidden = true;
    } 

		else {
			 // get current window height
			this.windowHeight = window.innerHeight;

			// calculate number of possible visible main items inside menu panel
			this.maxVisibleItems = Math.floor((this.windowHeight - this.otherElementsHeight) / this.menuItemHeight);
			console.log(this.menuItems.length, this.maxVisibleItems);

      if (this.menuItems.length > this.maxVisibleItems) {
        // move excess items to floating panel
        for (let i = this.maxVisibleItems; i < this.menuItems.length; i++) {
          const excessItem = this.menuItems[i];
          this.floatingPanel.appendChild(excessItem);
        }

        this.moreButton.hidden = false;
      } 

			else {
        // move items back to menu panel
        const floatingItems = this.floatingPanel.children;

        while (floatingItems.length > 0) {
          this.menuPanel.appendChild(floatingItems[0]);
        }

        this.moreButton.hidden = true;
      }
    }
  }


	/** 
	 * 
	 * @method init 
	 * @description Initiates the class execution
	 * 
	 */
  init() {
    this.adjustMenu();

    window.addEventListener('resize', this.debounce(() => this.adjustMenu(), 200));

    window.addEventListener('load', this.adjustMenu.bind(this));
  }
}


/**
 * 
 * @class DashProfileStatusDropdown
 * @author Abirlal Maiti <abirlal.maiti@gmail.com>
 * @classdesc Fansocial Dashboard Profile Submenu Status Dropdowns UI behavior and handlers
 * Once clicked any dropdown trigger, the dropdown will open and accept "click" on the dropdown options as user interaction and change dropdown trigger values and will throw a custom event
 * 
 */
class DashProfileStatusDropdown {
	static instances = []; // to hold all status dropdown instances

  constructor(element) {
    this.element = element; // main dropdown wrapper [data-js-status-dropdown]
    this.trigger = element.querySelector('[data-status-dropdown-trigger]'); // dropdown trigger element [data-status-dropdown-trigger]
    this.dropdown = element.querySelector('[data-status-dropdown]'); // the dropdown list wrapper [data-status-dropdown]
    this.statusTypes = element.querySelectorAll('[data-status-type]'); // status types list items, holds the status values [data-status-type]
    this.currentStatusText = element.querySelector('[data-current-status-text]'); // dropdown trigger text content, shows current selected status [data-current-status-text]
    this.currentStatusValue = element.querySelector('[data-current-status-value]'); // hidden input field to hold currently selected status value [data-current-status-value]
    this.isOpen = false; // flag

		// update the static instance
		DashProfileStatusDropdown.instances.push(this);

		// bind user "click" event listener to open/close the status dropdown list
    this.trigger.addEventListener('click', this.toggleDropdown.bind(this));

		// bind user "click" event listener to each of the status types list items to detect which one has been selected
    this.statusTypes.forEach((statusType) => {
      statusType.addEventListener('click', this.updateStatus.bind(this));
    });

		// to close any other open instances
		document.addEventListener('click', this.handleOutsideClick.bind(this));
  }


	/** 
	 * 
	 * @method toggleDropdown 
	 * @description Open/Close the current dropdown list
	 * 
	 */
  toggleDropdown() {
		// close any other open instances
		DashProfileStatusDropdown.instances.forEach((instance) => {
      if (instance !== this) {
        instance.isOpen = false;
        instance.element.setAttribute('data-is-open', instance.isOpen);
      }
    });

    this.isOpen = !this.isOpen;
    this.element.setAttribute('data-is-open', this.isOpen);
  }


	/** 
	 * 
	 * @method updateStatus 
	 * @description Updates dropdown with user selected status
	 * 
	 */
  updateStatus(event) {
		// get selected status value
    const statusType = event.target.getAttribute('data-status-type');

		// update with selected value
		this.trigger.dataset.currentStatus = statusType;
    this.currentStatusText.textContent = statusType.charAt(0).toUpperCase() + statusType.slice(1);
    this.currentStatusValue.value = statusType;
    this.element.setAttribute('data-current-status', statusType);

		// throw custom event
    this.throwEvent();

		// toggle the dropdown
    this.toggleDropdown();
  }
	

	/** 
	 * 
	 * @method throwEvent 
	 * @description Throws a custom event
	 * 
	 */
  throwEvent() {
		// get the event name to throw
    const eventName = this.element.getAttribute('data-throw-event');

		// create payload to be sent with event
		let payload = {
			statusChange: true,
			statusValue: this.currentStatusValue.value
		}

		// create custom event
    const event = new CustomEvent(eventName, { detail: {payload} });

		// throw the event ( usage: document.addEventListener('custom_eventName', (evt) => { console.log('status changed', evt.detail); }); )
    document.dispatchEvent(event);
  }
	

	/** 
	 * 
	 * @method handleOutsideClick 
	 * @description Handles click outside of the instance and closes it
	 * 
	 */
  handleOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.isOpen = false;
      this.element.setAttribute('data-is-open', this.isOpen);
    }
  }
}


/**
 * 
 * @class DashStatusMessageEditor
 * @author Abirlal Maiti <abirlal.maiti@gmail.com>
 * @classdesc Fansocial Dashboard Profile Status Messages Editor UI behavior and handlers
 * Clicking "Edit" button will enable editing, count characters entered, cancel edited text, save edited text and thorw custom event with details
 * 
 */
class DashStatusMessageEditor {
  constructor(element) {
    this.element = element; // main massage editor wrapper
    this.textbox = element.querySelector('[data-online-status-message-text]'); // hidden input field to hold message
    this.editButton = element.querySelector('[data-online-status-message-edit]'); // edit message button element
    this.editControls = element.querySelector('[data-online-status-message-edit-controls]'); // word count, cancel, save elements wrapper
    this.wordCount = element.querySelector('[data-online-status-message-edit-word-count]'); // word count element
    this.cancelButton = element.querySelector('[data-online-status-message-edit-cancel]'); // cancel edit button element
    this.saveButton = element.querySelector('[data-online-status-message-edit-save]'); // save edit button element
    this.isEditing = false; // flag
    this.previousText = this.textbox.value; // container to restore previous text in cancelled

		// bind 'click' event to enable editing
    this.editButton.addEventListener('click', this.enableEditing.bind(this));

		// bind 'click' event to cancel editing
    this.cancelButton.addEventListener('click', this.cancelEditing.bind(this));

		// bind 'click' event to save new edited message
    this.saveButton.addEventListener('click', this.saveEditing.bind(this));

		// bind 'keyup' event to count characters
    this.textbox.addEventListener('input', this.updateWordCount.bind(this));

		// count characters
		this.updateWordCount();
  }


	/** 
	 * 
	 * @method enableEditing 
	 * @description Enables the current instance for editing
	 * 
	 */
  enableEditing() {
    this.isEditing = true;

    this.element.setAttribute('data-is-editing', this.isEditing);
    this.textbox.removeAttribute('readonly');
  }


	/** 
	 * 
	 * @method cancelEditing 
	 * @description Canceles the current edited text and restores previous text
	 * 
	 */
  cancelEditing() {
    this.isEditing = false;

    this.element.setAttribute('data-is-editing', this.isEditing);
    this.textbox.setAttribute('readonly', '');
    this.textbox.value = this.previousText;

		// count characters
		this.updateWordCount();
  }


	/** 
	 * 
	 * @method saveEditing 
	 * @description Saves the current edited text and disbales editing
	 * 
	 */
  saveEditing() {
    this.isEditing = false;

    this.element.setAttribute('data-is-editing', this.isEditing);
    this.textbox.setAttribute('readonly', '');
    this.previousText = this.textbox.value;

		// count characters
		this.updateWordCount();

		// throw custom event
    this.throwEvent();
  }


	/** 
	 * 
	 * @method updateWordCount 
	 * @description Keeps track of characters entered and does not let the char count go beyond 100
	 * 
	 */
	updateWordCount() {
    const characterCount = this.textbox.value.length;
    this.wordCount.textContent = `${characterCount}/100`;

		// restrict characters upto 100 only (can be made dynamic by passing additional data-* attribute to instance)
    if ( characterCount > 100 ) {
      this.textbox.value = this.textbox.value.substring(0, 100);
    }
  }


	/** 
	 * 
	 * @method throwEvent 
	 * @description Invokes a custom event with details
	 * 
	 */
	throwEvent() {
    // get the event name to throw
    const eventName = this.element.getAttribute('data-throw-event');

		// create payload to be sent with event
		let payload = {
			textStatusChange: true,
			textStatusValue: this.textbox.value
		}

		// create custom event
    const event = new CustomEvent(eventName, { detail: {payload} });

		// throw the event ( usage: document.addEventListener('custom_eventName', (evt) => { console.log('status changed', evt.detail); }); )
    document.dispatchEvent(event);
  }
}


/**
 * 
 * @class DashToggleSwitch
 * @author Abirlal Maiti <abirlal.maiti@gmail.com>
 * @classdesc Fansocial Dashboard Profile Toggle Switches UI behavior and handlers
 * Switching the toggles on/off will dispatch a custom event for further actions
 * 
 */
class DashToggleSwitch {
  constructor(element) {
    this.element = element;
    this.input = element.querySelector('input[type="checkbox"]');

    this.input.addEventListener('change', this.handleChange.bind(this));
  }


	/** 
	 * 
	 * @method handleChange 
	 * @description Handle on change event of toggle checkbox
	 * 
	 */
  handleChange() {
    const isChecked = this.input.checked;
		
		// do any additional stuff if needed
		//console.log('Switch is on: ', isChecked);

		// throw event
		this.throwEvent();
  }


	/** 
	 * 
	 * @method throwEvent 
	 * @description Invokes a custom event with details
	 * 
	 */
	throwEvent() {
		// get the event name to throw
    const eventName = this.element.getAttribute('data-throw-event');
		const isChecked = this.input.checked;

		// create payload to be sent with event
		let payload = {
			switchChanged: true,
			switchIsOn: isChecked
		}

		// create custom event
    const event = new CustomEvent(eventName, { detail: {payload} });

		// throw the event ( usage: document.addEventListener('custom_eventName', (evt) => { console.log('status changed', evt.detail); }); )
    document.dispatchEvent(event);
  }
}


/**
 * 
 * @class DashTabs
 * @author Abirlal Maiti <abirlal.maiti@gmail.com>
 * @classdesc Fansocial Dashboard Profile Tabs UI behavior and handlers
 * Clicking on Tab triggers under tab head will make the corresponding tab content container active and throw a custom event with details
 * 
 */
class DashTabs {
  constructor(element) {
    this.element = element; // the main tab wrapper element
    this.tabTriggers = element.querySelectorAll('[data-tab-trigger]'); // the tab trigger elements
    this.tabContents = element.querySelectorAll('[data-tabbed-content]'); // the tab content containers (id'd)

		// attach event handler (click) to the triggers
    this.tabTriggers.forEach((trigger) => {
      trigger.addEventListener('click', this.handleTabTriggerClick.bind(this));
    });
  }


	/** 
	 * 
	 * @method handleTabTriggerClick 
	 * @description Handles click event on tab triggers
	 * 
	 */
  handleTabTriggerClick(event) {
    const trigger = event.target; // current clicked trigger element

		// detect target tab content container ID and the target content container element
    const targetTabContentId = trigger.closest('[data-tab-head-list-item]').getAttribute('data-tabbed-child-id');
    const targetTabContent = this.element.querySelector(`[data-tabbed-content="${targetTabContentId}"]`);

		// set current clicked trigger as active
    this.updateTabTriggers(trigger);

		// set current target content container as active
    this.updateTabContents(targetTabContent);

		// get payload from trigger's parent 'li[data-tab-head-list-item]' element
    const payload = this.getPayload(trigger);

		// get event name from trigger's data-* attribute
    const eventName = trigger.getAttribute('data-throw-event');
    
		// invoke custom event
		this.throwEvent(eventName, payload);
  }


	/** 
	 * 
	 * @method getPayload 
	 * @description Creates and returns data attributes of parent element of trigger as JSON payload
	 * 
	 */
  getPayload(trigger) {
		// get current trigger element's parent 'li' element
    const tabHeadListItem = trigger.closest('[data-tab-head-list-item]');
    const payload = {};

		// loop through the parent elements data-* attributes and add them as JSON (can use element.dataset as well for camelCase key)
    tabHeadListItem.getAttributeNames().forEach((attribute) => {
      if (attribute.startsWith('data-')) {
        payload[attribute.replace('data-', '')] = tabHeadListItem.getAttribute(attribute);
      }
    });

    return payload;
  }


	/** 
	 * 
	 * @method updateTabTriggers 
	 * @description Toggles active / inactive tab heads
	 * 
	 */
  updateTabTriggers(activeTrigger) {
    this.tabTriggers.forEach((trigger) => {
      if (trigger === activeTrigger) {
        trigger.setAttribute('data-is-active', 'true');
      } else {
        trigger.setAttribute('data-is-active', 'false');
      }
    });
  }


	/** 
	 * 
	 * @method updateTabContents 
	 * @description Toggles active / inactive tab content containers
	 * 
	 */
  updateTabContents(activeTabContent) {
    this.tabContents.forEach((tabContent) => {
      if (tabContent === activeTabContent) {
        tabContent.setAttribute('data-is-active', 'true');
      } else {
        tabContent.setAttribute('data-is-active', 'false');
      }
    });
  }


	/** 
	 * 
	 * @method throwEvent 
	 * @description Invokes a custom event with details
	 * 
	 */
	throwEvent(eventName, payload) {
		// create custom event
    const customEvent = new CustomEvent(eventName, { detail: {payload} });

		// throw the event ( usage: document.addEventListener('custom_eventName', (evt) => { console.log('status changed', evt.detail); }); )
    document.dispatchEvent(customEvent);
  }
}


/**
 * 
 * Initiates JS executions after DOM contents are loaded (equivalant to jQuery $document.on(ready){...})
 * 
 */
document.addEventListener("DOMContentLoaded", (event) => {
	//console.log("DOM fully loaded and parsed");

	// Creates and initializes a new fsDashSideBarHandler
	const fansocialDashSideBarHandler = new DashSideBarHandler({
		dashNavElSelector: '[data-dashboard-main-nav]', // dash menu main selector (desktop)
	});
	fansocialDashSideBarHandler.init();


	// Initialize current page detector
	const currentPageDetector = new DashCurrentPageDetector();
	currentPageDetector.detectCurrentPage();


	// Initialize sidebar menu items adjuster
	const dashSidebarMenuAdjuster = new DashSidebarMenuAdjuster();
	dashSidebarMenuAdjuster.init();


	// Initialize the status dropdown class for all elements with data-js-status-dropdown
	document.querySelectorAll('[data-js-status-dropdown]').forEach((element) => {
		new DashProfileStatusDropdown(element);
	});


	// Initialize the status message editor class for all elements with data-js-status-message-editor
	document.querySelectorAll('[data-js-status-message-editor]').forEach((element) => {
		new DashStatusMessageEditor(element);
	});


	// Initialize the profile switch toggle class for all elements with data-switch
	document.querySelectorAll('[data-switch]').forEach((element) => {
		new DashToggleSwitch(element);
	});


	// Initialize the tabs class for all elements with data-tab-main-wrapper
	document.querySelectorAll('[data-tab-main-wrapper]').forEach((element) => {
		new DashTabs(element);
	});
});
