import Header from "../components/Header";
import Footer from "../components/Footer";
import LoaderWrapper from "../components/LoaderWrapper";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <LoaderWrapper />
            <Header />
            {children}
            <Footer />
        </>
    );
}
