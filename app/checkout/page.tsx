import Footer from "../../components/layout/footer";
import type {Metadata} from "next";

export async function generateMetadata({
   params
}: {
    params: { handle: string };
}): Promise<Metadata> {
    const indexable = false
    return {
        title: 'Checkout',
        description: 'Checkout',
        robots: {
            index: indexable,
            follow: indexable,
            googleBot: {
                index: indexable,
                follow: indexable
            }
        },
    };
}

export function Checkout() {
    return (
        <div className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700">
            <div className="relative flex w-full flex-row justify-between px-1 py-4">
                <div>
                    <div>
                        test
                    </div>
                </div>
            </div>
            <div className="flex h-16 flex-col justify-between">
                <div>
                    test
                </div>
            </div>
        </div>
    );
}

export default async function CheckoutPage({ params }: { params: { handle: string } }) {
    return (
        <>
            <Checkout/>
            <Footer />
        </>
    );
}