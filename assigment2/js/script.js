/* RECOMMEND PAGE */

function setupRecommendation() {
    var button = document.getElementById("findRecommendBtn");

    if (button) {
        button.onclick = function () {
            var diet = document.getElementById("diet").value;
            var budget = document.getElementById("budget").value;
            var purpose = document.getElementById("purpose").value;

            if (diet == "" || budget == "" || purpose == "") {
                alert("Please select all preferences."); /* Shows error message */
                return;
            }

            /* Stores recommended restaurant */
            var restaurant = "";

             /* Recommendation logic */
            if (diet == "vegan") {
                restaurant = "Green Garden Bistro";
            } else if (diet == "halal") {
                restaurant = "Spice Route Kitchen";
            } else if (budget == "high" && purpose == "business") {
                restaurant = "Sakura Sky Dining";
            } else if (budget == "high") {
                restaurant = "Sunset Grill House";
            } else if (purpose == "date") {
                restaurant = "Roma Flame Trattoria";
            } else {
                restaurant = "Ocean Pearl Seafood";
            }

            /* Shows recommended restaurant */
            alert("Recommended restaurant: " + restaurant);

            /* Redirects user*/
            window.location.href = "reservation.html?restaurant=" + encodeURIComponent(restaurant);
        };
    }
}

/* REGISTER PAGE */

function setupRegisterValidation() {
    var form = document.getElementById("register-form");

    if (form) {
        form.onsubmit = function () {
            var valid = true;

            /* Clears previous errors */
            clearRegisterErrors();

            var username = document.getElementById("username").value;
            var email = document.getElementById("email").value;
            var phone = document.getElementById("phone").value;
            var password = document.getElementById("password").value;
            var confirmPassword = document.getElementById("confirmPassword").value;
            var country = document.getElementById("country").value;

            /* Instead of getting all of the checkboxes or radio buttons */
            var gender = document.querySelector('input[name="gender"]:checked'); 
            var dietaryPrefs = document.querySelectorAll('input[name="dietaryPrefs"]:checked');

            if (username == "") {
                showError("usernameError", "Username is required.");
                valid = false;
            } else if (!/^[A-Za-z0-9_]{5,}$/.test(username)) {
                showError("usernameError", "Username must be at least 5 characters and use only letters, numbers or underscores.");
                valid = false;
            }

            if (email == "") {
                showError("emailError", "Email is required.");
                valid = false;
            } else if (!/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email)) { 
                showError("emailError", "Please enter a valid email.");
                valid = false;
            }

            if (phone == "") {
                showError("phoneError", "Phone number is required.");
                valid = false;
            } else if (!/^[0-9]{8,15}$/.test(phone)) {
                showError("phoneError", "Phone must be digits only, between 8 and 15 digits.");
                valid = false;
            }

            if (password == "") {
                showError("passwordError", "Password is required.");
                valid = false;
            } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{10,}$/.test(password)) {
                showError("passwordError", "Password must be 10 characters and include uppercase, lowercase, number and special character.");
                valid = false;
            }

            if (confirmPassword == "") {
                showError("confirmPasswordError", "Please confirm your password.");
                valid = false;
            } else if (confirmPassword != password) {
                showError("confirmPasswordError", "Passwords do not match.");
                valid = false;
            }

            if (!gender) {
                showError("genderError", "Please select a gender.");
                valid = false;
            }

            if (dietaryPrefs.length == 0) {
                showError("dietaryPrefsError", "Please select at least one dietary preference.");
                valid = false;
            }

            if (country == "") {
                showError("countryError", "Please select your country or region.");
                valid = false;
            }

            return valid;
        };
    }
}

function clearRegisterErrors() {
    var errors = document.getElementsByClassName("error-msg");

    for (var i = 0; i < errors.length; i++) { /* Loops through all errors */
        errors[i].innerHTML = ""; /* Removes error text */
    }
}

/* RESERVATION PAGE */

function setupReservationValidation() {
    var form = document.getElementById("reserve-form");

    if (form) {
        updateDeposit(); /* Updates deposit amount */
        checkRestaurantFromURL(); /* Checks restaurant from URL */

        document.getElementById("restaurantSelect").onchange = updateDeposit; /* Updates deposit when restaurant changes */

        /* Gets payment method radio buttons */
        var paymentMethods = document.getElementsByName("depositMethod");

        for (var i = 0; i < paymentMethods.length; i++) {
            paymentMethods[i].onclick = showPaymentFields;
        }

        document.getElementById("sameAsEmail").onclick = function () {
            /* If checkbox is selected */
            if (this.checked) {
                document.getElementById("billingEmail").value = document.getElementById("resEmail").value;
            } else {
                document.getElementById("billingEmail").value = "";
            }
        };

        form.onsubmit = function () {
            var valid = true;

            clearReservationErrors();

            var fullName = document.getElementById("fullName").value;
            var email = document.getElementById("resEmail").value;
            var phone = document.getElementById("resPhone").value;
            var restaurant = document.getElementById("restaurantSelect").value;
            var date = document.getElementById("resDate").value;
            var time = document.getElementById("resTime").value;
            var people = document.getElementById("numPeople").value;
            var billingEmail = document.getElementById("billingEmail").value;

            var depositMethod = document.querySelector('input[name="depositMethod"]:checked');

            if (fullName == "") {
                showError("fullNameError", "Full name is required.");
                valid = false;
            }

            if (email == "") {
                showError("resEmailError", "Email is required.");
                valid = false;
            } else if (!/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email)) {
                showError("resEmailError", "Please enter a valid email.");
                valid = false;
            }

            if (phone == "") {
                showError("resPhoneError", "Phone number is required.");
                valid = false;
            } else if (!/^[0-9]{10,}$/.test(phone)) {
                showError("resPhoneError", "Phone must contain at least 10 digits.");
                valid = false;
            }

            if (restaurant == "") {
                showError("restaurantSelectError", "Please select a restaurant.");
                valid = false;
            }

            if (date == "") {
                showError("resDateError", "Please select a reservation date.");
                valid = false;
            } else {
                var today = new Date();
                today.setHours(0, 0, 0, 0); /* Removes time */

                var chosenDate = new Date(date); /* Gets selected date */

                if (chosenDate < today) {
                    showError("resDateError", "Reservation date cannot be in the past.");
                    valid = false;
                }
            }

            if (time == "") {
                showError("resTimeError", "Please select a reservation time.");
                valid = false;
            }

            if (people == "" || Number(people) <= 0) {
                showError("numPeopleError", "Number of people must be greater than 0.");
                valid = false;
            }

            if (!depositMethod) {
                showError("depositMethodError", "Please select a deposit method.");
                valid = false;
            } else if (depositMethod.value == "online") {
                var cardType = document.getElementById("cardType").value;
                var cardNumber = document.getElementById("cardNumber").value;
                var cardName = document.getElementById("cardName").value;

                if (cardNumber == "") {
                    showError("cardNumberError", "Credit card number is required.");
                    valid = false;
                } else if (!/^[0-9]+$/.test(cardNumber)) {
                    showError("cardNumberError", "Card number must contain digits only.");
                    valid = false;
                } else if ((cardType == "visa" || cardType == "mastercard") && cardNumber.length != 16) {
                    showError("cardNumberError", "Visa and Mastercard must have 16 digits.");
                    valid = false;
                } else if (cardType == "amex" && cardNumber.length != 15) {
                    showError("cardNumberError", "American Express must have 15 digits.");
                    valid = false;
                }

                if (cardName == "") {
                    showError("cardNameError", "Name on card is required.");
                    valid = false;
                }
            }

            if (billingEmail == "") {
                showError("billingEmailError", "Billing email is required.");
                valid = false;
            } else if (!/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(billingEmail)) {
                showError("billingEmailError", "Please enter a valid billing email.");
                valid = false;
            }

            return valid;
        };
    }
}

function updateDeposit() {
    var select = document.getElementById("restaurantSelect");

    if (select) {
        var selectedOption = select.options[select.selectedIndex]; /* Gets selected option */
        var deposit = selectedOption.getAttribute("data-deposit"); /* Gets deposit value */

        if (deposit) {
            document.getElementById("depositAmount").value = deposit;
        } else {
            document.getElementById("depositAmount").value = "";
        }
    }
}

function showPaymentFields() {
    var depositMethod = document.querySelector('input[name="depositMethod"]:checked'); 
    var voucherFields = document.getElementById("voucherFields");
    var cardFields = document.getElementById("cardFields");

    /* Shows voucher fields */
    if (depositMethod.value == "voucher") {
        voucherFields.style.display = "block";
        cardFields.style.display = "none";
    } else if (depositMethod.value == "online") {
        voucherFields.style.display = "none";
        cardFields.style.display = "block";
    }
}

function checkRestaurantFromURL() {
    var url = window.location.search; /* reads from ?restaurant=... */
    var params = new URLSearchParams(url); /* helps js to read it*/
    var restaurant = params.get("restaurant"); 

    if (restaurant) {
        var select = document.getElementById("restaurantSelect");

        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value == restaurant) {
                select.sele