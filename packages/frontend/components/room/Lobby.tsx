import { useState } from "react";
import Link from "next/link";
import type { Room } from "hooks/useRoom";
import Button from "components/Button";
import Input from "components/Input";
import CameraSelect from "components/room/CameraSelect";
import MicSelect from "components/room/MicSelect";

export type UserConfig = {
	name: string;
	camera: string;
	mic: string;
};

type Props = {
	room: Room;
	onJoin: (config: UserConfig) => void;
};

export default function Lobby({ room, onJoin }: Props) {
	const [config, setConfig] = useState({ name: "", camera: "", mic: "" });
	const updateConfig = (value: Partial<typeof config>) =>
		setConfig((config) => ({ ...config, ...value }));

	return (
		<div className="flex items-center justify-center p-4 h-screen">
			<div className="max-w-full bg-white dark:bg-neutral-700 rounded-2xl shadow-md">
				<div className="flex flex-wrap-reverse border-b justify-center border-neutral-200 dark:border-neutral-600">
					<CameraSelect
						deviceId={config.camera}
						onChange={(camera) => updateConfig({ camera })}
					/>
					<div className="w-96 max-w-full p-4 space-y-8">
						<div className="flex items-center justify-between gap-4">
							<h1 className="font-semibold text-2xl tracking-wide">{room.title}</h1>
							<small className="opacity-75">{room.code}</small>
						</div>
						<Input
							value={config.name}
							onChange={(e) => updateConfig({ name: e.target.value })}
							maxLength={32}
							placeholder="Enter your name / nickname"
						/>
						<MicSelect
							deviceId={config.mic}
							onChange={(mic) => updateConfig({ mic })}
						/>
					</div>
				</div>
				<div className="flex items-center justify-end gap-4 p-4">
					<Link href="/">Cancel</Link>
					<Button disabled={!config.name.trim()} onClick={() => onJoin(config)}>
						Join room
					</Button>
				</div>
			</div>
		</div>
	);
}
