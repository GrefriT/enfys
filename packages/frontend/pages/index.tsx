import Head from "components/Head";
import JoinRoom from "components/JoinRoom";

export default function Home() {
	return (
		<>
			<Head title="Meet the next era of video calls" />
			<div className="space-y-4 text-center">
				<h1 className="text-4xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600">
					Meet the next era
					<br /> of video calls
				</h1>
				<p className="opacity-75">
					No freaky accounts with emails and passwords, completly anonymous.
					<br /> Take back control of your data.
				</p>
			</div>
			<JoinRoom />
		</>
	);
}
