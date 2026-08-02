import { Suspense } from "react";
import { Checkout } from "@/app/checkout/checkout";
export const metadata={title:"Secure checkout"};
export default function CheckoutPage(){return <Suspense><Checkout/></Suspense>}
