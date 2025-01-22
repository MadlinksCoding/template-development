<?php
$show_alert = $_REQUEST['show_alert'] ?? false;
?>
<style>
    #dashboard-template-content-container {
    height: 100%;
    }
</style>
<!-- main section --> <!-- nay changed h--screen to h-100 -->
<main data-dashboard-page="" data-section="main" class="h-100 flex flex-column flex--max relative w--100-responsive-tablet overflow--x--hidden-resposnive-tablet">
    <?php \MadLinksCoding\Template::load_template( '/template-parts/dashboard/x-templates/main-list-view.php' ); ?>

    <div class="fixed right--24 bottom--24 flex flex-column items-end gap--8 z-9999 fixed--responsive-mobile-portrait"> <!-- maia change from z-999 to z-9999 -->
        <!-- Add New Button -->
        <div class="flex">
        <?php
            $add_x_automations_args = array( 
                'text' => \MadLinksCoding\Translate::translate( 'Add New' ),
                'button_color' => 'from-css',
                'custom_class' => 'h--40 pad--x--8 items-center gap--10 justify-center relative',
                'text_wrapper_class' => 'h--40 pad--x--8 flex items-center gap--10 justify-center relative',
                'text_class' => 'flex fs--18 fw5 lh--28 black',
                'size' => 'medium',
                'icon_name' => 'plus-square',
                'icon_position' => 'left',
                'icon_class' => 'w--24 h--24 filter--col--black flex-none',
                'use_img_as_icon' => true,
                'attributes' => array( 
                    'data-button-style' => 'shadow-btn',
                    'data-button-color' => 'green',
                ),
                'new_dashboard' => true,
                'adjust_padding' => false,
            );

            // Modify for desktop view
            $desktop_add_x_automations_args = array_merge(
                $add_x_automations_args,
                array(
                    'custom_class' => $add_x_automations_args['custom_class'] . ' flex display--none-responsive-mobile display--none-responsive-mobile-portrait',
                    'attributes' => array_merge(
                        $add_x_automations_args['attributes'],
                        array('onclick' => "open_popup({'target': '#add-x-automation'});")
                    ),
                )
            );

            // Modify for mobile view
            $mobile_add_x_automations_args = array_merge(
                $add_x_automations_args,
                array(
                    'custom_class' => $add_x_automations_args['custom_class'] . ' dn display--flex-responsive-mobile display--flex-responsive-mobile-portrait',
                    'attributes' => array_merge(
                        $add_x_automations_args['attributes'],
                        array('onclick' => "open_popup({'target': '#add-x-automation-mobile'});")
                    ),
                )
            );

            // Render buttons
            \MadLinksCoding\UI_Components::render_button( $desktop_add_x_automations_args );
            \MadLinksCoding\UI_Components::render_button( $mobile_add_x_automations_args );
            ?>

        </div>
        <!-- /Add New Button -->
    </div>

    <!-- Alert -->
    <div data-preview-save-alert 
        class="w--464 w--100-responsive-mobile-portrait fixed top--08 right--08 right--0-responsive-mobile-portrait z--11100 dn">
        <div class="flex w-100 relative bb br--col--athens-gray-2">
            <div class="db bg--col--turquoise w--3 h-100 absolute left-0 top-0"></div>
            <div
                class="pad--y--12 pad--x--8 pad--right--18-responsive-mobile-portrait flex gap--16 bg--gd--light-green-to-white flex-auto">
                <div class="flex gap--20 w-100 relative items-start">
                    <!-- Close Icon -->
                    <div class="absolute right-0 top-0 pointer" onclick="this.parentElement.closest('[data-preview-save-alert]').hidden = true;">
                        <?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'close-btn', true, 'w--24, h--24, filter--col--mischka' ); ?>
                    </div>
                    <!-- Close Icon -->
                    <!-- Icons -->
                    <div class="relative">
                        <div class="w--40 h--40 br--8 bg--col--green--10 flex items-center justify-center">
                            <?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'upload-rounded', true, 'w--28, h--28, filter--col--turquoise' ); ?>
                        </div>
                        <div
                            class="w--22 h--22 br--8 bg--col--turquoise flex items-center justify-center absolute right--9-neg top--1-8">
                            <?php echo \MadLinksCoding\UI_Components::render_svg_icon( 'check', true, 'w--16, h--16, filter--col--white' ); ?>
                        </div>
                    </div>
                    <!-- End Icons -->
                    <!-- Right Tecxt -->
                    <div class="flex flex-column flex-auto">
                        <div class="pad--bottom--8 flex flex-column gap--8">
                            <div class="flex justify-between items-center pad--top--4 pad--right--4">
                                <span class="fs--14 fw6 lh--20 col--genoa"><?php echo \MadLinksCoding\Translate::translate( 'New repost automation saved.' ); ?></span>
                            </div>
                        </div>
                    </div>
                    <!-- End Right Tecxt -->
                </div>
            </div>
        </div>
    </div>
    <!-- End Alert -->
    
</main>
<!-- /main section -->
<?php \MadLinksCoding\Template::load_template( '/template-parts/dashboard/x-templates/add-new-popup.php' ); ?>
<?php \MadLinksCoding\Template::load_template( '/template-parts/dashboard/x-templates/preview-save-popup.php' ); ?>
<?php \MadLinksCoding\Template::load_template( '/template-parts/dashboard/x-templates/delete-popup.php' ); ?>
<?php \MadLinksCoding\Template::load_template( '/template-parts/dashboard/x-templates/edit-confirm-popup.php' ); ?>
<?php \MadLinksCoding\Template::load_template( '/template-parts/dashboard/x-templates/add-new-popup-mobile.php' ); ?>
<?php \MadLinksCoding\Template::load_template( '/template-parts/dashboard/x-templates/add-new-popup-metric-mobile.php' ); ?>
<?php \MadLinksCoding\Template::load_template( '/template-parts/dashboard/x-templates/add-new-popup-rules-mobile.php' ); ?>
<?php \MadLinksCoding\Template::load_template( '/template-parts/dashboard/x-templates/add-new-popup-existing.php' ); ?>