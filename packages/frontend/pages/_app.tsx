import type { AppProps } from "next/app";
import "styles/globals.css";
import DefaultLayout from "layouts";

const defaultGetLayout = (page: JSX.Element) => <DefaultLayout>{page}</DefaultLayout>;

type Props = AppProps & {
	Component: { getLayout?: typeof defaultGetLayout };
};

export default function App({ Component, pageProps }: Props) {
	const getLayout = Component.getLayout || defaultGetLayout;

	return getLayout(<Component {...pageProps} />);
}
