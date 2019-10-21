import t from 'tcomb-form-native';
import { StyleSheet } from 'react-native';

const Form = t.form.Form;

export const commonStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent'
  },
  container: {
    flex: 1,
    padding: 20
  },
  header: {
    height: 70,
    paddingTop: 25,
    elevation: 0,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#afafc7',
    backgroundColor: 'transparent'
  },
  txtBlue: {
    color: '#5f7daf'
  },
  lightBtn: {
    backgroundColor: '#afafc7'
  },
  darkBtn: {
    backgroundColor: '#5f7daf'
  },
  marginTopSm: {
    marginTop: 10
  },
  marginTopMd: {
    marginTop: 20
  },
  rightTextBtn: {
    fontSize: 50,
    paddingRight: 10
  },
  textCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export const formStyles = {
  ...Form.stylesheet,
  controlLabel: {
    normal: {
      marginBottom: 5,
      fontSize: 16,
      color: '#5f7daf'
    },
    error: {
      marginBottom: 5,
      fontSize: 16,
      color: '#5f7daf'
    }
  },
  errorBlock: {
    fontSize: 14,
    color: '#e64398'
  },
  helpBlock: {
    normal: {
      ...Form.stylesheet.helpBlock.normal,
      fontSize: 14,
      color: '#7d7d7d'
    },
    error: {
      ...Form.stylesheet.helpBlock.error,
      fontSize: 14,
      color: '#7d7d7d'
    }
  },
  textbox: {
    normal: {
      ...Form.stylesheet.textbox.normal,
      borderColor: '#5f7daf'
    },
    error: {
      ...Form.stylesheet.textbox.error,
      borderColor: '#e64398'
    }
  }
};
