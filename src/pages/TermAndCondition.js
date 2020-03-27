import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Toolbar, HTMLRender } from "components";
import { ApiClient } from "service";
import { useTranslation } from "react-i18next";

function TermAndCondition() {
  const [terms, setTerms] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    ApiClient.get("terms").then(({ data }) => {
      console.log(data);
      if (data.term_condition != "") {
        setTerms(data.term_condition);
      } else {
        setTerms("Please Set a terms in backend panel");
      }
    });
  }, []);

  return (
    <View>
      <Toolbar backButton title={t("TOS")} />
      <HTMLRender html={terms ? terms : "<div/>"} containerStyle={{ padding: 16 }} />
    </View>
  );
}

export default TermAndCondition;
