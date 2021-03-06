import React from "react";
import {ScrollView} from "react-native";
import {connect} from "react-redux";
import {Text, Toolbar, Icon, TreeView} from "components";
import {getAllCategories} from "store/actions";
import analytics from "@react-native-firebase/analytics";

class CategoryScreen extends React.PureComponent {
  static navigationOptions = {
    header: <Toolbar backButton title="Category" />,
  };

  constructor(props) {
    super(props);
    this.props.getAllCategories();
  }

  componentDidMount() {
    this.trackScreenView("Category Screen");
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().logScreenView({screen_name: screen, screen_class: screen});
  };

  _renderCategoryItem = (item, level) => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginStart: 16 * level,
            height: 40,
          }}>
          <Text style={{fontSize: 16}}>{item.name}</Text>
          {item.collapsed !== null && (
            <Icon name={item.collapsed ? "ios-add" : "ios-remove"} size={24} />
          )}
        </View>
      </View>
    );
  };

  gotoPage = id => {
    console.log(id);
    this.props.navigation.navigate("ProductScreen", {category_id: id});
  };

  render() {
    return (
      <>
        <Toolbar title="Categories" menuButton cartButton wishListButton searchButton />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 12,
          }}>
          {this.props.categories.data != undefined && (
            <TreeView
              data={
                this.props.categories.data
                  ? this.props.categories.data.filter(item => item.hide_on_app === "no")
                  : []
              }
              collapsedItemHeight={40}
              onpress={this.gotoPage}
            />
          )}
        </ScrollView>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    categories: state.categories,
  };
};

const mapDispatchToProps = {
  getAllCategories,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryScreen);
