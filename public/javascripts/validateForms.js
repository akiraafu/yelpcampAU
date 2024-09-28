 // Example starter JavaScript for disabling form submissions if there are invalid fields
 (function () {
     'use strict'

     // Fetch all the forms we want to apply custom Bootstrap validation styles to
     const forms = document.querySelectorAll('.validated-form')

     // Loop over them and prevent submission
     Array.from(forms)
         /**
          * Adds form validation functionality to each form element
          * @param {NodeList} forms - A collection of form elements to be processed
          * @returns {void} This function does not return a value
          */
         .forEach(function (form) {
             /**
              * Event listener for form submission
              * @param {Event} event - The submit event object
              * @returns {void} This function does not return a value
              */
             form.addEventListener('submit', function (event) {
                 if (!form.checkValidity()) {
                     event.preventDefault()
                     event.stopPropagation()
                 }

                 form.classList.add('was-validated')
             }, false)
         })
 })()