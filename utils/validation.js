import t from 'tcomb-form-native';
import moment from 'moment';

export const REGEX_ID = t.refinement(t.String, (id) => {
  const reg = /^[A-za-z0-9]{6,12}$/;
  return reg.test(id);
});

export const REGEX_PASSWORD = t.refinement(t.String, (password) => {
  const reg = /^.*(?=^.{6,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
  return reg.test(password);
});

export const REGEX_NAME = t.refinement(t.String, (name) => {
  if (name.trim().length < 1 || name.trim().length > 10) {
    return false;
  }
  const reg = /^[가-힣a-zA-Z]+$/;
  return reg.test(name);
});

export const REGEX_PHONE_NUM = t.refinement(t.String, (phoneNumber) => {
  const reg = /^(?:(010\d{4})|(01[1|6|7|8|9]\d{3,4}))(\d{4})$/;
  return reg.test(phoneNumber);
});

export const FORM_CONFIG = {
  id: {
    label: '아이디 *',
    help: '6~12자 영문 대소문자 또는 숫자',
    error: '아이디 형식이 올바르지 않습니다',
    autoCapitalize: 'none'
  },
  password: {
    label: '비밀번호 *',
    help: '6~15자 영문 대소문자, 숫자, 특수문자 조합',
    error: '비밀번호 형식이 올바르지 않습니다',
    password: true,
    secureTextEntry: true,
    autoCapitalize: 'none'
  },
  password_confirm: {
    label: '비밀번호 확인 *',
    error: '비밀번호가 일치하지 않습니다.',
    password: true,
    secureTextEntry: true,
    autoCapitalize: 'none'
  },
  name: {
    label: '이름 *',
    help: '1~10자 한글 또는 영문',
    error: '이름 형식이 올바르지 않습니다.'
  },
  phone_number: {
    label: '핸드폰 번호',
    help: '-없이 숫자만 입력해주세요',
    error: '핸드폰 번호 형식이 올바르지 않습니다.',
    keyboardType: 'phone-pad'
  },
  first_meet_day: {
    mode: 'date',
    label: '처음 만난 날 *',
    maximumDate: moment(new Date()).toDate(),
    config: {
      format: (date) => moment(date).format('YYYY-MM-DD'),
      defaultValueText: null
    }
  },
  birthday: {
    mode: 'date',
    label: '생일',
    maximumDate: moment(new Date()).toDate(),
    config: {
      format: (date) => moment(date).format('YYYY-MM-DD'),
      defaultValueText: null
    }
  }
};
