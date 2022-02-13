import { useEffect, useRef, ComponentPropsWithoutRef } from "react";

type Props = {
	stream: MediaStream;
} & ComponentPropsWithoutRef<"video">;

export default function UserVideo({ stream, ...props }: Props) {
	const video = useRef<HTMLVideoElement>();

	useEffect(() => {
		video.current.srcObject = stream;
	}, [stream]);

	return <video ref={video} muted autoPlay playsInline {...props} />;
}
