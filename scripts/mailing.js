$(document).ready(function() {
    $("#mailing_form").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            email2: {
                required: true,
                email: true,
                equalTo: "#email"
            },
            f_name: {
                required: true
            },
            l_name: {
                required: true
            }
        },
        messages: {
            f_name: "Please enter your first name.",
            l_name: "Please enter your last name.",
            email2: "This entry must equal previous entry."
        }
    });
});