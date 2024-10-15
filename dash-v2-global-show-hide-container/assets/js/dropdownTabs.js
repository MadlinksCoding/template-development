/**
 * 
 * @class DropdownTabs
 * @author Abirlal Maiti <abirlal.maiti@gmail.com>
 * 
 * @classdesc Class representing a dropdown-based tab system with responsive behavior.
 * 
 */
class DropdownTabs {
    /**
     * 
     * Initializes the dropdown tabs and sets up event listeners.
     * 
     */
    constructor() {
        this.init(); // Initialize dropdown functionality on page load
        this.addListeners(); // Add listeners to handle dynamically loaded content
    }

    /**
     * 
     * @method init
     * @description Initializes the dropdown functionality for all tab headers.
     * Checks if the tab is of type "dropdown" and sets up responsive behavior.
     * 
     */
    init() {
        // Loop through all elements with "data-tab-header-main"
        document.querySelectorAll('[data-tab-header-main]').forEach( ( tabHeaderMain ) => {
            // check if already JS events are handled
            if ( tabHeaderMain.classList.contains('js-event-handler-attached') ) {
                return;
            }
            else {
                this.setupDropdown(tabHeaderMain); // Set up dropdown if conditions match
                tabHeaderMain.classList.add('js-event-handler-attached');
            }
        });
    }

    /**
     * 
     * @method setupDropdown
     * @param {Element} tabHeaderMain - The tab header element to configure.
     * @description Sets up the dropdown functionality for a specific tab header.
     * 
     */
    setupDropdown( tabHeaderMain ) {
        const dropdownType = tabHeaderMain.getAttribute('data-responsive-tab-header-type');
        if ( dropdownType !== 'dropdown' ) return; // Exit if the tab type is not "dropdown"

        // Get the responsive breakpoint, default to 767 if not available or "default"
        let responsiveBreakpoint = tabHeaderMain.getAttribute('data-responsive-breakpoint');
        responsiveBreakpoint = responsiveBreakpoint && responsiveBreakpoint !== 'default' ?
            parseInt(responsiveBreakpoint) :
            767;

        /**
         * Toggles the dropdown active state based on window width.
         */
        const handleResponsiveCheck = () => {
            const dropdownTabActive = window.innerWidth <= responsiveBreakpoint ? 'true' : 'false';
            tabHeaderMain.setAttribute('data-dropdown-tab-active', dropdownTabActive);
        };

        handleResponsiveCheck(); // Initial check
        window.addEventListener('resize', handleResponsiveCheck); // Check again on window resize

        this.addClickListener(tabHeaderMain); // Add click event listener to dropdown trigger
        this.addOutsideClickListener(tabHeaderMain); // Handle clicks outside the dropdown
        this.addTabChangeListener(tabHeaderMain); // Handle custom tab-change events
    }

    /**
     * 
     * @method addClickListener
     * @param {Element} tabHeaderMain - The tab header element to add the listener to.
     * @description Adds a click listener to the dropdown trigger.
     * Toggles the "data-is-active" state when clicked.
     * 
     */
    addClickListener( tabHeaderMain ) {
        const dropdownTrigger = tabHeaderMain.querySelector('[data-dropdown-tab-trigger]');
        if (!dropdownTrigger) return; // Exit if no dropdown trigger exists

        dropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the outside click listener
            const isActive = dropdownTrigger.getAttribute('data-is-active') === 'true';
            dropdownTrigger.setAttribute('data-is-active', isActive ? 'false' : 'true');
        });
    }

    /**
     * 
     * @method addOutsideClickListener
     * @param {Element} tabHeaderMain - The tab header element to add the listener to.
     * @description Adds event listeners to close the dropdown when clicking outside of it or pressing ESC.
     * 
     */
    addOutsideClickListener( tabHeaderMain ) {
        const dropdownTrigger = tabHeaderMain.querySelector('[data-dropdown-tab-trigger]');
        if (!dropdownTrigger) return;

        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!tabHeaderMain.contains(e.target)) {
                dropdownTrigger.setAttribute('data-is-active', 'false');
            }
        });

        // Close dropdown on ESC key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdownTrigger.setAttribute('data-is-active', 'false');
            }
        });
    }

    /**
     * 
     * @method addTabChangeListener
     * @param {Element} tabHeaderMain - The tab header element to add the listener to.
     * @description Adds a listener for a custom "tab-change" event to update the dropdown label.
     * 
     */
    addTabChangeListener( tabHeaderMain ) {
        const dropdownTriggerLabel = tabHeaderMain.querySelector('[data-dropdown-tab-trigger] span');
        if (!dropdownTriggerLabel) return;

        // Listen for "tab-change" event on the document
        document.addEventListener('tab-change', (e) => {
            const {
                tabId
            } = e.detail; // Get tabId from event details
            const matchingTab = tabHeaderMain.querySelector(`[data-tabbed-child-id="${tabId}"]`);

            if (matchingTab) {
                // Update dropdown label to the clicked tab's label
                const newLabel = matchingTab.querySelector('[data-tab-label]').textContent;
                dropdownTriggerLabel.textContent = newLabel;
                // Close the dropdown
                tabHeaderMain.querySelector('[data-dropdown-tab-trigger]').setAttribute('data-is-active', 'false');
            }
        });
    }

    /**
     * 
     * @method addListeners
     * @description Adds event listeners for handling dynamic content loading (e.g., via AJAX).
     * Re-initializes the dropdown tabs when new content is added to the page.
     * 
     */
    addListeners() {
        // Use MutationObserver to monitor changes in the DOM
        const observer = new MutationObserver(() => {
            this.init(); // Re-initialize when new content is added
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        }); // Observe the whole body
    }
}

/**
 * 
 * Initiates JS executions after DOM contents are loaded (equivalant to jQuery $document.on(ready){...})
 * 
 */
document.addEventListener("DOMContentLoaded", (e) => {
    // Instantiate the class to apply the functionality
    const dropdownTabs = new DropdownTabs();
});