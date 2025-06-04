export class IndexController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.setupUI();
    this.items = {};
    this.view.onToggle = this.toggleLight.bind(this);
    this.view.setToggleCallback(this.toggleLight.bind(this));
    this.view.setRolladenCallback(this.RolladenSteuern.bind(this));
    this.view.setMeetingCallback(this.meetingControl.bind(this));
    this.view.setHideCallback(this.hideControl.bind(this));
    this.isMeetingActive = false;
    this.view.setResetCallback(this.resetControl.bind(this));
    this.view.setRolladenKonferenz2Callback(this.controlKonferenz2Rolladen.bind(this));
    this.view.setRolladenMultimediaCallback(this.controlMultimediaRolladen.bind(this));
    this.view.setRolladenAlleCallback(this.controlAlleRolladen.bind(this));
  }
  setupUI() {
  const input = document.getElementById('input');
  if (input) {
    input.addEventListener('input', (event) => {
      this.model.setData({ value: event.target.value });
    });
  }
  }

  async init(buttonName, itemNames) {
  this.items[buttonName] = itemNames;
  const states = [];
  for(const itemName of itemNames) {
    const state = await this.model.getItemState(itemName);
    states.push(state);}
  const allOn = states.every(state => state === "ON");
  this.view.update(buttonName, allOn ? "ON" : "OFF");}

  async toggleLight(buttonName) {
  if(buttonName === "lichtToggleLabor") {
  const relatedButtons = [
  "lichtToggleKueche",
  "lichtToggleBad",
  "lichtToggleIoT",
  "lichtToggleMultimedia"];

    // Check if ALL 4 are ON
    let allOn = true;
    let anyOff = false;
    for(const btn of relatedButtons) {
      const btnItems = this.items[btn];
      if(btnItems && btnItems.length > 0) {
        const states = await Promise.all(
          btnItems.map(item => this.model.getItemState(item))
        );if(states.every(state => state === "ON")) {
        }else{
          allOn = false;
          anyOff = true;}}}

    // If all are ON, turn all OFF, else turn all ON
    const newState = allOn ? "OFF" : "ON";
    for(const btn of relatedButtons) {
      const btnItems = this.items[btn];
      if(btnItems && btnItems.length > 0) {
        for(const item of btnItems) {await this.model.sendCommand(item, newState);}
        this.view.update(btn, newState);}}
    this.view.update(buttonName, newState); 
    return;
  }

  // Default logic for other buttons
  const itemNames = this.items[buttonName];
  if(!itemNames || itemNames.length === 0) return;

  let atLeastOneOn = false;
  for(const itemName of itemNames) {
    const state = await this.model.getItemState(itemName);
    if(state === "ON") {
      atLeastOneOn = true;
      break;}}
  const newState = atLeastOneOn ? "OFF" : "ON";
  for(const itemName of itemNames) {await this.model.sendCommand(itemName, newState);}
  this.view.update(buttonName, newState);}

 //Meeting Button
 async meetingControl(command) {
  console.log("Received command:", command); // Debugging

  const jalousieItem = "iKonferenz_Somfy_Rollladen2_Steuerung";
  const lightItem = "iKueche_Hue_Lampen_Schalter";
   // Map "EIN" and "AUS" to "ON" and "OFF"
  const mappedCommand = command === "EIN" ? "ON" : "OFF";
  try {
    if(mappedCommand === "ON") {
      if(this.isMeetingActive) return;
      this.isMeetingActive = true;

      await this.model.sendCommand(jalousieItem, "DOWN");
      this.view.update("startMeetingToggle", "ON");

      setTimeout(async () => {
        try {
          await this.model.sendCommand(jalousieItem, "STOP");
          await this.model.sendCommand(lightItem, "ON");
        } catch (error) {
          console.error("Error during STOP or light ON:", error);}
      }, 10000);
    } else if(mappedCommand === "OFF") {
      this.isMeetingActive = false;

      await this.model.sendCommand(jalousieItem, "UP");
      await this.model.sendCommand(lightItem, "OFF");
      this.view.update("startMeetingToggle", "OFF");}
  } catch(error) {console.error("Error in meetingControl:", error);}
}
  //Party Button
  async partyControl(command) {
    const soundItems = [
    "iKueche_Sonos_Lautsprecher_URIspielen",
    "iBad_Sonos_Lautsprecher_URIspielen",
    "iIoT_Sonos_Lautsprecher_URIspielen",
    "iMultimedia_Sonos_Lautsprecher_URIspielen"]
    const musicItem = "//192.168.0.10/medialib/Audio/Queen/DontStopMeNow.mp3"
    const mappedCommand = command === "EIN" ? "ON" : "OFF";

    try {
      if(mappedCommand === "ON") {
      await Promise.all(soundItems.map(soundItem => this.model.sendCommand(soundItem, musicItem)));
      this.view.update("partyToggle", "ON");
      } else if(mappedCommand === "OFF") {
      await Promise.all(soundItems.map(soundItem => this.model.sendCommand(soundItem, "OFF")));
      this.view.update("partyToggle", "OFF");}
    } catch (error) {console.error("Error in partyControl:", error);}
  }

  //Hide Button
  async hideControl(command) {
    const hideItem = "iKonferenz_DanaLock_Tuerschloss_Schloss";
    const jalousieItem = "iKonferenz_Somfy_Rollladen2_Steuerung";
    const mappedCommand = command === "EIN" ? "ON" : "OFF";

    try {
      if(mappedCommand === "ON") {
        // Jalousie DOWN
        await this.model.sendCommand(jalousieItem, "DOWN");
        await this.model.sendCommand(hideItem, "ON");
        this.view.update("hideToggle", "ON");
      }
      else if(mappedCommand === "OFF") {
        // Jalousie UP
        await this.model.sendCommand(jalousieItem, "UP");
        await this.model.sendCommand(hideItem, "OFF");
        this.view.update("hideToggle", "OFF");
      }
    } catch(error) {console.error("Error in hideControl:", error);}
  }

  // Reset Button
  async resetControl() {
    const jalousieItems = ["iKonferenz_Somfy_Rollladen2_Steuerung", 
    "iKonferenz_Somfy_Rollladen1_Steuerung", "iMultimedia_Somfy_Rollladen_Steuerung"];
    const lightItems = [
    "iKueche_Hue_Lampen_Schalter",
    "iBad_Hue_Lampen_Schalter",
    "iBad_Hue_BloomLampen_Schalter",
    "iIoT_Hue_Lampen_Schalter",
    "iIoT_Hue_IrisLampen_Schalter",
    "iMultimedia_Hue_Lampen_Schalter",
    "iMultimedia_Hue_GOLampen_Schalter"];
    const coffeeItem = "iKueche_Miele_Kaffeemaschine_Start";
    const radioItem = "iKonferenz_Audio_Medialib_BuenaVistaSocialClub_BuenaVistaSocialClubDosGardenias";
    const hideItem = "iKonferenz_DanaLock_Tuerschloss_Schloss";
    const ventilationItem = "iKonferenz_RaumluftreinigerMQTT2_Schalten";
    const movieNightItem = "iMultimedia_SmartTV_Power";
    const soundItems = [
    "iKueche_Sonos_Lautsprecher_URIspielen",
    "iBad_Sonos_Lautsprecher_URIspielen",
    "iIoT_Sonos_Lautsprecher_URIspielen",
    "iMultimedia_Sonos_Lautsprecher_URIspielen"];
    const linkinParkItems = [
    "iKueche_Audio_Medialib_Morgenroutine_WhatIveDoneLinkinPark", 
    "iBad_Audio_Medialib_Morgenroutine_WhatIveDoneLinkinPark", 
    "iIoT_Audio_Medialib_Morgenroutine_WhatIveDoneLinkinPark", 
    "iMultimedia_Audio_Medialib_Morgenroutine_WhatIveDoneLinkinPark", 
    "iKonferenz_Audio_Medialib_Morgenroutine_WhatIveDoneLinkinPark"];
    try {
      // Turn off all linkinpark items
      for(const linkinParkItem of linkinParkItems) {await this.model.sendCommand(linkinParkItem, "OFF");}
      
      // Turn off all sound items
      for(const soundItem of soundItems) {await this.model.sendCommand(soundItem, "STOP");}
      
      // Turn off all TVs
      await this.model.sendCommand(movieNightItem, "OFF");
      
      // Turn off all ventilation
      await this.model.sendCommand(ventilationItem, "OFF");
      
      // Jalousie UP
      for(const jalousieItem of jalousieItems) {await this.model.sendCommand(jalousieItem, "UP");}
     
      // Turn off all lights
      for(const lightItem of lightItems) {await this.model.sendCommand(lightItem, "OFF");}

      // Turn off coffee machine
      await this.model.sendCommand(coffeeItem, "OFF");
  
      // Turn off radio
      await this.model.sendCommand(radioItem, "OFF");
  
      // Unlock or reset hide item
      await this.model.sendCommand(hideItem, "OFF");
  
      console.log("Reset completed successfully.");
    } catch(error) {console.error("Error in resetControl:", error);}
  }

  // Jalousie Control Konferenz 1 
  async RolladenSteuern(command) {
    const itemName = "iKonferenz_Somfy_Rollladen2_Steuerung"; // Rolladen item
    const windowSensors = [
    "iKonferenz_Homematic_Fenster3_Position",
    "iKonferenz_Homematic_Fenster4_Position",
    "iKonferenz_Homematic_Fenster5_Position"];
  
    try {
      // Check the state of all window sensors
      for(const sensor of windowSensors) {
        const sensorState = await this.model.getItemState(sensor);
        if(command === "DOWN" && sensorState === "OPEN") {
          this.view.showToast(`Warnung: Fenstersensor ${sensor} ist geöffnet. Bitte schließen Sie die Fenster, bevor Sie den Rolladen herunterrollen.`);
          console.log(`Window sensor ${sensor} is open. Rolladen cannot go down.`);
          return; // Prevent rolladen from going down
        }
      }
      // Execute the command for the rolladen
      await this.model.sendCommand(itemName, command);
      console.log(`Rolladen executed command: ${command}`);
    } catch(error) {console.error(`Error executing command "${command}" for rolladen:`, error);}
  }

  // Jalousie Control Konferenz 2
  async controlKonferenz2Rolladen(command) {
    const itemName = "iKonferenz_Somfy_Rollladen1_Steuerung";
    const windowSensors = [
      "iKonferenz_Homematic_Fenster1_Position",
      "iKonferenz_Homematic_Fenster2_Position",
      "iKonferenz_Homematic_Fenster3_Position"];
    try {
      for(const sensor of windowSensors) {
        const sensorState = await this.model.getItemState(sensor);
        if(command === "DOWN" && sensorState === "OPEN") {
          this.view.showToast(`Warnung: Fenstersensor ${sensor} ist geöffnet. Bitte schließen Sie die Fenster, bevor Sie den Rolladen herunterrollen.`);
          console.log(`Window sensor ${sensor} is open. Rolladen cannot go down.`);
          return;
        }
      }
      await this.model.sendCommand(itemName, command);
      console.log(`Rolladen executed command: ${command}`);
    } catch(error) {console.error(`Error executing command "${command}" for rolladen:`, error);}
  }

  // Jalousie Controll Multimedia
  async controlMultimediaRolladen(command) {
    const itemName = "iMultimedia_Somfy_Rollladen_Steuerung"; 
    const windowSensors = [
      "iMultimedia_Homematic_Fenster1_Position",
      "iMultimedia_Homematic_Fenster2_Position",
      "iMultimedia_Homematic_Fenster3_Position"];
    try {
      for(const sensor of windowSensors) {
        const sensorState = await this.model.getItemState(sensor);
        if(command === "DOWN" && sensorState === "OPEN") {
          this.view.showToast(`Warnung: Fenstersensor ${sensor} ist geöffnet. Bitte schließen Sie die Fenster, bevor Sie den Rolladen herunterrollen.`);
          console.log(`Window sensor ${sensor} is open. Rolladen cannot go down.`);
          return;
        }
      }
      await this.model.sendCommand(itemName, command);
      console.log(`Rolladen executed command: ${command}`);
    } catch(error) {console.error(`Error executing command "${command}" for rolladen:`, error);}
  }
  // All Jaloisie 
  async controlAlleRolladen(command) {
    const jalousieItems = [
      "iKonferenz_Somfy_Rollladen2_Steuerung",
      "iKonferenz_Somfy_Rollladen1_Steuerung",
      "iMultimedia_Somfy_Rollladen_Steuerung"];
    const windowSensors = [ 
      "iKonferenz_Homematic_Fenster1_Position",
      "iKonferenz_Homematic_Fenster2_Position",
      "iKonferenz_Homematic_Fenster3_Position",
      "iKonferenz_Homematic_Fenster4_Position",
      "iKonferenz_Homematic_Fenster5_Position",
      "iKonferenz_Homematic_Fenster6_Position",
      "iMultimedia_Homematic_Fenster1_Position",
      "iMultimedia_Homematic_Fenster2_Position",
      "iMultimedia_Homematic_Fenster3_Position",];
    try {
      for(const sensor of windowSensors) {
        const sensorState = await this.model.getItemState(sensor);
        if(command === "DOWN" && sensorState === "OPEN") {
          this.view.showToast(`Warnung: Fenstersensor ${sensor} ist geöffnet. Bitte schließen Sie die Fenster, bevor Sie den Rolladen herunterrollen.`);
          console.log(`Window sensor ${sensor} is open. Rolladen cannot go down.`);
          return;
        }
      }
      for(const jalousieItem of jalousieItems) {await this.model.sendCommand(jalousieItem, command);}
      console.log(`All rolladen executed command: ${command}`);
    } catch (error) {console.error(`Error executing command "${command}" for all rolladen:`, error);}
  }
  
  // Light Control
  async setLightColor(lightName, color) {
  console.log(`setLightColor called with lightName: ${lightName}, color: ${color}`); // Debugging

  const lightColorAPIs = {
    Multimedia: "iMultimedia_Hue_Lampen_Farbe",
    Kueche: "iKueche_Hue_Lampen_Farbe",
    Bad: "iBad_Hue_Lampen_Farbe",
    IoT: "iIoT_Hue_Lampen_Farbe"};

  const api = lightColorAPIs[lightName];
  if(!api) {
    console.error(`No API found for light: ${lightName}`);
    return;
  }

  try {
  const { r, g, b } = this.hexToRgb(color);
  const hsbColor = this.rgbToHsb(r, g, b);
  await this.model.sendCommand(api, hsbColor);
  console.log(`Set color of ${lightName} light to ${hsbColor}`);
  } catch(error) {console.error(`Error setting color for ${lightName} light:`, error);}
  }

  async setLightColorLabor(color) {
  console.log(`setLightColorLabor called with color: ${color}`); // Debugging
  const laborLightItems = [
    "iMultimedia_Hue_Lampen_Farbe",
    "iKueche_Hue_Lampen_Farbe",
    "iBad_Hue_Lampen_Farbe",
    "iIoT_Hue_Lampen_Farbe"];
  try {
    const { r, g, b } = this.hexToRgb(color);
    const hsbColor = this.rgbToHsb(r, g, b);
    await Promise.all(laborLightItems.map(item => this.model.sendCommand(item, hsbColor)));
    console.log(`Set Labor lights color to ${hsbColor}`);
  } catch(error) {console.error("Error setting Labor lights color:", error);}
  }

  // Light Brightness Control
  async setLightBrightness(lightName, brightness) {
  console.log(`setLightBrightness called with lightName: ${lightName}, brightness: ${brightness}`); // Debugging

  const lightBrightnessAPIs = {
    Multimedia: "iMultimedia_Hue_Lampen_Helligkeit",
    Kueche: "iKueche_Hue_Lampen_Helligkeit",
    Bad: "iBad_Hue_Lampen_Helligkeit",
    IoT: "iIoT_Hue_Lampen_Helligkeit"};

  const api = lightBrightnessAPIs[lightName];
  if(!api) {
    console.error(`No API found for light: ${lightName}`);
    return;
  }
  try {
    if(brightness < 0 || brightness > 100) {throw new Error("Brightness must be between 0 and 100.");}
    await this.model.sendCommand(api, brightness.toString());
    console.log(`Set brightness of ${lightName} light to ${brightness}`);
  } catch(error) {console.error(`Error setting brightness for ${lightName} light:`, error);}
  }

  // Labor Light Brightness Control
  async setLightBrightnessLabor(brightness) {
  console.log(`setLightBrightnessLabor called with brightness: ${brightness}`); // Debugging

  const laborBrightnessItems = [
    "iMultimedia_Hue_Lampen_Helligkeit",
    "iKueche_Hue_Lampen_Helligkeit",
    "iBad_Hue_Lampen_Helligkeit",
    "iIoT_Hue_Lampen_Helligkeit"];
  try {
    if(brightness < 0 || brightness > 100) {throw new Error("Brightness must be between 0 and 100.");}
    await Promise.all(laborBrightnessItems.map(item => this.model.sendCommand(item, brightness.toString())));
    console.log(`Set Labor lights brightness to ${brightness}`);
  } catch(error) {console.error("Error setting Labor lights brightness:", error);}
  }

  //Live Updates
  startLiveUpdates() {
  // Mapping von Item-Name → Button-Name (für die View)
  const itemToButtonMap = {};
  for(const [buttonName, itemNames] of Object.entries(this.items)) {
    for(const itemName of itemNames) {itemToButtonMap[itemName] = buttonName;}
  }
  const allItemNames = Object.values(this.items).flat();

  this.model.listenToEvents(allItemNames, (data) => {
    const itemName = data.payload.itemName;
    const newState = data.payload.state;
    const buttonName = itemToButtonMap[itemName];

    if(buttonName) {this.view.update(buttonName, newState);}});
  }

  rgbToHsb(r, g, b) {
    if(r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error("Invalid RGB values. Each value must be between 0 and 255.");
  }

  // Normalize RGB values to the range [0, 1]
  const rPercent = r / 255;
  const gPercent = g / 255;
  const bPercent = b / 255;

  // Find the maximum and minimum RGB values
  const max = Math.max(rPercent, gPercent, bPercent);
  const min = Math.min(rPercent, gPercent, bPercent);
  const delta = max - min;

  // Calculate Hue
  let h = 0;
  if(delta !== 0) {
    if(max === rPercent) {h = ((gPercent - bPercent) / delta) % 6;
    } else if(max === gPercent) {h = (bPercent - rPercent) / delta + 2;
    } else {h = (rPercent - gPercent) / delta + 4;
    }
    h = Math.round(h * 60);
    if(h < 0) h += 360;
  }

  // Calculate Saturation
  const s = max === 0 ? 0 : Math.round((delta / max) * 100);

  // Calculate Brightness
  const v = Math.round(max * 100);

  // Return HSB values as a string
  return `${h},${s},${v}`;
  }

  hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}
}
