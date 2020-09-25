import React from "react";
import PropTypes from "prop-types";
import {View, Image, Dimensions, TouchableOpacity, FlatList} from "react-native";
import {withNavigation} from "react-navigation";
import FastImage from "react-native-fast-image";
import Text from "./Text";
import Icon from "./IconNB";
import Button from "./Button";

const makeCollapsed = (data, childrenKey) => {
  return data.map(children => {
    if (children[childrenKey] && children[childrenKey].length > 0) {
      if (typeof children.collapsed === "undefined") {
        children.collapsed = true;
      }

      makeCollapsed(children[childrenKey], childrenKey);
    } else {
      children.collapsed = null;
    }

    return children;
  });
};

const {width} = Dimensions.get("window");
class TreeView extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    collapsedItemHeight: PropTypes.number,
    idKey: PropTypes.string,
    childrenKey: PropTypes.string,
    onItemPress: PropTypes.func,
    onItemLongPress: PropTypes.func,
    deleteOnLongPress: PropTypes.bool,
  };

  static defaultProps = {
    collapsedItemHeight: 20,
    deleteOnLongPress: false,
    idKey: "id",
    childrenKey: "children",
  };

  constructor(props) {
    super(props);

    this.state = {
      data: makeCollapsed(props.data.slice()),
      idKey: props.idKey,
      childrenKey: props.childrenKey,
    };

    this.handleNodePressed = this.handleNodePressed.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps == null) {
      return null;
    }
    return {
      data: makeCollapsed(nextProps.data.slice(), nextProps.childrenKey),
    };
  }

  toggleCollapse(data, id) {
    let found;

    return data.map(children => {
      if (
        children[this.props.idKey] === id &&
        typeof children.collapsed !== "undefined" &&
        children.collapsed !== null
      ) {
        children.collapsed = !children.collapsed;
        found = true;
      }

      if (!found && children[this.props.childrenKey]) {
        this.toggleCollapse(children[this.props.childrenKey], id);
      }

      return children;
    });
  }

  removeNull(data) {
    data.map((children, i) => {
      if (children[this.props.childrenKey]) {
        children[this.props.childrenKey] = children[this.props.childrenKey].filter(i => i !== null);

        if (!children[this.props.childrenKey].length) {
          delete children[this.props.childrenKey];
          children.collapsed = null;
        }
      }
    });
  }

  deleteNode(data, id) {
    data.map((children, i) => {
      if (children[this.props.childrenKey]) {
        this.deleteNode(children[this.props.childrenKey], id);
      }

      if (children[this.props.idKey] === id) {
        delete data[i];
      }
    });

    this.removeNull(data);

    return data;
  }

  removeCollapsedKey(data) {
    data.map((children, i) => {
      if (children[this.props.childrenKey]) {
        this.removeCollapsedKey(children[this.props.childrenKey]);
      }

      delete children.collapsed;
    });

    return data;
  }

  getRawData() {
    return this.removeCollapsedKey(this.state.data.slice());
  }

  handleNodePressed(children, level) {
    const newData = this.toggleCollapse(this.state.data.slice(), children[this.props.idKey]);
    this.setState({data: newData});
    this.props.onItemPress && this.props.onItemPress(children, level);
  }

  handleDeleteNode(id) {
    const data = this.deleteNode(this.state.data.slice(), id);

    this.setState({
      data,
    });
  }

  gotoPage = id => () => {
    this.props.onpress && this.props.onpress(id);
  };

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          width: width / 2 - 16,
          marginTop: index > 1 ? 24 : 8,
          marginEnd: index % 2 == 0 ? 8 : 0,
          marginBottom: this.state.data.length - 2 ? 16 : 0,
          alignItems: "center",
        }}
        key={item + "sap" + index}
        onPress={this.gotoPage(item.id)}>
        <Image
          style={{width: width / 2 - 16, height: 150, resizeMode: "contain", borderRadius: 16}}
          source={{
            uri:
              item.image != null
                ? item.image.src
                : "https://user-images.githubusercontent.com/2351721/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png",
          }}
        />
        <Text style={{fontSize: 14, paddingStart: 10, fontWeight: "600"}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  _keyextractor = (item, index) => item + "sap" + index;

  // renderTree(data, level) {
  //   return data.map(children => {
  //     const hasChildren =
  //       children[this.props.childrenKey] && children[this.props.childrenKey].length > 0;

  //     return (
  //       <View
  //         key={children[this.props.idKey]}
  //         style={{
  //           height: children.collapsed ? this.props.collapsedItemHeight : "auto",
  //           zIndex: 1,
  //           marginVertical: 10,
  //           overflow: "hidden",
  //         }}>
  //         <View style={{flexDirection: "row"}}>
  //           <Image
  //             style={{width: width / 2, height: 150}}
  //             source={{
  //               uri:
  //                 children.image != null
  //                   ? children.image.src
  //                   : "https://user-images.githubusercontent.com/2351721/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png",
  //             }}
  //           />
  //         </View>
  //         {/* <FlatList
  //           numColumns={2}
  //           data={children}
  //           renderItem={this._renderItem}
  //           keyExtractor={this._keyextractor}
  //         /> */}
  //         {/* <View
  //           style={{
  //             flexDirection: "row",
  //             justifyContent: "space-between",
  //             alignItems: "center",
  //             marginStart: 25 * level,
  //             //height: 40
  //           }}>
  //           <View style={{flexDirection: "row", alignItems: "center"}}>
  //             <FastImage
  //               source={{
  //                 uri:
  //                   children.image != null
  //                     ? children.image.src
  //                     : "https://user-images.githubusercontent.com/2351721/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png",
  //               }}
  //               style={{width: 36, height: 36}}
  //             />
  //             <TouchableOpacity onPress={this.gotoPage(children.id)}>
  //               <Text style={{fontSize: 14, paddingStart: 10, fontWeight: "400"}}>
  //                 {children.name + " (" + children.count + ")"}
  //               </Text>
  //             </TouchableOpacity>
  //           </View>
  //           {children.collapsed !== null &&
  //             children[this.props.childrenKey] &&
  //             children[this.props.childrenKey].length > 0 && (
  //               <Button
  //                 style={{padding: 8}}
  //                 onPress={() => this.handleNodePressed(children, level)}>
  //                 <Icon name={children.collapsed ? "ios-add" : "ios-remove"} size={24} />
  //               </Button>
  //             )}
  //         </View>
  //         {hasChildren && this.renderTree(children[this.props.childrenKey], level + 1)} */}
  //       </View>
  //     );
  //   });
  // }

  render() {
    return (
      <FlatList
        numColumns={2}
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={this._keyextractor}
      />
    );
  }
}

export default withNavigation(TreeView);
