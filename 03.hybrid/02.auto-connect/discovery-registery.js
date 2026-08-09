const discoveredDevices = new Map();

// add ne w device
export function addDevice(device) {
  discoveredDevices.set(device.sessionId, device);
}


// remove device by sessionId
export function removeDevice(sessionId) {
  discoveredDevices.delete(sessionId);
}

// get device by session id
export function getDevice(sessionId) {
  return discoveredDevices.get(sessionId);
}

// get all device
export function getDevices() {
  return discoveredDevices;
}