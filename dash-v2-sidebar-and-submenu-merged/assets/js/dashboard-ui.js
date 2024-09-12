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
	 * @method handleFloatingMenuTriggerClick 
	 * @description independent method to handle floating menu behavior (if available screen height is less than 870px, hide the floating menu panel and show on click on "more" button)
	 * 
	 */
	handleFloatingMenuTriggerClick() {
		let _self = this;

		// handle click on trigger (attach event only once)
		if ( _self.options.floatingPanelTriggerEl.classList.contains('js-event-handler-attached') ) {
			return;
		}
		else {
			_self.options.floatingPanelTriggerEl.addEventListener('click', (event) => {
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
	 * @method handleFloatingMenu 
	 * @description independent method to handle floating menu behavior (if available screen height is less than 870px, hide the floating menu panel and show on click on "more" button)
	 * 
	 */
	handleFloatingMenu() {
		let _self = this;

		// check if available screen height is less than 870px, if yes then proceed (applicable only for Desktop)
		if ( _self.options.screenSizeDesktop === true && window.screen.availHeight < 850 ) {
			// show floating pannel trigger button
			_self.options.floatingPanelTriggerEl.removeAttribute('hidden');

			// hide floating panel menu
			_self.options.floatingPanelEl.setAttribute('class', _self.options.floatingPanelEl.dataset.floatingClasses);
			_self.options.floatingPanelEl.dataset.isActive = false;
			_self.options.floatingPanelWrapperEl.dataset.isFloating = true;

			// handle floating menu trigger click
			_self.handleFloatingMenuTriggerClick();
		}
		else {
			// hide floating pannel trigger button
			_self.options.floatingPanelTriggerEl.setAttribute('hidden', true);

			// show floating panel menu as normal
			_self.options.floatingPanelEl.setAttribute('class', _self.options.floatingPanelEl.dataset.normalClasses);
			_self.options.floatingPanelEl.dataset.isActive = false;
			_self.options.floatingPanelWrapperEl.dataset.isFloating = false;
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
		console.log('%c DashMenu init', 'background: #3300ff; color: white; padding: 8px; border-radius: 4px;');

		let _self = this;

		//console.log(this.options);

		// check if dash nav is present in the DOM, otherwise exit
		if ( document.querySelector(this.options.dashNavElSelector) !== null && document.querySelector(this.options.dashNavElSelector) !== 'undefined') {
			console.log('%c Valid "Dashboard Main Nav Found", Start Application.', 'background: #fb5ba2; color: white; padding: 8px; border-radius: 4px;');

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
			console.log('%c No Valid "Dashboard Main Nav Found", Exit Application.', 'background: tomato; color: white; padding: 8px; border-radius: 4px;');
		}
	}
}


/**
 * 
 * @class DashProfileStatusDropdown
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
 * @classdesc Fansocial Dashboard Profile Status Messages Editor UI behavior and handlers
 * Clicking "Edit" button will enable editing, count characters entered, cancel edited text, save edited text and thorw custom event with details
 * Once clicked any dropdown trigger, the dropdown will open and accept "click" on the dropdown options as user interaction and change dropdown trigger values and will throw a custom event
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
    this.textbox.addEventListener('keyup', this.updateWordCount.bind(this));
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
    if ( characterCount >= 100 ) {
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


	// Initialize the status dropdown class for all elements with data-js-status-dropdown
	document.querySelectorAll('[data-js-status-dropdown]').forEach((element) => {
		new DashProfileStatusDropdown(element);
	});


	// Initialize the status message editor class for all elements with data-js-status-message-editor
	document.querySelectorAll('[data-js-status-message-editor]').forEach((element) => {
		new DashStatusMessageEditor(element);
	});
});
