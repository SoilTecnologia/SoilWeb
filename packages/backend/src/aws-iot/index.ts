export type IotDeviceType = "Raspberry" | "Cloud";
class IotDevice {
	type: IotDeviceType;

	constructor(type: IotDeviceType) {
		this.type = type;
	}

	start() {

	}
}