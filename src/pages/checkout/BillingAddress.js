import React, {useState, useEffect, useCallback} from "react";
import {View, StyleSheet, ScrollView, Switch} from "react-native";
import {Text, FloatingTextinput, CustomTextInputAddress} from "components";
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {CustomPicker} from "react-native-custom-picker";
import {useNavigation} from "react-navigation-hooks";
import {updateBilling} from "store/actions";

function BillingAddresss({}) {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const user = useSelector(state => state.user);
  const dispatchAction = useDispatch();
  const appSettings = useSelector(state => state.appSettings);

  useEffect(() => {
    let arr = [];
    for (let i in appSettings.countries) arr.push({id: i, name: appSettings.countries[i]});
    console.log(arr);
    setCountry(arr);
  }, []);

  const [firstname, setFirstname] = useState(user.billing.first_name);
  const [lastname, setLastname] = useState(user.billing.last_name);
  const [email, setEmail] = useState(user.billing.email);
  const [phone, setPhone] = useState(user.billing.phone);
  const [city, setCity] = useState(user.billing.city);
  const [postcode, setPostcode] = useState(user.billing.postcode);
  const [address1, setAddress1] = useState(user.billing.address_1);
  const [address2, setAddress2] = useState(user.billing.address_2);
  const [counrtyy, setCountryy] = useState(user.billing.country);
  const [state, setState] = useState(user.billing.state);

  const [country, setCountry] = useState([]);

  const [stateData, setStateData] = useState([]);

  const onChangeFirstname = useCallback(text => {
    setFirstname(text);
    dispatchAction(updateBilling({...user.billing, first_name: text}));
  });
  const onChangeLastname = useCallback(text => {
    setLastname(text);
    dispatchAction(updateBilling({...user.billing, last_name: text}));
  });
  const onChangeEmail = useCallback(text => {
    setEmail(text);
    dispatchAction(updateBilling({...user.billing, email: text}));
  });
  const onChangePhone = useCallback(text => {
    setPhone(text);
    dispatchAction(updateBilling({...user.billing, phone: text}));
  });
  const onChangeCity = useCallback(text => {
    setCity(text);
    dispatchAction(updateBilling({...user.billing, city: text}));
  });
  const onChangePostcode = useCallback(text => {
    setPostcode(text);
    dispatchAction(updateBilling({...user.billing, postcode: text}));
  });
  const onChangeAddress1 = useCallback(text => {
    setAddress1(text);
    dispatchAction(updateBilling({...user.billing, address_1: text}));
  });
  const onChangeAddress2 = useCallback(text => {
    setAddress2(text);
    dispatchAction(updateBilling({...user.billing, address_2: text}));
  });

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
    setCountryy(text.name);
    dispatchAction(updateBilling({...user.billing, country: text.id}));
    let arr = [];
    let obj = appSettings.county_states[text.id];
    for (let i in obj) arr.push({id: i, name: obj[i]});
    setStateData(arr);
  };

  const setStateD = text => {
    setState(text.name);
    dispatchAction(updateBilling({...user.billing, state: text.id}));
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{paddingHorizontal: 16}}>
        <CustomTextInputAddress
          textColor={{color: appSettings.accent_color}}
          label={t("FIRST_NAME")}
          value={firstname}
          onChangeText={onChangeFirstname}
        />

        <CustomTextInputAddress
          viewstyle={{marginTop: 24}}
          textColor={{color: appSettings.accent_color}}
          label={t("LAST_NAME")}
          value={lastname}
          onChangeText={onChangeLastname}
        />

        <CustomTextInputAddress
          viewstyle={{marginTop: 24}}
          textColor={{color: appSettings.accent_color}}
          label={t("EMAIL")}
          value={email}
          onChangeText={onChangeEmail}
        />

        <CustomTextInputAddress
          viewstyle={{marginTop: 24}}
          textColor={{color: appSettings.accent_color}}
          label={t("PHONE_NUMBER")}
          value={phone}
          onChangeText={onChangePhone}
        />

        <>
          <Text style={{fontSize: 12, color: appSettings.accent_color, marginTop: 24}}>
            Country
          </Text>
          <CustomPicker
            options={country}
            placeholder={counrtyy}
            getLabel={item => item.name}
            optionTemplate={renderOption}
            fieldTemplate={renderField}
            onValueChange={value => setCount(value)}
          />
        </>
        <>
          <Text style={{fontSize: 12, color: appSettings.accent_color, marginTop: 24}}>
            {t("STATE")}
          </Text>
          <CustomPicker
            options={stateData}
            placeholder={state}
            getLabel={item => item.name}
            optionTemplate={renderOption}
            fieldTemplate={renderField}
            onValueChange={value => setStateD(value)}
          />
        </>

        <CustomTextInputAddress
          viewstyle={{marginTop: 24}}
          textColor={{color: appSettings.accent_color}}
          label={t("CITY")}
          value={city}
          onChangeText={onChangeCity}
        />

        <CustomTextInputAddress
          viewstyle={{marginTop: 24}}
          textColor={{color: appSettings.accent_color}}
          label={t("POSTCODE")}
          value={postcode}
          onChangeText={onChangePostcode}
        />

        <CustomTextInputAddress
          viewstyle={{marginTop: 24}}
          textColor={{color: appSettings.accent_color}}
          label={t("ADDRESS_1")}
          value={address1}
          onChangeText={onChangeAddress1}
        />

        <CustomTextInputAddress
          viewstyle={{marginTop: 24}}
          textColor={{color: appSettings.accent_color}}
          label={t("ADDRESS_2")}
          value={address2}
          onChangeText={onChangeAddress2}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  footer: {
    width: "100%",
    borderTopColor: "#dedede",
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
    height: 40,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BillingAddresss;
