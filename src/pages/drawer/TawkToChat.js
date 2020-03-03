import React, {Fragment} from "react";
import {StyleSheet} from "react-native";
import {Toolbar} from "components";
import {WebView} from "react-native-webview";

class TawkToChat extends React.Component {
  render() {
    const {navigation} = this.props;
    return (
      <Fragment>
        <Toolbar backButton />
        <Web
          source={{uri: navigation.getParam("uri")}}
          style={styles.container}
          startInLoadingState={true}
        />
      </Fragment>
    );
  }
}

const Web = props => <WebView {...props} />;
export default TawkToChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
