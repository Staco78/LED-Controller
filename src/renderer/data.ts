import { ReadlineParser, SerialPort } from "serialport";

const MAGIC = 0xab;

interface Packet {
    magic: number; // u8
    size: number; // u8
    action: number; // u8
    subAction: number; // u8
    data: Buffer; // u8[size - 4]
}

namespace Data {
    let _port: SerialPort;
    let lastColor: string;
    let colorIsUpdating: boolean = false;
    let _color: string = "#FFFFFF";

    export function setPort(port: SerialPort) {
        _port = port;

        _port.on("error", console.error);

        const parser = _port.pipe(new ReadlineParser());
        parser.on("data", console.log);

        updateColor();
    }

    export function setColor(color: string) {
        _color = color;
        if (!colorIsUpdating) updateColor();
    }

    function createPacket(action: number, subAction: number, data: Buffer): Packet {
        return {
            magic: MAGIC,
            size: 4 + data.length,
            action,
            subAction,
            data,
        };
    }

    function sendPacket(packet: Packet) {
        return new Promise<void>((resolve, reject) => {
            const buffer = Buffer.alloc(packet.size);
            buffer.writeUInt8(packet.magic, 0);
            buffer.writeUInt8(packet.size, 1);
            buffer.writeUInt8(packet.action, 2);
            buffer.writeUInt8(packet.subAction, 3);
            packet.data.copy(buffer, 4);

            _port.write(buffer, "binary");
            _port.drain(e => {
                if (e) reject(e);
                else resolve();
            });
        });
    }

    async function updateColor() {
        colorIsUpdating = true;
        lastColor = _color;
        const data = Buffer.from([
            parseInt(_color.substring(1, 3), 16),
            parseInt(_color.substring(3, 5), 16),
            parseInt(_color.substring(5, 7), 16),
        ]);
        const packet = createPacket(0, 0, data);
        await sendPacket(packet);
        if (lastColor !== _color) updateColor();
        else colorIsUpdating = false;
    }
}

export default Data;
