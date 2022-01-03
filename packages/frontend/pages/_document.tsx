import Document, { Html, Head, Main, NextScript } from "next/document";

export default class CustomDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<meta charSet="UTF-8" />
					<meta name="theme-color" content="#10B981" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap"
						rel="stylesheet"
					/>
					<script
						dangerouslySetInnerHTML={{
							__html: "window.changeTheme=(theme='system')=>{localStorage.theme=theme;if(theme==='dark'||(theme==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark')};changeTheme(localStorage.theme)",
						}}
					/>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<body className="bg-neutral-100 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900 transition">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
