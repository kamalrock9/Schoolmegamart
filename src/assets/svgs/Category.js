import React from "react";
import Svg, {G, Path} from "react-native-svg";

const SvgCategories = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={512}
    height={470.25}
    viewBox="0 0 512 470.25"
    {...props}>
    <G data-name="shop by category">
      <Path data-name="Rectangle 307" fill="none" d="M0 0h512v469.33H0z" />
      <G data-name="category (1)">
        <Path
          data-name="Path 2253"
          d="M351.424 17h72.355C453.715 17 478 41.5 478 71.714v72.96c0 30.2-24.285 54.715-54.221 54.715h-72.355c-29.958 0-54.243-24.519-54.243-54.715v-72.96C297.181 41.5 321.466 17 351.424 17zm-262.18 0h72.332c29.959 0 54.244 24.5 54.244 54.714v72.96c0 30.2-24.285 54.715-54.244 54.715H89.244C59.285 199.39 35 174.871 35 144.675V71.714C35 41.5 59.285 17 89.244 17zm0 260.61h72.332c29.959 0 54.244 24.5 54.244 54.737v72.938c0 30.215-24.285 54.715-54.244 54.715H89.244C59.285 460 35 435.5 35 405.285v-72.938c0-30.241 24.285-54.737 54.244-54.737zm262.18 0h72.355c29.936 0 54.221 24.5 54.221 54.737v72.938C478 435.5 453.715 460 423.779 460h-72.355c-29.958 0-54.243-24.5-54.243-54.715v-72.938c0-30.241 24.285-54.737 54.243-54.737z"
          fill="none"
          stroke={props.style.color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={20.5}
        />
      </G>
    </G>
  </Svg>
);

export default SvgCategories;
