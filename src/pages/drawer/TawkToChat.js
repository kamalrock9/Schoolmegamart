import React, {Fragment} from "react";
import {StyleSheet} from "react-native";
import {Container, Toolbar} from "components";
import {WebView} from "react-native-webview";

class TawkToChat extends React.Component {
  render() {
    const {navigation} = this.props;
    return (
      <Container>
        <Toolbar backButton />
        <Web
          source={{uri: navigation.getParam("uri")}}
          style={styles.container}
          startInLoadingState={true}
        />
      </Container>
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
