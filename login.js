  
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
          }
    ],
  });

  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      
        return true;
      },
      uiShown: function() {
       
        document.getElementById('loader').style.display = 'none';
      }
    },
  
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: 'index.html',
    privacyPolicyUrl: 'index.html'
  };

  ui.start('#firebaseui-auth-container', uiConfig);
