import React from "react";
import Svg, {G, Path} from "react-native-svg";

const SvgNotification = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={512}
    height={469.33}
    viewBox="0 0 512 469.33"
    {...props}>
    <Path data-name="Rectangle 312" fill="none" d="M0 0h512v469.33H0z" />
    <G data-name="bell (3)">
      <G data-name="Group 1255">
        <Path
          fill="currentColor"
          stroke={props.style.color}
          data-name="Path 2258"
          d="M284.887 81.742a9.781 9.781 0 01-9.778-9.778V39.111a19.555 19.555 0 10-39.111 0v32.853a9.778 9.778 0 01-19.555 0V39.111a39.111 39.111 0 0178.222 0v32.853a9.769 9.769 0 01-9.778 9.778z"
        />
      </G>
      <G data-name="Group 1256">
        <Path
          fill="currentColor"
          stroke={props.style.color}
          data-name="Path 2259"
          d="M255.554 469.33a68.519 68.519 0 01-68.444-68.444 9.778 9.778 0 1119.555 0 48.889 48.889 0 0097.777 0 9.778 9.778 0 1119.555 0 68.519 68.519 0 01-68.443 68.444z"
        />
      </G>
      <G data-name="Group 1257">
        <Path
          fill="currentColor"
          stroke={props.style.color}
          data-name="Path 2260"
          d="M421.775 410.666H89.333a29.334 29.334 0 01-19.067-51.626 135.957 135.957 0 0048.4-104.074v-59.412c0-75.488 61.404-136.888 136.888-136.888s136.888 61.4 136.888 136.888v59.412a135.8 135.8 0 0048.243 103.937 29.337 29.337 0 01-18.91 51.763zM255.554 78.221a117.451 117.451 0 00-117.332 117.333v59.412a155.358 155.358 0 01-55.166 118.875 9.773 9.773 0 006.277 17.267h332.442a9.778 9.778 0 006.356-17.209 155.479 155.479 0 01-55.244-118.933v-59.412A117.451 117.451 0 00255.554 78.221z"
        />
      </G>
    </G>
  </Svg>
);

export default SvgNotification;
