(function () {
  let redirectLocal =
    "file:///Users/alexogilvie/Desktop/order-tracker/index.html";
  let redirectNetwork = "file:///Volumes/order-tracker/index.html";
  let redirectlive = "https://ogilvie1231.github.io/order-tracker/index.html";
  let redirectLiveSimple = "https://ogilvie1231.github.io/order-tracker/"
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $("#login").hide();
      $("#user").append("Welcome ", user.displayName)
    } else if (
      window.location.href === redirectLocal ||
      window.location.href === redirectNetwork ||
      window.location.href === redirectlive ||
      window.location.href === redirectLiveSimple
    ) {
      window.location.replace("login.html");
    }
    else {
      $("#login").hide();

    }
  });
})();

const logoutBtn = () => {
  $("#logout").on("click", function (event) {
    firebase.auth().signOut();
  });
};
logoutBtn();
