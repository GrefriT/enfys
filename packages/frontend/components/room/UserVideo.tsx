import type { ComponentPropsWithoutRef } from "react";

type Props = {
	stream: MediaStream;
} & ComponentPropsWithoutRef<"video">;

export default function UserVideo({ stream, ...props }: Props) {
	const handleUserVideo = (video: HTMLVideoElement) => video && (video.srcObject = stream);

	return <video key={stream.id} ref={handleUserVideo} muted autoPlay playsInline {...props} />;
}
