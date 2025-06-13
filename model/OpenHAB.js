export class OpenHAB {
  constructor(baseUrl, username, password) {
    this.data={};
    this.observers=[];
    this.baseUrl = baseUrl;
    this.username = username;
    this.password = password;
  }


  // Observer registrieren
  async addObserver(observerFn) {
    this.observers.push(observerFn);
  }


  // Observer entfernen (optional)
  async removeObserver(observerFn) {
    this.observers = this.observers.filter(obs => obs !== observerFn);
  }


  // Observer benachrichtigen
  async notifyObservers() {
    this.observers.forEach(observerFn => observerFn(this.data));
  }


  // Daten setzen und Observer benachrichtigen
  async setData(newData) {
    this.data = newData;
    this.notifyObservers();
  }


  async getData() {
    return this.data;
  }


  async getItemState(itemName) {
    const response = await fetch(`${this.baseUrl}/items/${itemName}/state`, {
      headers: this._getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Fehler beim Abrufen von ${itemName}`);
    return response.text();
  }


  async sendCommand(itemName, command) {
    const response = await fetch(`${this.baseUrl}/items/${itemName}`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        ...this._getAuthHeaders(),
      },
      body: command,
    });
    if (!response.ok) throw new Error(`Fehler beim Senden des Kommandos an ${itemName}`);
    console.log(`Command sent successfully to ${itemName}`); // Debugging
    return response;
  }


  async postUpdate(itemName, state) {
    const response = await fetch(`${this.baseUrl}/items/${itemName}/state`, {
      method: "PUT",
      headers: {
        "Content-Type": "text/plain",
        ...this._getAuthHeaders(),
      },
      body: state,
    });
    if (!response.ok) throw new Error(`Fehler beim Aktualisieren des States von ${itemName}`);
    return response;
  }


  _getAuthHeaders() {
    if (this.username && this.password) {
      return {
        Authorization: `Basic ${btoa(this.username + ":" + this.password)}`,
      };
    }
    return {};
  }


  /**
   * Listen to OpenHAB SSE events for one or more items.
   * @param {string|string[]} itemNames - Item name or array of item names.
   * @param {function} callback - Function to call with parsed event data.
   * @returns {EventSource}
   */
  listenToEvents(itemNames, callback) {
    const itemsParam = Array.isArray(itemNames) ? itemNames.join(',') : itemNames;
    const eventSource = new EventSource(`${this.baseUrl}/events?items=${itemsParam}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Only handle state changes
        if (data.type === "ItemStateChangedEvent") {
          callback(data);
        }
      } catch (err) {
        console.error("Fehler beim Parsen der Event-Daten:", err, event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Fehler bei SSE:", error);
      setTimeout(() => {
        this.listenToEvents(itemNames, callback);
      }, 5000);
      eventSource.close();
    };

    return eventSource;
  }

}