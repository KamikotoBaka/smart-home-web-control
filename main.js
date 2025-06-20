const currentStates = {};
let currentEventSource = null;
let firstSSEReceived = {};


function closeCurrentEventSource() {
  if (currentEventSource) {
    currentEventSource.close();
    currentEventSource = null;
  }
}


async function loadView(path) {
  const html = await fetch(path).then(res => res.text());
  document.getElementById('app').innerHTML = html;
}


function startServerStatusPolling(model, view) {
  async function check() {
    try {
      await model.getItemState("iKueche_Hue_Lampen_Schalter"); 
      view.setServerStatus(true);
    } catch (e) {
      view.setServerStatus(false);
    }
    setTimeout(check, 5000);
  }
  check();
}

async function initMainView() {
  const { OpenHAB } = await import('./model/OpenHAB.js');
  const { View } = await import('./view/view.js');
  const { IndexController } = await import('./controller/IndexController.js');

<<<<<<< HEAD

=======
  const model = new OpenHAB("http://192.168.0.5:8080/rest", "login", "password");
>>>>>>> dbe8235f0a97142afa2b4e5a2d32a5287d3f3c1d
  const view = new View(model);
  const controller = new IndexController(model, view);
  closeCurrentEventSource();

  //Light 
  await controller.init("lichtToggleKueche",["iKueche_Hue_Lampen_Schalter","iKueche_Osram_LEDStreifen_Schalter"]);
  
  await controller.init("lichtToggleBad",["iBad_Hue_Lampen_Schalter", "iBad_Osram_LEDStreifen_Schalter", "iBad_Hue_BloomLampen_Schalter"]);
  
  await controller.init("lichtToggleIoT",["iIoT_Hue_Lampen_Schalter", "iIoT_Hue_IrisLampen_Schalter"]);
  
  await controller.init("lichtToggleMultimedia",["iMultimedia_Hue_Lampen_Schalter", "iMultimedia_Hue_LEDStreifen_Schalter", "iMultimedia_Hue_GOLampen_Schalter"]);
  
  await controller.init("coffeeToggle",["iKueche_Miele_Kaffeemaschine_Start"]);

  const allItemNames = Object.values(controller.items).flat();

  firstSSEReceived = {};
  
  allItemNames.forEach(item => {firstSSEReceived[item] = false;});

  currentEventSource = model.listenToEvents(allItemNames, (event) => {
  if(event.type !== "ItemStateChangedEvent") return;

  const itemName = event.topic.split('/')[2];
  let newState;
  if(typeof event.payload === "string") {
    try {const payloadObj = JSON.parse(event.payload);
      newState = payloadObj.value || payloadObj.state || payloadObj;
    } catch(e) {newState = event.payload;}
  }else if(typeof event.payload === "object" && event.payload !== null) {newState = event.payload.value || event.payload.state || event.payload;
  }else {newState = event.payload;}

  currentStates[itemName] = newState;

  if(!firstSSEReceived[itemName]) {firstSSEReceived[itemName] = true;}

  // Updating individual buttons
  for(const [buttonName, itemNames] of Object.entries(controller.items)) {
    if(itemNames.includes(itemName)) {const allOn = itemNames.every((item) => currentStates[item] === "ON");
      view.update(buttonName, allOn ? "ON" : "OFF");}}

  // Update the lab button
  const laborButtons = [
    "lichtToggleKueche",
    "lichtToggleBad",
    "lichtToggleIoT",
    "lichtToggleMultimedia"];

  const allLaborOn = laborButtons.every((btn) => {
    const itemNames = controller.items[btn];
    return itemNames.every((item) => currentStates[item] === "ON");});

  view.update("lichtToggleLabor", allLaborOn ? "ON" : "OFF");
  });
  view.setToggleCallback((buttonName) => controller.toggleLight(buttonName));
  //Light Color
  view.setColorCallback((lightName, color) => {controller.setLightColor(lightName, color);});
  //All Jalousie
  view.setRolladenAlleCallback((command) => controller.controlAlleRolladen(command));
  //Light Brightness
  view.setBrightnessCallback((lightName, brightness) => {controller.setLightBrightness(lightName, brightness);});
  //Labor Light Color
  view.setLaborColorCallback((color) => controller.setLightColorLabor(color));
  //Labor Light Brightness
  view.setLaborBrightnessCallback((brightness) => controller.setLightBrightnessLabor(brightness));
  controller.startLiveUpdates();
}


async function initHomeControl2() {
  const { OpenHAB } = await import('./model/OpenHAB.js');
  const { View } = await import('./view/view.js');
  const { IndexController } = await import('./controller/IndexController.js');

<<<<<<< HEAD

=======
  const model = new OpenHAB("http://192.168.0.5:8080/rest", "login", "password");
>>>>>>> dbe8235f0a97142afa2b4e5a2d32a5287d3f3c1d
  const view = new View(model);
  const controller = new IndexController(model, view);
  closeCurrentEventSource();
  //Radio
  await controller.init("radioToggle",["iKonferenz_Audio_Medialib_BuenaVistaSocialClub_BuenaVistaSocialClubDosGardenias"]);
  //Ventilation
  await controller.init("ventilationToggle",["iKonferenz_RaumluftreinigerMQTT2_Schalten"]);  
  //Coffee
  await controller.init("coffeeToggle",["iKueche_Miele_Kaffeemaschine_Start"]);
  //Linkin Park
  await controller.init("linkinParkToggle", 
  ["iKueche_Audio_Medialib_Morgenroutine_WhatIveDoneLinkinPark", 
  "iBad_Audio_Medialib_Morgenroutine_WhatIveDoneLinkinPark", 
  "iIoT_Audio_Medialib_Morgenroutine_WhatIveDoneLinkinPark", 
  "iMultimedia_Audio_Medialib_Morgenroutine_WhatIveDoneLinkinPark", 
  "iKonferenz_Audio_Medialib_Morgenroutine_WhatIveDoneLinkinPark"]);
  //Morning Routine
  await controller.init("morningroutinToggle",["iKonferenz_RaumluftreinigerMQTT2_Schalten", "iKueche_Miele_Kaffeemaschine_Start"]);
  //Movie Night
  await controller.init("movieNightToggle",["iMultimedia_SmartTV_Power", "iMultimedia_Homematic_Beam_Schalten"]);
  //Energy Save
  await controller.init("energySaveToggle",["iKonferenz_Homematic_Luefter_Schalten", "iIoT_Homematic_Multitouchtisch_Schalten", "iMultimedia_Homematic_Beam_Schalten"]);
  
  const allItemNames = Object.values(controller.items).flat();

  firstSSEReceived = {};
  allItemNames.forEach(item => {firstSSEReceived[item] = false;});

  currentEventSource = model.listenToEvents(allItemNames, (event) => {
  if(event.type === "ItemStateChangedEvent") {
    const itemName = event.topic.split('/')[2];

    let newState;
    if(typeof event.payload === "string") {
      try {const payloadObj = JSON.parse(event.payload);
        newState = payloadObj.value || payloadObj.state || payloadObj;
      } catch(e) {newState = event.payload;}
    } else if(typeof event.payload === "object" && event.payload !== null) {newState = event.payload.value || event.payload.state || event.payload;
    } else {newState = event.payload;}

    currentStates[itemName] = newState;
      if(!firstSSEReceived[itemName]) {firstSSEReceived[itemName] = true;}
      for(const [buttonName, itemNames] of Object.entries(controller.items)) {
        if(itemNames.includes(itemName)) {
          const allOn = itemNames.every((item) => currentStates[item] === "ON");
          view.update(buttonName, allOn ? "ON" : "OFF");}}}
  });

  view.setToggleCallback((buttonName) => controller.toggleLight(buttonName));
  //Meeting
  view.setMeetingCallback((command) => controller.meetingControl(command));
  //Hide
  view.setHideCallback((command) => controller.hideControl(command));
  //Reset
  view.setResetCallback(() => controller.resetControl());
  //Party Mode
  view.setPartyCallback((command) => {controller.partyControl(command);});
  controller.startLiveUpdates();
}


function setupDarkModeToggle() {
  const button = document.getElementById("darkModeToggle");
  if(!button) return;

  // Restore the state
  if(localStorage.getItem("darkMode") === "on") {
    document.body.classList.add("dark-mode");
    button.textContent = "Dark Mode AUS";
  }

  // Klick-Event
  button.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    button.textContent = isDark ? "Dark Mode AUS" : "Dark Mode EIN";
    localStorage.setItem("darkMode", isDark ? "on" : "off");
  });
}


async function bootstrap() {
  await loadView('./view/index.html');
  setupDarkModeToggle(); 
  await initMainView();
  //HomeControl2
  document.addEventListener("click", async (e) => {
    if(e.target.id === "loadHomeControl2") {
      await loadView('./view/homecontrol2.html');
      setupDarkModeToggle(); 
      await initHomeControl2();
    }
    //Back to MainView
    if(e.target.id === "goToMainView") {
      await loadView('./view/index.html');
      await initMainView();
    }
  });
}


bootstrap();


//iApplikation_Alexa_Party                        //partyToggle !Only ON Button works!

//iKonferenz_Amazon_EchoDot_Befehl_Saugroboter    //clearToggle

// curl -X POST -H "Content-Type: text/plain"  --data "OFF"  http://192.168.0.5:8080/rest/items/
