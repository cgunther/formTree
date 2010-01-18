/**
 * jQuery.formTree
 * Copyright (c) 2010 Chris Gunther - chris(at)chrisgunther(dot)net http://chrisgunther.net
 * Dual licensed under MIT and GPL.
 * Date: 1/18/2010
 *
 * @description: Convert text input boxes to file trees listing remote files
 * @author Chris Gunther
 * @version 1.0
 *
 * @param String url URL to script that will return unordered list of files
 * @param Object options Options to control plugin
 */

jQuery.fn.formTree = function(url, options) {
  
  // Default settings
  settings = jQuery.extend({
    directory: 'default',
    selectedClass: 'selected',
    onReady: function(obj) {}
  }, options);
  
  // Iterate over each object passed
  this.each(function() {
    // Determine ID to use for resulting DIV
    id = this.id+'_formTree';
    
    // Insert DIV after input and retreive ordered list
    jQuery(this).after('<div id="'+id+'" class="formTree"/>')
      .next('#'.id).load(url, { selected: jQuery(this).val(), directory: settings.directory }, function() {
        // Hide original form element
        $input = jQuery(this).prev('input').hide();
        
        // New formTree DIV
        $formTree = jQuery(this);
        
        // Collapse all folders so only top-level folders/files are visible initially
        $('ul ul', $formTree).hide();

        // If a file is marked as selected, expand all folders above it so it is visible
        if (jQuery('.'+settings.selectedClass, $formTree).length > 0) {
          jQuery('.'+settings.selectedClass, $formTree).parents('#'+this.id+' ul').show();
        }
        
        // Listen for click events within the DIV
        jQuery('a', $formTree).click(function() {
          if (jQuery(this).next('ul').length > 0) {
            // A folder was clicked, expand/collapse inner UL
            jQuery(this).next('ul').slideToggle();
          } else {
            // A file was clicked, update the INPUT value and mark current file as selected
            jQuery(this).closest('.formTree').prev('input').val(jQuery(this).attr('rel'));
            jQuery('.'+settings.selectedClass, jQuery(this).closest('.formTree')).removeClass(settings.selectedClass);
            jQuery(this).parent().addClass(settings.selectedClass);
          }
          // Prevent default click behavior
          return false;
        });

        // Call callback function, passing it the newly created DIV
        settings.onReady($formTree);
      });
  });
  
  // Play nice and return the jQuery object
  return this;
}
