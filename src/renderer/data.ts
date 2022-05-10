import assert from "assert";
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
    let packetToSend: Packet | null = null;
    let isSendingPacket = false;

    export function setPort(port: SerialPort) {
        _port = port;

        _port.on("error", console.error);

        const parser = _port.pipe(new ReadlineParser());
        parser.on("data", console.log);

        isSendingPacket = false;
    }

    export function setColor(color: string) {
        pushPacket(
            createPacket(
                0,
                0,
                Buffer.from([
                    parseInt(color.substring(1, 3), 16),
                    parseInt(color.substring(3, 5), 16),
                    parseInt(color.substring(5, 7), 16),
                ])
            )
        );

        if (!isSendingPacket) updateData();
    }

    function pushPacket(packet: Packet) {
        packetToSend = packet;
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

    async function updateData() {
        isSendingPacket = true;
        if (packetToSend) {
            const packet = packetToSend;
            packetToSend = null;
            await sendPacket(packet);
            updateData();
        } else isSendingPacket = false;
    }
}

export default Data;
