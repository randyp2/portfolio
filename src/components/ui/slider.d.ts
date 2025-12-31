import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
declare const Slider: React.ForwardRefExoticComponent<Omit<SliderPrimitive.SliderProps & React.RefAttributes<HTMLSpanElement>, "ref"> & {
    showTooltip?: boolean;
    tooltipContent?: (value: number) => React.ReactNode;
} & React.RefAttributes<HTMLSpanElement>>;
export { Slider };
