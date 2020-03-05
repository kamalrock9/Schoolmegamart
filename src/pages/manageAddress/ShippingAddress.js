import React, {useState, useCallback, useEffect} from "react";
import {View, ScrollView, StyleSheet, Alert, TouchableOpacity} from "react-native";
import {Text, Toolbar, FloatingTextinput, Button} from "components";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {CustomPicker} from "react-native-custom-picker";
import {WooCommerce} from "service";
import {updateShipping} from "../../store/actions";
import Toast from "react-native-simple-toast";

function ShippingAddress() {
  const {t} = useTranslation();
  const user = useSelector(state => state.user);
  const appSettings = useSelector(state => state.appSettings);
  const dispatch = useDispatch();

  useEffect(() => {
    let arr = [];
    for (let i in appSettings.countries) arr.push({id: i, name: appSettings.countries[i]});
    console.log(arr);
    setCountry(arr);
  }, []);

  const [firstname, setFirstname] = useState(user.shipping.first_name);
  const [lastname, setLastname] = useState(user.shipping.last_name);
  const [company, setCompany] = useState(user.shipping.company);
  const [city, setCity] = useState(user.shipping.city);
  const [postcode, setPostcode] = useState(user.shipping.postcode);
  const [address1, setAddress1] = useState(user.shipping.address_1);
  const [address2, setAddress2] = useState(user.shipping.address_2);
  const [counrtyy, setCountryy] = useState(user.shipping.country);
  const [state, setState] = useState(user.shipping.state);

  const [country, setCountry] = useState([]);

  const [stateData, setStateData] = useState([]);

  const onChangeFirstname = useCallback(text => {
    setFirstname(text);
  });
  const onChangeLastname = useCallback(text => {
    setLastname(text);
  });
  const onChangeCompany = useCallback(text => {
    setCompany(text);
  });
  const onChangeCity = useCallback(text => {
    setCity(text);
  });
  const onChangePostcode = useCallback(text => {
    setPostcode(text);
  });
  const onChangeAddress1 = useCallback(text => {
    setAddress1(text);
  });
  const onChangeAddress2 = useCallback(text => {
    setAddress2(text);
  });

  const _UpdateAddress = () => {
    let param = {
      first_name: firstname,
      last_name: lastname,
      company: company,
      city: city,
      state: state,
      postcode: postcode,
      address_1: address1,
      address_2: address2,
      country: counrtyy,
    };
    console.log(param);

    let data = {};
    data.shipping = param;

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (
      firstname == "" &&
      lastname == "" &&
      company == "" &&
      city == "" &&
      state == "" &&
      postcode == "" &&
      address1 == "" &&
      counrtyy == ""
    ) {
      Toast.show("Please fill all the fields");
    } else {
      WooCommerce.post("customers/" + user.id, data).then(res => {
        console.log(res);
        if (res.status == 200) {
          dispatch(updateShipping(param));
        } else {
          Toast.show("Nothing to update", Toast.LONG);
        }
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
          {!selectedItem && <Text style={[styles.text, {color: "grey"}]}>{defaultText}</Text>}
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

    let arr = [];
    let obj = appSettings.county_states[text.id];
    for (let i in obj) arr.push({id: i, name: obj[i]});
    setStateData(arr);
  };

  const setStateD = text => {
    setState(text.name);
  };

  return (
    <>
      <Toolbar backButton title={t("SHIPPING") + " " + t("ADDRESS")} />
      <ScrollView contentContainerStyle={{marginHorizontal: 16, marginTop: 16}}>
        <FloatingTextinput
          label={t("FIRST_NAME")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={firstname}
          onChangeText={onChangeFirstname}
        />
        <FloatingTextinput
          label={t("LAST_NAME")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={lastname}
          onChangeText={onChangeLastname}
        />
        <FloatingTextinput
          label={t("COMPANY")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={company}
          onChangeText={onChangeCompany}
        />

        <FloatingTextinput
          label={t("CITY")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={city}
          onChangeText={onChangeCity}
        />
        <FloatingTextinput
          label={t("POSTCODE")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={postcode}
          onChangeText={onChangePostcode}
        />
        <FloatingTextinput
          label={t("ADDRESS_1")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={address1}
          onChangeText={onChangeAddress1}
        />
        <FloatingTextinput
          label={t("ADDRESS_2")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={address2}
          onChangeText={onChangeAddress2}
        />
        <>
          <Text style={{fontSize: 12, color: appSettings.accent_color, marginTop: 10}}>
            Counrty
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
          <Text style={{fontSize: 12, color: appSettings.accent_color, marginTop: 10}}>State</Text>
          <CustomPicker
            options={stateData}
            placeholder={state}
            getLabel={item => item.name}
            optionTemplate={renderOption}
            fieldTemplate={renderField}
            onValueChange={value => setStateD(value)}
          />
        </>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          style={[styles.footerButton, {backgroundColor: appSettings.accent_color}]}
          onPress={_UpdateAddress}>
          <Text style={{color: "white", marginEnd: 5}}>{t("SAVE")}</Text>
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
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    borderBottomColor: "#EDEBF2",
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

export default ShippingAddress;
