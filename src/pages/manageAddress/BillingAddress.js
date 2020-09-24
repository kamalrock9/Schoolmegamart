import React, {useState, useCallback, useEffect, useReducer} from "react";
import {View, ScrollView, StyleSheet, ActivityIndicator, TextInput} from "react-native";
import {Text, Toolbar, FloatingTextinput, Button, CustomTextInputAddress} from "components";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {CustomPicker} from "react-native-custom-picker";
import {WooCommerce} from "service";
import {updateBilling} from "../../store/actions";
import Toast from "react-native-simple-toast";

function user() {
  return useSelector(state => state.user);
}

const initialState = {
  first_name: "",
  last_name: "",
  company: "",
  email: "",
  phone: "",
  city: "",
  postcode: "",
  address_1: "",
  address_2: "",
  country: "",
  state: "",
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "changeFirstname":
      return {...state, first_name: action.payload};
    case "changeLastname":
      return {...state, last_name: action.payload};
    case "changeCompany":
      return {...state, company: action.payload};
    case "changeEmail":
      return {...state, email: action.payload};
    case "changePhone":
      return {...state, phone: action.payload};
    case "changeCity":
      return {...state, city: action.payload};
    case "changePostcode":
      return {...state, postcode: action.payload};
    case "changeAddress1":
      return {...state, address_1: action.payload};
    case "changeAddress2":
      return {...state, address_2: action.payload};
    case "changeCountry":
      return {...state, country: action.payload};
    case "changeState":
      return {...state, state: action.payload};
    default:
      return state;
  }
}

function BillingAddress() {
  const {t} = useTranslation();
  const user = useSelector(state => state.user);
  const appSettings = useSelector(state => state.appSettings);
  const dispatchAction = useDispatch();

  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, user.billing);

  useEffect(() => {
    let arr = [];
    for (let i in appSettings.countries) arr.push({id: i, name: appSettings.countries[i]});
    setCountry(arr);
  }, []);

  const [allCountry, setCountry] = useState([]);

  const [stateData, setStateData] = useState([]);

  const onChangeFirstname = text => {
    dispatch({type: "changeFirstname", payload: text});
  };
  const onChangeLastname = text => {
    dispatch({type: "changeLastname", payload: text});
  };
  const onChangeCompany = text => {
    dispatch({type: "changeCompany", payload: text});
  };
  const onChangeEmail = text => {
    dispatch({type: "changeEmail", payload: text});
  };
  const onChangePhone = text => {
    dispatch({type: "changePhone", payload: text});
  };
  const onChangeCity = text => {
    dispatch({type: "changeCity", payload: text});
  };
  const onChangePostcode = text => {
    dispatch({type: "changePostcode", payload: text});
  };
  const onChangeAddress1 = text => {
    dispatch({type: "changeAddress1", payload: text});
  };
  const onChangeAddress2 = text => {
    dispatch({type: "changeAddress2", payload: text});
  };
  const onChangeCountry = text => {
    dispatch({type: "changeCountry", payload: text});
  };
  const onChangeState = text => {
    dispatch({type: "changeState", payload: text});
  };

  const _UpdateAddress = () => {
    let param = {
      first_name: state.first_name,
      last_name: state.last_name,
      company: state.company,
      email: state.email,
      phone: state.phone,
      city: state.city,
      state: state.state,
      postcode: state.postcode,
      address_1: state.address_1,
      address_2: state.address_2,
      country: state.country,
    };
    console.log(param);

    let data = {};
    data.billing = param;

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (
      state.first_name == "" &&
      state.last_name == "" &&
      state.company == "" &&
      state.email == "" &&
      state.phone == "" &&
      state.city == "" &&
      state.state == "" &&
      state.postcode == "" &&
      state.address_1 == "" &&
      state.country == ""
    ) {
      Toast.show("Please fill all the fields");
    } else if (!reg.test(state.email)) {
      Toast.show("Your email address is not correct", Toast.LONG);
    } else {
      setLoading(true);
      WooCommerce.post("customers/" + user.id, data)
        .then(res => {
          console.log(res);
          setLoading(false);
          if (res.status == 200) {
            dispatchAction(updateBilling(param));
          } else {
            Toast.show("Nothing to update", Toast.LONG);
          }
        })
        .then(error => {
          setLoading(false);
        });
    }
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
    onChangeCountry(text.name);
    let arr = [];
    let obj = appSettings.county_states[text.id];
    for (let i in obj) arr.push({id: i, name: obj[i]});
    setStateData(arr);
  };

  const setStateD = text => {
    onChangeState(text.name);
  };

  return (
    <>
      <Toolbar backButton title={t("BILLING") + " " + t("ADDRESS")} />
      {loading ? (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{marginHorizontal: 16, marginTop: 16}}>
          <CustomTextInputAddress
            label={"Fisrt Name*"}
            value={state.first_name}
            onChangeText={onChangeFirstname}
          />
          <CustomTextInputAddress
            viewstyle={{marginTop: 24}}
            label={"Last Name*"}
            value={state.last_name}
            onChangeText={onChangeLastname}
          />

          <CustomTextInputAddress
            viewstyle={{marginTop: 24}}
            label={"Company*"}
            value={state.company}
            onChangeText={onChangeCompany}
          />

          <CustomTextInputAddress
            viewstyle={{marginTop: 24}}
            label={"Email*"}
            value={state.email}
            onChangeText={onChangeEmail}
          />

          <CustomTextInputAddress
            viewstyle={{marginTop: 24}}
            label={"Phone Number*"}
            value={state.phone}
            onChangeText={onChangePhone}
          />

          <CustomTextInputAddress
            viewstyle={{marginTop: 24}}
            label={"City*"}
            value={state.city}
            onChangeText={onChangeCity}
          />

          <CustomTextInputAddress
            viewstyle={{marginTop: 24}}
            label={"Postcode*"}
            value={state.postcode}
            onChangeText={onChangePostcode}
          />

          <CustomTextInputAddress
            viewstyle={{marginTop: 24}}
            label={"Address Line 1*"}
            value={state.address_1}
            onChangeText={onChangeAddress1}
          />

          <CustomTextInputAddress
            viewstyle={{marginTop: 24}}
            label={"Address Line 2"}
            value={state.address_2}
            onChangeText={onChangeAddress2}
          />

          {/* <FloatingTextinput
            label={t("FIRST_NAME")}
            labelColor="#000000"
            style={{color: "#000000"}}
            value={state.first_name}
            onChangeText={onChangeFirstname}
          /> */}

          <>
            <Text style={{fontSize: 12, color: "grey", marginTop: 10}}>{t("COUNTRY")}</Text>
            <CustomPicker
              options={allCountry}
              placeholder={state.country}
              getLabel={item => item.name}
              optionTemplate={renderOption}
              fieldTemplate={renderField}
              onValueChange={value => setCount(value)}
            />
          </>
          <View style={{marginBottom: 20}}>
            <Text style={{fontSize: 12, color: "grey", marginTop: 10}}>{t("STATE")}</Text>
            <CustomPicker
              options={stateData}
              placeholder={state.state}
              getLabel={item => item.name}
              optionTemplate={renderOption}
              fieldTemplate={renderField}
              onValueChange={value => setStateD(value)}
            />
          </View>
        </ScrollView>
      )}
      <View style={styles.footer}>
        <Button
          style={[styles.footerButton, {backgroundColor: appSettings.accent_color}]}
          onPress={_UpdateAddress}>
          <Text style={{color: "white", marginEnd: 5, fontWeight: "600"}}>{t("SAVE")}</Text>
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    flexDirection: "row",
  },
  footerButton: {
    flex: 1,
    height: 40,
    //margin: 5,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: -20,
    marginStart: -40,
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
  box: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default BillingAddress;
