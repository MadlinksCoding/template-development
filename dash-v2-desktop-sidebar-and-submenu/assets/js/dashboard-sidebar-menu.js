/**
 *
 *  @fileoverview Fansocial Dashboard Sidebar Menu - Logics for behavior of multi level push menu
 *
 *  @author Abirlal Maiti <abirlal.maiti@gmail.com>
 *  @version 1.0.0
 *  @license MIT License
 *
 */


/**
 * 
 * @class dashMenu
 * @classdesc Fansocial Dashboard Sidebar Menu - Logics for behavior of multi level push menu (desktop & mobile) and floating menu panel for small screens
 * Once invoked and initialized using {@link init}, it will create an instance of Fansocial Dash Menu and call all additional constructors and methods.
 * 
 */
class DashMenu {
	constructor(options) {
		this.options = Object.assign({
				screenSizeDesktop: false, // if device screensize is desktop
				screenSizeTablet: false, // if device screensize is tablet
				screenSizeMobile: false, // if device screensize is mobile

				dashNavElSelector: '[data-dashboard-main-nav]', // dash menu main selector
				floatingPanelWrapperSelector: '[data-floating-panel-wrapper]', // floating panel wrapper selector
				floatingPanelSelector: '[data-floating-panel]', // floating panel wrapper selector
				floatingPanelTriggerSelector: '[data-floating-panel-trigger]', // floating panel trigger selector
				mainMenuSelector: '[data-main-menu-item]', // dash main menu items selector
				subMenuSelector: '[data-submenu-item]', // dash sub menu items selector

				dashNavEl: '', // dash menu main container

				floatingPanelWrapperEl: '', // floating panel wrapper element
				floatingPanelEl: '', // floating panel element
				floatingPanelTriggerEl: '', // floating panel trigger element

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

		// check if dah nav is present in the DOM, otherwise exit
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
 * Creates and initializes a new DashMenu
 * 
 */
document.addEventListener("DOMContentLoaded", (event) => {
    //console.log("DOM fully loaded and parsed");

		// we can detect device screen size and based on the screen size, we can pass nav selector of desktop or mobile ( >= 768 is desktop and < 768 is mobile)
		if ( window.screen.width >= 768 ) {
			const fansocialDashMenu = new DashMenu({
				dashNavElSelector: '[data-dashboard-main-nav]', // dash menu main selector (desktop)
			});
			fansocialDashMenu.init();
		}
		else {
			const fansocialDashMenu = new DashMenu({
				dashNavElSelector: '[data-dashboard-main-nav]', // dash menu main selector (mobile)
			});
			fansocialDashMenu.init();
		}
});
