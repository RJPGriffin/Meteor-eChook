Template.register.events({
  'submit form': function(event) {
    event.preventDefault();
    var email = event.target.registerEmail.value;
    var password = event.target.registerPassword.value;
    var passwordAgain = event.target.registerPassword2.value;
    var firstName = event.target.firstName.value;
    var lastName = event.target.lastName.value;

    // Trim Helper
    var trimInput = function(val) {
      return val.replace(/^\s*|\s*$/g, "");
    }
    var email = trimInput(email);

    // Check password is at least 6 chars long
    var isValidPassword = function(pwd, pwd2) {
      console.log("Checking Passwords " + pwd + ", " + pwd2);
      if (pwd === pwd2) {
        console.log("Password Check Validated");
        return pwd.length >= 6 ? true : false;
      } else {
        swal({
          title: "Passwords don’t match",
          text: "Please try again",
          showConfirmButton: true,
          type: "error"
        });
        return false;
      }
    }

    // If validation passes, supply the appropriate fields to the
    // Accounts.createUser function.
    if (isValidPassword(password, passwordAgain)) {
      console.log("Creating user account");
      Accounts.createUser({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password
      }, function(error) {
        if (error) {
          console.log("Error: " + error.reason);
        } else {
          console.log("No Error, Logging in");
          Meteor.loginWithPassword(email, password);
          FlowRouter.go('/');
        }
      });
    }

    return false;
  }
});

Template.login.events({
  'submit form': function(event) {
    event.preventDefault();
    var email = event.target.loginEmail.value;
    var password = event.target.loginPassword.value;
    // Calling the loginWithPassword function on the user
    Meteor.loginWithPassword(email, password, function(error) {
      if (error) {
        // Returning a sweetAlert
        return swal({
          title: "Email or password incorrect",
          text: "Please try again",
          timer: 1700,
          showConfirmButton: false,
          type: "error"
        });
      } else {
        FlowRouter.go('/dash/team');
      }
    });
    return false;
  }
});

Template.logoutButton.events({
  'click .logout': function(event) {
    event.preventDefault();
    Meteor.logout();
  }
});

Accounts.onLogin(function() {
  // FlowRouter.go('/dash/team');
  BlazeLayout.render("layout", {
    main: "dashLayout"
  });
  BlazeLayout.render("dashLayout", {
    dashContent: "team"
  });
});
