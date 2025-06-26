// components/landing-page/ActionStripe.jsx

import { useState } from "react";
import { useRouter } from "next/router";
import StripeWow from "../common/StripeWow";
import DashedButton from "../common/DashedButton";

export default function ActionStripe(){

    const [open, setOpen] = useState(false);
    const router = useRouter();

    const go = (path) => {
        router.push(path);
        setOpen(false);
    };

    return(
        <StripeWow
            color="#9eabb5"
            bgImage="/assets/mindcheck-watermark.svg"
            bgOpacity={0.15}
            >
            <div className="text-center max-w-3xl mx-auto px-4">
                <p className="text-white text-2xl md:text-4xl leading-relaxed rubik-light-italic">
                    Tu conocimiento merece la
                    <span className="rubik-semibold"> mejor versión de ti. </span>
                    Empieza a<span className="rubik-semibold"> entrenar </span>tu mente hoy.
                </p>

                <div className="mt-6 flex justify-center">
                    <DashedButton
                        className="hover:bg-yellow-300"
                        onClick={() => go("/register")}
                    >
                        Crear mi primer test ahora mismo!
                    </DashedButton>
                </div>
            </div>
        </StripeWow>
    );
}