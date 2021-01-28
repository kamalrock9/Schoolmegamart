import React from "react";
import Svg, {G, Path, Rect} from "react-native-svg";

const SvgMenu = props => (
  <Svg viewBox="0 0 512 469.33" width="1em" height="1em" {...props}>
    <G transform="translate(-1775 -1901)">
      <Path
        fill="currentColor"
        data-name="Rectangle 284"
        fill="none"
        d="M1775 1901h512v469.33h-512z"
      />
      <Rect
        fill="currentColor"
        data-name="Rectangle 285"
        width={414}
        height={26}
        rx={13}
        transform="translate(1775 1902)"
      />
      <Rect
        fill="currentColor"
        data-name="Rectangle 286"
        width={255}
        height={26}
        rx={13}
        transform="translate(1775 2123)"
      />
      <Rect
        fill="currentColor"
        data-name="Rectangle 287"
        width={512}
        height={26}
        rx={13}
        transform="translate(1775 2343)"
      />
    </G>
  </Svg>
);

export default SvgMenu;
