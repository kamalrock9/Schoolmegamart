import React, {useState} from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  TextInput,
} from "react-native";
import {Text, Toolbar, Button, ProgressDialog, HTMLRender} from "components";
import {isEmpty} from "lodash";
import {useTranslation} from "react-i18next";
import {ApiClient} from "service";
import {useSelector} from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import Toast from "react-native-simple-toast";
import {CustomPicker} from "react-native-custom-picker";
import Modal from "react-native-modal";

function OrderDetails({navigation}) {
  const {accent_color} = useSelector(state => state.appSettings);
  const user = useSelector(state => state.user);
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const Data = navigation.getParam("item");
  console.log(Data);
  const [data, Setdata] = useState(Data);
  const [orderID] = useState(data.id);
  const [showRefund, setShowRefund] = useState(false);
  const [refundReq] = useState([{name: "Full Refund"}, {name: "Partial Refund"}]);
  const [mode, setMode] = useState(refundReq[0].name);
  const [refReqReason, setrefReqReason] = useState("");
  const [refundData, setrefundData] = useState(
    Data.line_items.map(item => {
      return {
        name: item.name,
        item_id: item.id,
        taxes: item.taxes,
        qty: ArrayQTY(item.quantity),
        quantity: item.quantity,
        subtotal: item.total,
        total_tax: item.total_tax,
        subtotal_tax: item.subtotal_tax,
        price: item.price,
      };
    }),
  );

  function ArrayQTY(item) {
    let Arr = [];
    for (let i = 0; i <= item; i++) {
      Arr.push({name: i});
    }
    console.log(Arr);
    return Arr;
  }

  const _cancelOrder = () => {
    var param = {
      order_id: data.id,
      status: "cancel-request",
      transaction_id: data.payment_id != "" ? data.payment_id : "" || "",
    };
    console.log(param);
    setLoading(true);
    ApiClient.post("/checkout/update-order", param)
      .then(res => {
        setLoading(false);
        console.log(res);
        if (res.status == 200) {
          Setdata(res.data.data);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const _trackYourOrder = () => {
    navigation.navigate("TrackYourOrder", {data});
  };

  const actualDownload = item => {
    alert(item.name);
    if (isEmpty(data.invoice_action["wcfm-store-invoice"])) {
      return;
    }
    //console.log(data.invoice_action["wcfm-store-invoice-3"].url);
    const {dirs} = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: item.name,
        path: `${dirs.DownloadDir}` + "/" + item.name,
      },
    })
      .fetch("GET", item.url, {})
      .then(res => {
        Toast.show(res.path(), Toast.LONG);
        console.log("The file saved to ", res.path());
      })
      .catch(e => {
        console.log(e);
      });
  };

  const _CancelItem = item => () => {
    console.log(item);
    if (isEmpty(user)) {
      Toast.show("Please login first.");
      return;
    }
    // var bodyFormData = new FormData();
    // bodyFormData.append("order_id_", data.id);
    // bodyFormData.append("item_id_", item.id);
    // bodyFormData.append("user_id", user.id);
    // console.log(bodyFormData);
    setLoading(true);
    ApiClient.get(
      "/cancel/order-item/?order_id_=" + data.id + "&item_id_=" + item.id + "&user_id=" + user.id,
    )
      .then(({data}) => {
        setLoading(false);
        console.log(data);
        if (data.status) {
          Toast.show(data.data, Toast.SHORT);
          setLoading(true);
          ApiClient.get("/get-order-by-id?order_id=" + orderID)
            .then(({data}) => {
              setLoading(false);
              console.log(data);
              Setdata(data);
            })
            .catch(error => {
              setLoading(false);
              console.log(error);
            });
        } else {
          Toast.show(data.data, Toast.SHORT);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const _downloadInvoice = item => () => {
    //actualDownload(item);
    try {
      // const granted = PermissionsAndroid.request(
      //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      // );
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(
        res => {
          console.log(res);
          if (res == "granted") {
            actualDownload(item);
          } else {
            Alert.alert(
              "Permission Denied!",
              "You need to give storage permission to download the file",
            );
          }
        },
      );
      // console.log(granted);
      //console.log(PermissionsAndroid.RESULTS.GRANTED);
    } catch (err) {
      console.log(err);
    }
  };

  // const _listHeader = () => {
  //   return (
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         marginHorizontal: 16,
  //         marginTop: 10,
  //         marginBottom: 25,
  //       }}>
  //       <Text style={{fontWeight: "600", fontSize: 12}}>{t("PRODUCTS").toUpperCase()}</Text>
  //       <Text style={{fontSize: 12}}>{item.line_items.length + " Item(S)"}</Text>
  //     </View>
  //   );
  // };

  const openModal = () => {
    setShowRefund(true);
  };

  const closeModal = () => {
    setShowRefund(false);
  };

  const _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 16,
          borderTopStartRadius: 8,
          borderTopEndRadius: 8,
          // elevation: 2,
          // backgroundColor: "#fff",
          borderColor: "#adadad",
          borderWidth: 1,
          padding: 16,
          marginTop: index == 0 ? 8 : 0,
          borderBottomLeftRadius: data.line_items.length - 1 == index ? 8 : 0,
          borderBottomRightRadius: data.line_items.length - 1 == index ? 8 : 0,
        }}
        key={"Sap" + item.id}>
        <Image
          style={{height: 80, width: 80}}
          resizeMode="contain"
          source={{
            uri: item.img_src
              ? item.img_src
              : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg",
          }}
        />
        <View style={{marginStart: 10, flex: 1}}>
          <Text style={{fontWeight: "600", fontSize: 14}}>{item.name}</Text>
          <HTMLRender
            html={item.html_price ? item.html_price : <b />}
            baseFontStyle={{fontWeight: "600"}}
          />
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.txt}>{data.currency_symbol + "" + item.price}</Text>
            <Text style={styles.txt}>{"Qty:" + item.quantity}</Text>
            <Text style={styles.txt}>{data.currency_symbol + "" + item.subtotal}</Text>
          </View>
          {data.status === "processing" &&
            data.line_items.length > 1 &&
            (!item.canclled ? (
              <TouchableOpacity
                style={{backgroundColor: "red", borderRadius: 4, width: 100, alignItems: "center"}}
                onPress={_CancelItem(item)}>
                <Text style={{color: "#fff", fontWeight: "600"}}>Cancel Item</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{backgroundColor: "red", borderRadius: 4, width: 100, alignItems: "center"}}>
                <Text style={{color: "#fff", fontWeight: "600"}}>Cancelled</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    );
  };

  const _listFooter = () => {
    const gotoSum = item => {
      let value = 0;
      for (let i = 0; i < item.length; i++) {
        value += item[i].product_discount_amount;
      }
      return value;
    };
    return (
      <View style={{marginBottom: 16}}>
        {/* <View style={styles.line} /> */}
        <View style={[styles.card, {marginTop: 16}]}>
          <Text style={styles.heading}>{t("ORDER_SUMMARY")}</Text>
          <View style={styles.footerSummaryView}>
            <Text style={styles.text}>Status</Text>
            <Text
              style={[
                styles.text,
                {
                  backgroundColor:
                    data.status == "processing"
                      ? "#76A42E"
                      : data.status == "cancelled" ||
                        data.status == "cancel-request" ||
                        data.status == "failed"
                      ? "#ff0000"
                      : data.status == "completed"
                      ? "#39A3CA"
                      : data.status == "refunded"
                      ? "#76A42E"
                      : data.status == "on-hold"
                      ? "#D0C035"
                      : "#FDB82B",
                  color: "#fff",
                  paddingHorizontal: 8,
                  borderRadius: 4,
                  fontSize: 12,
                  alignSelf: "center",
                  fontWeight: "500",
                },
              ]}>
              {data.status}
            </Text>
          </View>
          <View style={styles.footerSummaryView}>
            <Text style={styles.text}>{t("PAYMENT_METHODS")}</Text>
            <Text style={[styles.text, {color: "#000000"}]}>{data.payment_method_title}</Text>
          </View>
          {!isEmpty(data.shipping_lines) && (
            <View style={styles.footerSummaryView}>
              <Text style={styles.text}>
                {t("SHIPPING") + " (" + data.shipping_lines[0].method_title + ")"}
              </Text>
              <Text style={[styles.text, {color: "#000000"}]}>
                {data.currency_symbol + "" + data.shipping_lines[0].total}
              </Text>
            </View>
          )}
          <View style={styles.footerSummaryView}>
            <Text style={styles.text}>{t("TAX")}</Text>
            <Text style={[styles.text, {color: "#000000"}]}>
              {data.currency_symbol + "" + data.total_tax}
            </Text>
          </View>
          <View style={styles.footerSummaryView}>
            <Text style={styles.text}>Product Discount</Text>
            <Text style={[styles.text, {color: "#000000"}]}>
              {data.currency_symbol +
                "" +
                Math.round((gotoSum(data.line_items) + Number.EPSILON) * 100) / 100}
            </Text>
          </View>
          {!isEmpty(data.coupon_lines) &&
            data.coupon_lines.map((item, index) => {
              return (
                <View key={item + "sap" + index} style={styles.footerSummaryView}>
                  <Text style={styles.text}>{t("COUPON") + " (" + item.code + ")"}</Text>
                  <Text style={[styles.text, {color: "#000000"}]}>
                    {data.currency_symbol + "" + item.discount}
                  </Text>
                </View>
              );
            })}

          {!isEmpty(data.refunds) && (
            <View>
              <Text style={[styles.heading, {marginTop: 16}]}>Cancelled Items</Text>
              {!isEmpty(data.refunds) &&
                data.refunds.map((item, index) => {
                  return (
                    <View
                      key={item + "Sap" + index}
                      style={{flexDirection: "row", justifyContent: "space-between"}}>
                      <Text style={{flex: 1, paddingEnd: 8}}>{item.reason}</Text>
                      <Text>{"-" + data.currency_symbol + item.total * -1}</Text>
                    </View>
                  );
                })}
            </View>
          )}
          <View style={styles.footerSummaryView}>
            <Text style={[styles.text, {fontWeight: "600"}]}>Subtotal</Text>
            <HTMLRender
              html={data.cart_subtotal.value ? data.cart_subtotal.value : <b />}
              baseFontStyle={{fontWeight: "600"}}
            />
          </View>
          <View
            style={{
              height: 1.35,
              backgroundColor: "#d2d2d2",
              flex: 1,
              marginVertical: 5,
              paddingHorizontal: 16,
            }}
          />
          <View style={styles.footerSummaryView}>
            <Text style={[styles.text, {fontWeight: "600"}]}>{t("TOTAL") + " Amount"}</Text>
            <HTMLRender
              html={data.order_total.value ? data.order_total.value : <b />}
              baseFontStyle={{fontWeight: "600"}}
            />
            {/* <Text style={[styles.text, {fontWeight: "600", color: "#000000"}]}>
              {data.prices_include_tax
                ? data.currency_symbol + "" + data.total + "(Inc. Taxes)"
                : data.currency_symbol + "" + Number(data.total) + "(Inc. Taxes)"}
            </Text> */}
          </View>
        </View>
        {/* <View style={styles.line} /> */}
        {/* <Text style={styles.heading}>{t("ADDRESS_INFORMATION")}</Text> */}
        <View style={[styles.card, {marginTop: 16}]}>
          <Text style={{fontSize: 14, fontWeight: "600"}}>{t("BILLING") + " " + t("ADDRESS")}</Text>
          {data.billing.company != "" && (
            <Text style={styles.billingtxt}>{data.billing.company}</Text>
          )}
          {data.billing.first_name != "" && (
            <Text style={styles.billingtxt}>
              {data.billing.first_name && data.billing.last_name
                ? data.billing.first_name + " " + data.billing.last_name
                : data.billing.first_name
                ? data.billing.first_name
                : null}
            </Text>
          )}
          {data.billing.address_1 != "" && (
            <Text style={styles.billingtxt}>{data.billing.address_1}</Text>
          )}
          {!isEmpty(data.billing.address_2) && (
            <Text style={styles.billingtxt}>{data.billing.address_2}</Text>
          )}
          {data.billing.city != "" && (
            <Text style={styles.billingtxt}>
              {data.billing.city ? data.billing.city + " - " + data.billing.postcode : null}
            </Text>
          )}
          {data.billing.state != "" && (
            <Text style={styles.billingtxt}>
              {data.billing.state ? data.billing.state + " \u2022 " + data.billing.country : null}
            </Text>
          )}
        </View>
        <View style={[styles.card, {marginTop: 16}]}>
          <Text style={{fontSize: 14, fontWeight: "600"}}>
            {t("SHIPPING") + " " + t("ADDRESS")}
          </Text>
          {data.shipping.company != "" && (
            <Text style={styles.billingtxt}>{data.shipping.company}</Text>
          )}
          {data.shipping.first_name != "" && (
            <Text style={styles.billingtxt}>
              {data.shipping.first_name && data.shipping.last_name
                ? data.shipping.first_name + " " + data.shipping.last_name
                : data.shipping.first_name
                ? data.shipping.first_name
                : null}
            </Text>
          )}
          {!isEmpty(data.shipping.address_1) && (
            <Text style={styles.billingtxt}>{data.shipping.address_1}</Text>
          )}
          {!isEmpty(data.shipping.address_2) && (
            <Text style={styles.billingtxt}>{data.shipping.address_2}</Text>
          )}
          {data.shipping.city != "" && (
            <Text style={styles.billingtxt}>
              {data.shipping.city ? data.shipping.city + " - " + data.shipping.postcode : null}
            </Text>
          )}
          {data.shipping.state != "" && (
            <Text style={styles.billingtxt}>
              {data.shipping.state
                ? data.shipping.state + " \u2022 " + data.shipping.country
                : null}
            </Text>
          )}
        </View>
        {(data.status === "completed" || data.status === "processing") && (
          <Button
            style={[
              styles.card,
              {marginTop: 16, alignItems: "center", backgroundColor: accent_color},
            ]}
            onPress={_trackYourOrder}>
            <Text style={{color: "#fff", fontWeight: "600"}}>Track Your Order</Text>
          </Button>
        )}

        {data.status === "completed" &&
          !isEmpty(data.invoice_action["wcfm-store-invoice"]) &&
          data.invoice_action["wcfm-store-invoice"].map((item, index) => {
            return (
              <Button
                style={[
                  styles.card,
                  {marginTop: 16, alignItems: "center", backgroundColor: accent_color},
                ]}
                onPress={_downloadInvoice(item)}
                key={item.url + "SAP" + index}>
                <Text style={{color: "#fff", fontWeight: "600"}}>
                  {item.name.replace("&amp;", "&")}
                </Text>
              </Button>
            );
          })}
        {data.status === "processing" &&
          data.status != "cancelled" &&
          data.status != "cancel-request" &&
          data.line_items.length == 1 && (
            <Button
              style={[styles.card, {marginTop: 16, alignItems: "center", backgroundColor: "red"}]}
              onPress={_cancelOrder}>
              <Text style={{color: "#fff", fontWeight: "600"}}>Cancel Order</Text>
            </Button>
          )}
        {data.show_refund_button == 1 && data.status == "completed" && (
          <Button
            style={[
              styles.card,
              {
                marginTop: 16,
                alignItems: "center",
                backgroundColor: accent_color,
              },
            ]}
            onPress={openModal}>
            <Text style={{color: "#fff", fontWeight: "600"}}>Return & Refund</Text>
          </Button>
        )}
      </View>
    );
  };

  const _itemSeperator = () => {
    return (
      <View
        style={{
          height: 1.35,
          backgroundColor: "#d2d2d2",
          width: "100%",
          marginVertical: 10,
          marginHorizontal: 16,
        }}
      />
    );
  };

  const renderOption = settings => {
    const {item, getLabel} = settings;
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          <View style={[styles.box, {backgroundColor: item.color}]} />
          <Text style={{color: item.color, alignSelf: "flex-start"}}>{getLabel(item)}</Text>
        </View>
      </View>
    );
  };

  const renderField = settings => {
    const {selectedItem, defaultText, getLabel, clear} = settings;
    return (
      <View style={styles.container}>
        <View>
          {!selectedItem && (
            <Text style={[styles.text, {color: "#000000", paddingTop: 4}]}>{defaultText}</Text>
          )}
          {selectedItem && (
            <View style={{paddingHorizontal: 16}}>
              <Text style={[styles.text, {color: selectedItem.color, paddingTop: 4}]}>
                {getLabel(selectedItem)}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderFieldQTY = settings => {
    const {selectedItem, defaultText, getLabel, clear} = settings;
    return (
      <View style={styles.containerQTY}>
        <View>
          {!selectedItem && <Text style={[styles.text, {color: "#000000"}]}>{defaultText}</Text>}
          {selectedItem && (
            <View style={{}}>
              <Text style={[styles.text, {color: selectedItem.color}]}>
                {getLabel(selectedItem)}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const setCount = text => {
    console.log(text);
    setMode(text.name);
  };

  const setQuantity = (text, index) => {
    let newData = Object.assign([], refundData);
    newData[index].quantity = text.name;
    let newSubTotal = data.line_items[index].subtotal * text.name;
    let newTotalTax = data.line_items[index].total_tax * text.name;
    let newSubtotalTax = data.line_items[index].subtotal_tax * text.name;
    newData[index].subtotal = newSubTotal.toString();
    newData[index].total_tax = newTotalTax.toString();
    newData[index].subtotal_tax = newSubtotalTax.toString();
    console.log(newData);
    setrefundData(newData);
  };

  const onChangeRefundData = (key, index) => text => {
    let newData = Object.assign([], refundData);
    newData[index][key] = text;
    setrefundData(newData);
  };

  const onChangeReason = text => {
    setrefReqReason(text);
  };

  function makeData(item) {
    let arr = {};
    for (let i = 0; i < item.length; i++) {
      arr[item[i].id] = item[i].total;
    }
    return arr;
  }

  const _returnAndRefund = () => {
    console.log("test");
    console.log(refundData);
    let FinalArr = {};
    for (let i = 0; i < refundData.length; i++) {
      FinalArr[refundData[i].item_id] = Object.assign(
        {},
        {
          qty: refundData[i].quantity,
          item: refundData[i].item_id,
          total: refundData[i].subtotal,
        },
      );
    }
    let FinalTaxArr = {};
    for (let i = 0; i < refundData.length; i++) {
      FinalTaxArr[refundData[i].item_id] = makeData(refundData[i].taxes);
    }
    console.log(FinalTaxArr);
    console.log(FinalArr);
    let return_input = {
      wcfm_refund_request: mode == "Full Refund" ? "full" : "partial",
      wcfm_refund_input: FinalArr,
      wcfm_refund_tax_input: FinalTaxArr,
      wcfm_refund_reason: refReqReason,
      wcfm_refund_order_id: data.id,
    };
    console.log(JSON.stringify(return_input));
    //return;
    if (refReqReason == "") {
      Toast.show("Enter the refund request reason.");
      return;
    }
    setShowRefund(false);
    setLoading(true);
    ApiClient.post("/order/refund-return", return_input)
      .then(({data}) => {
        setLoading(false);
        console.log(data);
        if (data.status) {
          Toast.show(data.message);
          ApiClient.get("/get-order-by-id?order_id=" + orderID)
            .then(({data}) => {
              setLoading(false);
              console.log(data);
              Setdata(data);
            })
            .catch(error => {
              setLoading(false);
              console.log(error);
            });
        } else {
          Toast.show("Something went wrong.");
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const _keyExtractor = item => "Sap" + item.id;

  return (
    <View style={{flex: 1, backgroundColor: "f9f9f9"}}>
      <Toolbar backButton title={"Order" + " #" + data.id} />
      <FlatList
        contentContainerStyle={{backgroundColor: "#f9f9f9"}}
        data={data.line_items}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        ItemSeparatorComponent={_itemSeperator}
        //    ListHeaderComponent={_listHeader}
        ListFooterComponent={_listFooter}
      />
      <ProgressDialog loading={loading} />
      <Modal
        isVisible={showRefund}
        style={{margin: 0}}
        onBackButtonPress={closeModal}
        onBackdropPress={closeModal}
        useNativeDriver
        hideModalContentWhileAnimating>
        <View
          style={{
            backgroundColor: "#fff",
            marginHorizontal: 16,
            padding: 16,
            borderRadius: 4,
          }}>
          <Text style={{fontWeight: "600"}}>Refund Request</Text>
          <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
            <Text>Request Mode*</Text>
            <CustomPicker
              options={refundReq}
              placeholder={mode}
              getLabel={item => item.name}
              optionTemplate={renderOption}
              fieldTemplate={renderField}
              onValueChange={value => setCount(value)}
            />
          </View>
          {mode == "Partial Refund" && (
            <View>
              <Text style={{fontWeight: "600"}}>Refund by Item(s)</Text>
              <View style={{flexDirection: "row"}}>
                <Text style={{flex: 1, fontWeight: "600"}}>Item</Text>
                <Text style={{flex: 1, fontWeight: "600"}}>Cost</Text>
                <Text style={{flex: 1, fontWeight: "600"}}>Qty</Text>
                <Text style={{flex: 1, fontWeight: "600"}}>Total</Text>
                <Text style={{flex: 1, fontWeight: "600"}}>2.5% CGST</Text>
                <Text style={{flex: 1, fontWeight: "600"}}>2.5% SGST</Text>
              </View>
              {!isEmpty(refundData) &&
                refundData.map((item, index) => {
                  console.log(item);
                  return (
                    <View key={item.item_id + "Sap"}>
                      <View style={{flexDirection: "row"}}>
                        <Text style={{flex: 1}} />
                        <Text style={{flex: 1, paddingStart: 2}} />
                        <Text style={{flex: 1, paddingStart: 2}}>
                          {data.line_items[index].quantity}
                        </Text>
                        <Text style={{flex: 1, paddingStart: 2}}>
                          {data.currency_symbol + "" + data.line_items[index].subtotal}
                        </Text>
                        <Text style={{flex: 1, paddingStart: 2}}>
                          {data.currency_symbol + "" + data.line_items[index].total_tax}
                        </Text>
                        <Text style={{flex: 1, paddingStart: 2}}>
                          {data.currency_symbol + "" + data.line_items[index].subtotal_tax}
                        </Text>
                      </View>
                      <View style={{flexDirection: "row"}}>
                        <Text style={{flex: 1}}>{item.name}</Text>
                        <Text style={{flex: 1, paddingStart: 2}}>
                          {data.currency_symbol + "" + item.price}
                        </Text>
                        <View style={{flex: 1, paddingStart: 2}}>
                          <CustomPicker
                            options={item.qty}
                            placeholder={item.quantity}
                            getLabel={item => item.name}
                            optionTemplate={renderOption}
                            fieldTemplate={renderFieldQTY}
                            onValueChange={value => setQuantity(value, index)}
                          />
                        </View>
                        {/* <Text style={{flex: 1, paddingStart: 2}}>{item.quantity}</Text> */}
                        {/* <Text style={{flex: 1, paddingStart: 2}}>
                          {data.currency_symbol + "" + item.subtotal}
                        </Text> */}
                        <View style={{flex: 1, paddingStart: 2, marginTop: -14}}>
                          <TextInput
                            style={{fontSize: 16}}
                            keyboardType="numeric"
                            value={item.subtotal}
                            onChangeText={onChangeRefundData("subtotal", index)}
                          />
                        </View>
                        <View style={{flex: 1, paddingStart: 2, marginTop: -14}}>
                          <TextInput
                            style={{fontSize: 16}}
                            keyboardType="numeric"
                            value={item.total_tax}
                            onChangeText={onChangeRefundData("total_tax", index)}
                          />
                        </View>
                        <View style={{flex: 1, paddingStart: 2, marginTop: -14}}>
                          <TextInput
                            style={{fontSize: 16}}
                            keyboardType="numeric"
                            value={item.subtotal_tax}
                            onChangeText={onChangeRefundData("subtotal_tax", index)}
                          />
                        </View>
                        {/* <Text style={{flex: 1, paddingStart: 2}}>
                          {data.currency_symbol + "" + item.total_tax}
                        </Text>
                        <Text style={{flex: 1, paddingStart: 2}}>
                          {data.currency_symbol + "" + item.subtotal_tax}
                        </Text> */}
                      </View>
                    </View>
                  );
                })}
            </View>
          )}
          <Text style={{fontWeight: "600"}}>Refund Requests Reason*</Text>
          <TextInput
            style={{borderRadius: 4, borderWidth: 1, borderColor: "#000", marginTop: 4}}
            value={refReqReason}
            onChangeText={onChangeReason}
          />
          <Button
            style={{
              backgroundColor: "#000",
              borderRadius: 4,
              padding: 8,
              alignSelf: "flex-end",
              marginTop: 8,
            }}
            onPress={_returnAndRefund}>
            <Text style={{color: "#fff"}}>SUBMIT</Text>
          </Button>
        </View>
      </Modal>
    </View>
  );
}

OrderDetails.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#757575",
  },
  footerSummaryView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  line: {
    height: 8,
    backgroundColor: "#d2d2d2",
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
  },
  heading: {fontWeight: "600", marginBottom: 10},
  billingtxt: {
    color: "#757575",
    fontWeight: "500",
  },
  card: {
    // elevation: 3,
    shadowRadius: 2,
    padding: 10,
    marginHorizontal: 16,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    //backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#adadad",
    borderWidth: 1,
  },
  txt: {
    fontSize: 14,
    color: "#757575",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: -20,
    marginStart: -10,
  },
  text: {
    fontSize: 14,
  },
  optionContainer: {
    marginHorizontal: 16,
    padding: 10,
    borderBottomColor: "#EDEBF2",
    borderBottomWidth: 1,
  },
  container: {
    borderBottomColor: "grey",
    borderWidth: 1,
    padding: 4,
    paddingBottom: 10,
    borderRadius: 4,
  },
  containerQTY: {},
});

export default OrderDetails;
