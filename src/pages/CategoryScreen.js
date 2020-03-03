import React, {Component} from "react";
import {ScrollView, StyleSheet} from "react-native";
import {connect} from "react-redux";
import {Text, Toolbar, Icon, TreeView} from "components";
import {getAllCategories} from "store/actions";

class CategoryScreen extends React.PureComponent {
  static navigationOptions = ({navigation}) => ({
    header: <Toolbar backButton />,
  });

  constructor(props) {
    super(props);
    this.props.getAllCategories();
  }

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

  render() {
    return (
      <ScrollView
        style={
          {
            //paddingVertical: 16
            //paddingHorizontal: 16
          }
        }>
        {this.props.categories.data != undefined && (
          <TreeView
            ref={ref => (this.treeView = ref)}
            data={this.props.categories.data}
            collapsedItemHeight={40}
          />
        )}
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryScreen);
