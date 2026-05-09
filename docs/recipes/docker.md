# Docker Serial Device Access

## Basic Setup

```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]
```

## Run with Device Access

```bash
docker run --device /dev/ttyUSB0 -e SERIAL_PORT=/dev/ttyUSB0 my-app
```

## Multiple Devices

```bash
docker run \
  --device /dev/ttyUSB0 \
  --device /dev/ttyACM0 \
  -e SERIAL_PORT=/dev/ttyUSB0 \
  my-app
```

## udev Rules

For consistent device naming across reboots:

```bash
# /etc/udev/rules.d/99-serial.rules
SUBSYSTEM=="tty", ATTRS{idVendor}=="2341", ATTRS{idProduct}=="0043", SYMLINK+="arduino"
SUBSYSTEM=="tty", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="6001", SYMLINK+="ftdi"
```

Then use `SerialPilot.findPorts({ vendorId: '2341' })` for stable device identification instead of `/dev/ttyUSB*`.