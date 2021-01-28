import React from "react";
import Svg, {G, Path} from "react-native-svg";

const SvgManageAddress = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={513}
    height={469.33}
    viewBox="0 0 513 469.33"
    {...props}>
    <G data-name="manage your address">
      <Path data-name="Rectangle 309" fill="none" d="M.5 0h512v469.33H.5z" />
      <G data-name="address (3)" stroke="#000">
        <Path
            fill="currentColor"
            stroke={props.style.color}
          data-name="Path 2256"
          d="M503.967 200.465a8.531 8.531 0 008.533-8.534v-51.2a8.531 8.531 0 00-8.533-8.533h-25.6v-8.533a8.531 8.531 0 00-8.533-8.533H196.767a8.246 8.246 0 00-2.245.453l-43.839-32.879a8.525 8.525 0 00-10.233 0L3.917 185.106A8.522 8.522 0 00.5 191.931v51.2a8.538 8.538 0 0013.058 7.238L34.633 237.2v142.465a8.531 8.531 0 008.533 8.533h426.667a8.531 8.531 0 008.533-8.533v-8.533h25.6a8.531 8.531 0 008.534-8.532v-51.2a8.531 8.531 0 00-8.533-8.533h-25.6V285.8h25.6a8.531 8.531 0 008.533-8.535v-51.2a8.531 8.531 0 00-8.533-8.533h-25.6v-17.067zm-8.533-51.2V183.4h-17.067v-34.135zM17.567 196.2l128-96 128 96v31.538l-123.475-77.177a8.549 8.549 0 00-9.05 0L17.567 227.736zM51.7 226.529l93.867-58.669 93.867 58.669v144.6h-17.067v-93.864a8.531 8.531 0 00-8.533-8.533h-51.2a8.531 8.531 0 00-8.533 8.533v93.867H51.7zm119.467 144.6V285.8H205.3v85.333zm290.133 0H256.5V237.2l21.075 13.172a8.538 8.538 0 0013.058-7.237v-51.2a8.523 8.523 0 00-3.417-6.825l-70.544-52.91H461.3v238.931zm34.133-51.2v34.133h-17.066v-34.131zm0-85.333v34.133h-17.066V234.6z"
        />
        <Path
          fill="currentColor"
          stroke={props.style.color}
          data-name="Path 2257"
          d="M410.1 157.798h-85.334a8.531 8.531 0 00-8.533 8.533v51.2a8.531 8.531 0 008.533 8.533h85.333a8.531 8.531 0 008.533-8.533v-51.2a8.531 8.531 0 00-8.532-8.533zm-8.533 51.2H333.3v-34.133h68.267zm8.533 51.2h-85.334a8.534 8.534 0 000 17.067h85.333a8.534 8.534 0 000-17.067zm0 34.133h-85.334a8.534 8.534 0 000 17.067h85.333a8.534 8.534 0 000-17.067zm0 34.133h-85.334a8.534 8.534 0 000 17.067h85.333a8.534 8.534 0 000-17.067z"
        />
      </G>
    </G>
  </Svg>
);

export default SvgManageAddress;
