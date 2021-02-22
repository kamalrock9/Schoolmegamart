import * as React from "react";
import Svg, {G, Path} from "react-native-svg";

function SvgGrid(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15" {...props}>
      <Path data-name="Rectangle 568" fill="none" d="M0 0h15v15H0z" />
      <G data-name="Grid">
        <Path
          data-name="Path 2329"
          d="M14.158 8.35H8.692a.342.342 0 00-.342.342v5.467a.342.342 0 00.342.342h5.467a.342.342 0 00.342-.342V8.692a.342.342 0 00-.343-.342zm-.342 5.467H9.033V9.033h4.783z"
        />
        <Path
          data-name="Path 2330"
          d="M14.158.833H8.692a.342.342 0 00-.342.342v5.466a.342.342 0 00.342.342h5.467a.342.342 0 00.342-.342V1.175a.342.342 0 00-.343-.342zM13.816 6.3H9.033V1.516h4.783z"
        />
        <Path
          data-name="Path 2332"
          d="M6.641 8.35H1.175a.342.342 0 00-.342.342v5.467a.342.342 0 00.342.342h5.466a.342.342 0 00.342-.342V8.692a.342.342 0 00-.342-.342zm-.342 5.467H1.516V9.033H6.3z"
        />
        <Path
          data-name="Path 2333"
          d="M6.641.833H1.175a.342.342 0 00-.342.342v5.466a.342.342 0 00.342.342h5.466a.342.342 0 00.342-.342V1.175a.342.342 0 00-.342-.342zM6.3 6.3H1.516V1.516H6.3z"
        />
        <Path
          data-name="Path 2338"
          d="M2.2 2.541h1.708a.342.342 0 100-.683H2.2a.342.342 0 000 .683z"
        />
        <Path
          data-name="Path 2339"
          d="M4.933 2.541h.342a.342.342 0 100-.683h-.342a.342.342 0 000 .683z"
        />
      </G>
    </Svg>
  );
}

export default SvgGrid;
