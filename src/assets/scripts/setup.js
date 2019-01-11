let token, userId;
  
    const twitch = window.Twitch.ext;
  
    twitch.onContext((context) => {
      twitch.rig.log(context);
    });
  
    //Triggered on first setup. Sends the JWT auth. Our backend needs to validate this with our secret.
    twitch.onAuthorized((auth) => {
      //Need to create a 'tunnel' to pass data into Angular from native.
      //Our app may or may not be initialized by the time this event fires.
      //The 'tunnel' must be able to initialize from either end.
      if (window.twitchTunnel != null) {
        //App is started. Pass the data in directly.
        window.twitchTunnel.verifyUserToken(auth.token);
      }
      else {
        //If the twitch tunnel hasn't been opened yet by our app, drill it from this side.
        //The app will read this info when it loads.
        window.twitchTunnel = {
          token: token
        };
      }
    });