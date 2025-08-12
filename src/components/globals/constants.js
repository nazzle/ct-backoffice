import moment from 'moment-mini'

export const genders = ['male', 'female']

export const dateFormatter = (value) => {
  if (!value) {
    return ''
  }else {
    return moment(value).format('DD MMM YYYY')
  }
}

export const removeUnderscore = (str) => {
  if(str){
    return str.replace(/_/g, ' ');
  }
}
