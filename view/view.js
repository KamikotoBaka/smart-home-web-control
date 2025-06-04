export class View {
  constructor(model) {
    this.model = model;
    this.model.addObserver(this.update.bind(this));
    this.rootElement = document.getElementById('app');  
    this.buttons = {
      //Light Buttons
      toggleButton: document.getElementById("toggleButton"),
      radioToggle: document.getElementById("radioToggle"),
      lichtToggleLabor: document.getElementById("lichtToggleLabor"),
      lichtToggleKueche: document.getElementById("lichtToggleKueche"),
      lichtToggleBad: document.getElementById("lichtToggleBad"),
      lichtToggleIoT: document.getElementById("lichtToggleIoT"),
      lichtToggleMultimedia: document.getElementById("lichtToggleMultimedia"),
      //Other Buttons
      coffeeToggle: document.getElementById("coffeeToggle"),
      startMeetingToggle: document.getElementById("startMeetingToggle"),
      linkinParkToggle: document.getElementById("linkinParkToggle"),
      hideToggle: document.getElementById("hideToggle"),
      resetToggle: document.getElementById("resetToggle"),
      morningroutinToggle: document.getElementById("morningroutinToggle"),
      ventilationToggle: document.getElementById("ventilationToggle"),
      morningroutinToggle: document.getElementById("morningroutinToggle"),
      partyToggle: document.getElementById("partyToggle"),
      movieNightToggle: document.getElementById("movieNightToggle"),
      energySaveToggle: document.getElementById("energySaveToggle"),
      setLaborLightColor: document.getElementById("setLaborLightColor"),
      setlaborLightBrightness: document.getElementById("setlaborLightBrightness"),
      //Jalousie Konferenz 1 Buttons
      rolladenRunter: document.getElementById("rolladenRunter"),
      rolladenStopp: document.getElementById("rolladenStopp"),
      rolladenHoch: document.getElementById("rolladenHoch"),
      //Jalousie Konferenz 2 Buttons
      rolladenKonferenz2Runter: document.getElementById("rolladenKonferenz2Runter"),
      rolladenKonferenz2Stopp: document.getElementById("rolladenKonferenz2Stopp"),
      rolladenKonferenz2Hoch: document.getElementById("rolladenKonferenz2Hoch"),
      //Jalousie Multimedia Buttons
      rolladenMultimediaRunter: document.getElementById("rolladenMultimediaRunter"),
      rolladenMultimediaStopp: document.getElementById("rolladenMultimediaStopp"),
      rolladenMultimediaHoch: document.getElementById("rolladenMultimediaHoch"),
      //All Jalousie Buttons
      rolladenAlleRunter: document.getElementById("rolladenAlleRunter"),
      rolladenAlleStopp: document.getElementById("rolladenAlleStopp"),
      rolladenAlleHoch: document.getElementById("rolladenAlleHoch"),
      //Light Color
      setKuecheLightColor: document.getElementById("setKuecheLightColor"),
      setBadLightColor: document.getElementById("setBadLightColor"),
      setIoTLightColor: document.getElementById("setIoTLightColor"),
      multimediaLichtFarbe: document.getElementById("multimediaLichtFarbe"),
      //Light Brightness
      setKuecheLightBrightness: document.getElementById("setKuecheLightBrightness"),
      setBadLightBrightness: document.getElementById("setBadLightBrightness"),
      setIoTLightBrightness: document.getElementById("setIoTLightBrightness"),
      setMultimediaLightBrightness: document.getElementById("setMultimediaLightBrightness"),


    };

    //Konferenz 1 Jalousie Buttons  
    if(this.buttons.rolladenRunter) {this.buttons.rolladenRunter.addEventListener("click", () => this.onJalousie("DOWN"));}
    if(this.buttons.rolladenStopp) {this.buttons.rolladenStopp.addEventListener("click", () => this.onJalousie("STOP"));}
    if(this.buttons.rolladenHoch) {this.buttons.rolladenHoch.addEventListener("click", () => this.onJalousie("UP"));}

    //Konferenz 2 Jalousie Buttons
    if(this.buttons.rolladenKonferenz2Runter) {this.buttons.rolladenKonferenz2Runter.addEventListener("click", () => this.onJalousieKonferenz2("DOWN"));}
    if(this.buttons.rolladenKonferenz2Stopp) {this.buttons.rolladenKonferenz2Stopp.addEventListener("click", () => this.onJalousieKonferenz2("STOP"));}
    if(this.buttons.rolladenKonferenz2Hoch) {this.buttons.rolladenKonferenz2Hoch.addEventListener("click", () => this.onJalousieKonferenz2("UP"));}

    //Multimedia Jalousie Buttons
    if(this.buttons.rolladenMultimediaRunter) {this.buttons.rolladenMultimediaRunter.addEventListener("click", () => this.onJalousieMultimedia("DOWN"));}
    if(this.buttons.rolladenMultimediaStopp) {this.buttons.rolladenMultimediaStopp.addEventListener("click", () => this.onJalousieMultimedia("STOP"));}
    if(this.buttons.rolladenMultimediaHoch) {this.buttons.rolladenMultimediaHoch.addEventListener("click", () => this.onJalousieMultimedia("UP"));}
    
    //Jalousie All DOWN
    if(this.buttons.rolladenAlleRunter) {
      this.buttons.rolladenAlleRunter.addEventListener("click", () => {
        if(this.rolladenAlleCallback) this.onRolladenAlle("DOWN");});}
    
    //Jalousie All STOP
    if(this.buttons.rolladenAlleStopp) {
      this.buttons.rolladenAlleStopp.addEventListener("click", () => {
        if(this.rolladenAlleCallback) this.onRolladenAlle("STOP");});}
    
    //Jalousie All UP
    if(this.buttons.rolladenAlleHoch) {
      this.buttons.rolladenAlleHoch.addEventListener("click", () => {
        if(this.rolladenAlleCallback) this.onRolladenAlle("UP");});}
    
    //Meeting Button
    if(this.buttons.startMeetingToggle) {
      this.buttons.startMeetingToggle.addEventListener("click", () => {
        if(this.meetingCallback) {
          const currentState = this.buttons.startMeetingToggle.textContent.includes("EIN") ? "AUS" : "EIN";
          this.meetingCallback(currentState);}});}
    
    //Hide Button
    if(this.buttons.hideToggle) {
      this.buttons.hideToggle.addEventListener("click", () => {
        if(this.hideCallback) {
          const currentState = this.buttons.hideToggle.textContent.includes("EIN") ? "AUS" : "EIN";
          this.hideCallback(currentState);}});}
    
    //Ventilation Button
    if(this.buttons.ventilationToggle) {
      this.buttons.ventilationToggle.addEventListener("click", () => {
      if(this.toggleCallback) this.toggleCallback("ventilationToggle");});}
    
    //Movie Night Button
    if(this.buttons.movieNightToggle) {
      this.buttons.movieNightToggle.addEventListener("click", () => {
      if(this.toggleCallback) this.toggleCallback("movieNightToggle");});}
    
    //Reset Button
    if(this.buttons.resetToggle) {
      this.buttons.resetToggle.addEventListener("click", () => {
        if(this.resetCallback) {this.resetCallback();}});}
    
    //Kueche Color Button
    if(this.buttons.setKuecheLightColor) {
      this.buttons.setKuecheLightColor.addEventListener("click", () => {
      const color = document.getElementById("kuecheLightColor").value;
        if(this.colorCallback) this.colorCallback("Kueche", color);});}
    
    //Bad Color Button
    if(this.buttons.setBadLightColor) {
      this.buttons.setBadLightColor.addEventListener("click", () => {
      const color = document.getElementById("badLightColor").value;
        if(this.colorCallback) this.colorCallback("Bad", color);});}
    
    //IoT Color Button
    if(this.buttons.setIoTLightColor) {
      this.buttons.setIoTLightColor.addEventListener("click", () => {
      const color = document.getElementById("iotLightColor").value;
        if(this.colorCallback) this.colorCallback("IoT", color);});}
    
    //Multimedia Color Button
    if(this.buttons.multimediaLichtFarbe) {
    this.buttons.multimediaLichtFarbe.addEventListener("click", () => {
    const color = document.getElementById("multimediaLightColor").value;
    if(this.colorCallback) {
      this.colorCallback("Multimedia", color);
    }else{console.error("setColorCallback is not defined");}});}

    //Kueche Brightness Button
    if(this.buttons.setKuecheLightBrightness) {
    this.buttons.setKuecheLightBrightness.addEventListener("click", () => {
    const brightness = document.getElementById("kuecheLightBrightness").value;
    if(this.brightnessCallback) {this.brightnessCallback("Kueche", brightness);}});}
    
    //Bad Brightness Button
    if(this.buttons.setBadLightBrightness) {
    this.buttons.setBadLightBrightness.addEventListener("click", () => {
    const brightness = document.getElementById("badLightBrightness").value;
    if(this.brightnessCallback) {this.brightnessCallback("Bad", brightness);}});}
    
    //IoT Brightness Button
    if(this.buttons.setIoTLightBrightness) {
    this.buttons.setIoTLightBrightness.addEventListener("click", () => {
    const brightness = document.getElementById("iotLightBrightness").value;
    if(this.brightnessCallback) {this.brightnessCallback("IoT", brightness);}});}
    
    //Multimedia Brightness Button
    if(this.buttons.setMultimediaLightBrightness) {
    this.buttons.setMultimediaLightBrightness.addEventListener("click", () => {
    const brightness = document.getElementById("multimediaLightBrightness").value;
    if(this.brightnessCallback) {this.brightnessCallback("Multimedia", brightness);}});}
    
    //Party Button
    if(this.buttons.partyToggle) {
      this.buttons.partyToggle.addEventListener("click", () => {
      const command = this.buttons.partyToggle.textContent.includes("EIN") ? "AUS" : "EIN";
    if(this.partyCallback) {this.partyCallback(command);
    }else{console.error("partyCallback is not defined");}});}
    
    //Save energy Button
    if(this.buttons.energySaveToggle) {
      this.buttons.energySaveToggle.addEventListener("click", () => {
      if(this.toggleCallback) this.toggleCallback("energySaveToggle");});}
    
      //Labor Color Button
    if(this.buttons.setLaborLightColor) {
      this.buttons.setLaborLightColor.addEventListener("click", () => {
      const color = document.getElementById("laborLightColor").value;
      if(this.laborColorCallback) this.laborColorCallback(color);});}
    
      //Labor Brightness Button
    if(this.buttons.setlaborLightBrightness) {
      this.buttons.setlaborLightBrightness.addEventListener("click", () => {
      const brightness = document.getElementById("laborLightBrightness").value;
      if(this.laborBrightnessCallback) this.laborBrightnessCallback(brightness);});}

    const allButtons = [
      "lichtToggleLabor",
      "lichtToggleKueche",
      "lichtToggleBad",
      "lichtToggleIoT",
      "lichtToggleMultimedia",
      "coffeeToggle",
      "linkinParkToggle",
      "radioToggle",
      "ventilationToggle",
    ];
    
    for(const name of allButtons) {
      const button = this.buttons[name];
      if(button) {button.addEventListener("click", () => {if (this.toggleCallback) this.toggleCallback(name);});}}
  }
  setToggleCallback(callback) {this.toggleCallback = callback;}

  setRolladenCallback(callback) {this.rolladenCallback = callback;}

  setRolladenKonferenz2Callback(callback) {this.rolladenKonferenz2Callback = callback;}

  setRolladenMultimediaCallback(callback) {this.rolladenMultimediaCallback = callback;}

  setRolladenAlleCallback(callback) {this.rolladenAlleCallback = callback;}

  setMeetingCallback(callback) {this.meetingCallback = callback;}

  setHideCallback(callback) {this.hideCallback = callback;}

  setResetCallback(callback) {this.resetCallback = callback;}

  setColorCallback(callback) {this.colorCallback = callback;}

  setBrightnessCallback(callback) {this.brightnessCallback = callback;}

  setPartyCallback(callback) {this.partyCallback = callback;}

  setLaborColorCallback(callback) {this.laborColorCallback = callback;}

  setLaborBrightnessCallback(callback) {this.laborBrightnessCallback = callback;}

  //Jalousie Konferenz 1
  onJalousie(command) {if (this.rolladenCallback) this.rolladenCallback(command);}
  
  //Jalousie Konferenz 2
  onJalousieKonferenz2(command) {if (this.rolladenKonferenz2Callback) this.rolladenKonferenz2Callback(command);}
  
  //Jalousie Multimedia
  onJalousieMultimedia(command) {if (this.rolladenMultimediaCallback) this.rolladenMultimediaCallback(command);}
  
  //All Jalousie
  onRolladenAlle(command) {if (this.rolladenAlleCallback) this.rolladenAlleCallback(command);}
  
  //Pop-UP Notification
  showToast(message, duration = 10000) {
  let container = document.getElementById('toast-container');
  if(!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.background = 'rgba(0,0,0,0.8)';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.marginTop = '10px';
  toast.style.borderRadius = '5px';
  toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, duration);
  }

  //Button State for SSE
  getButtonState(buttonName) {
  const button = document.getElementById(buttonName);
  if(!button) return null;
  if(button.classList.contains("btn-on")) return "ON";
  if(button.classList.contains("btn-off")) return "OFF";
  if(/EIN/.test(button.textContent)) return "ON";
  if(/AUS/.test(button.textContent)) return "OFF";
  return null;
  }

  update(name, state, data) {
  const button = document.getElementById(name);
  if(!button) return;

  if(state === "ON") {
    button.textContent = "EIN";
    button.classList.remove("btn-off");
    button.classList.add("btn-on");
  }else{
    button.textContent = "AUS";
    button.classList.remove("btn-on");
    button.classList.add("btn-off");
  }
}
}