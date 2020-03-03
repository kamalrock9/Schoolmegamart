import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Toolbar, HTMLRender} from '../components';
import {ApiClient} from '../service';

function TermAndCondition() {
  const [terms, setTerms] = useState('');

  useEffect(() => {
    ApiClient.get('terms').then(({data}) => {
      console.log(data);
      if (data.term_condition != '') {
        setTerms(data.term_condition);
      } else {
        setTerms('Please Set a terms in backend panel');
      }
    });
  }, []);

  return (
    <View>
      <Toolbar backButton title="Terms of Condition" />
      <HTMLRender html={terms ? terms : <b></b>} />
    </View>
  );
}

export default TermAndCondition;
