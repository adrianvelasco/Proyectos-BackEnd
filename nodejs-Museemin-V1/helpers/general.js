const { isAlpha, isEmpty } = require('validator');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const defaultTypes = require(`./scalarTypes.js`);
const MODELS = require('../models');

const MESSAGES_VALID_DATA = {
  repeated: 'Valor repetido',
  invalid: 'Valor invalido',
  exist: 'El valor no existe',
  deleted: 'El valor fue eliminado',
};

const errorResponse = ({ name, message, type }) => {
  if (type === 'required' && !message) {
    return {
      name,
      message: 'Este campo es requerido.',
    };
  }

  if (type === 'empty' && !message) {
    return {
      name,
      message: 'Este campo no pude ser vacio.',
    };
  }

  return { name, message };
};

const formatError = (message = 'Error no espicifado.', name = null, fieldsTmp = []) => {
  const paths =
    fieldsTmp.count > 0 ? fieldsTmp.reduce((paths = [], el) => [...paths, el.name], []) : [name];
  const fields = fieldsTmp.count > 0 ? fieldsTmp : [{ name, message }];
  return { fields, paths };
};

const objectFilter = (props, filter = [undefined, null, 'undefined', 'null']) => {
  let obj = {};
  Object.keys(props).forEach(key => {
    !filter.includes(props[key]) && (obj = { ...obj, [key]: props[key] });
  });
  return obj;
};

const checkEmptyOrRequired = (fields, inputs) => {
  const response = { isValid: false, fields: [], paths: [] };
  const fieldError = [];

  Object.keys(fields).forEach(field => {
    if (
      !response.paths.includes(field) &&
      !fields[field].empty &&
      isEmpty(`${inputs[field]}`.trim(), { ignore_whitespace: true })
    ) {
      response.fields = [...response.fields, errorResponse({ name: field, type: 'empty' })];
      response.paths = [...response.paths, field];
    }
    if (!response.paths.includes(field) && fields[field].isArray) {
      inputs[field].forEach(interInputs => {
        Object.keys(fields[field]['fields']).forEach(interField => {
          if (
            !response.paths.includes(`${field}-${interField}`) &&
            !fields[field]['fields'][interField].empty &&
            isEmpty(`${interInputs[interField]}`.trim(), { ignore_whitespace: true })
          ) {
            response.fields = [
              ...response.fields,
              errorResponse({ name: interField, type: 'empty' }),
            ];
            response.paths = [...response.paths, field];
          }
        });
      });
    }
  });

  return response;
};

const validData = (
  { name, value, data, prop = 'id', valueType = 1, inData, valueData, validIn = true, ...extra },
  errors
) => {
  if (valueType === 1 && isNaN(value)) {
    return [...errors, { name, value, message: MESSAGES_VALID_DATA.invalid, ...extra }];
  }
  if (valueType === 2 && value === '') {
    return [...errors, { name, value, message: MESSAGES_VALID_DATA.invalid, ...extra }];
  }
  let finded = null;

  if (valueType === 1)
    finded = inData
      ? data.find(
          tmp =>
            parseInt(tmp[prop]) === parseInt(value) && parseInt(tmp[inData]) === parseInt(valueData)
        )
      : data.find(tmp => parseInt(tmp[prop]) === parseInt(value));
  if (valueType === 2)
    finded = inData
      ? data.find(
          tmp =>
            tmp[prop].toUpperCase().trim() === value.toUpperCase().trim() &&
            parseInt(tmp[inData]) === parseInt(valueData)
        )
      : data.find(tmp => tmp[prop].toUpperCase().trim() === value.toUpperCase().trim());

  if (!validIn && finded) {
    return [...errors, { name, value, message: MESSAGES_VALID_DATA.repeated, ...extra }];
  }
  if (validIn && !finded) {
    return [...errors, { name, value, message: MESSAGES_VALID_DATA.exist, ...extra }];
  }
  return errors;
};

const validDataV2 = (
  { name, value, data, prop = 'id', valueType = 1, inData, valueData, validIn = true, ...extra },
  errors
) => {
  if (valueType === 1 && isNaN(value)) {
    return [...errors, { name, value, message: MESSAGES_VALID_DATA.invalid, ...extra }];
  }
  if (valueType === 2 && value === '') {
    return [...errors, { name, value, message: MESSAGES_VALID_DATA.invalid, ...extra }];
  }
  let finded = null;
  return errors;
};

const requireTypes = () => {
  const TYPES = fs
    .readdirSync(`${__dirname}/../controllers`)
    .reduce((newString = defaultTypes, file) => {
      if (file.indexOf('.') !== 0 && file !== 'index.js') {
        const pathFile = path.resolve(`${__dirname}/../controllers/${file}/types.js`);
        const tmp = fs.existsSync(pathFile) ? require(`./../controllers/${file}/types.js`) : '';
        newString = `${newString}${tmp}`;
      }
      return newString;
    }, defaultTypes);
  return TYPES;
};

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const Base64 = {
  btoa: (input = '') => {
    let str = input;
    let output = '';

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = '='), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },
  atob: (input = '') => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};

const sortByType = (rows, key, type, direction) => {
  switch (type) {
    case 'text':
      rows.sort((a, b) => {
        if (a[key] > b[key]) {
          return 1;
        }
        if (a[key] < b[key]) {
          return -1;
        }
        return 0;
      });
      break;
    case 'date':
    case 'number':
      rows.sort((a, b) => {
        return b[key] - a[key];
      });
      break;
    default:
      break;
  }
  if (direction === 'desc') rows.reverse();
  return rows;
};

const orderFormat = (order = ['id', 'desc']) => {
  const direction = order[1];
  const orderFix = order[0].includes(' ')
    ? order[0].includes(' && ')
      ? order[0].split(' && ').reduce((principal, tmp) => {
          const keys = tmp.split(' ');
          const lastKey = parseInt(keys.length) - 1;
          const result = keys.reduce((field, key, i) => {
            if (parseInt(i) !== lastKey) {
              return [...field, { model: MODELS[key] }];
            }
            return [...field, key, direction];
          }, []);
          return [...principal, result];
        }, [])
      : order[0].split(' ').reduce((field, key, i, array) => {
          if (parseInt(i) !== parseInt(array.length) - 1) {
            return [...field, { model: MODELS[key] }];
          }
          return [[...field, key, direction]];
        }, [])
    : [order];
  return orderFix;
};

const round = (number, pos = 2) => {
  var f = Math.pow(10, pos);
  return Math.round(number * f) / f;
};

const getWithoutTaxes = (value, iva = 16, decimals = 2) =>
  round(parseFloat(value) / (1 + parseFloat(parseInt(iva) / 100)), decimals);

module.exports = {
  formatError,
  objectFilter,
  checkEmptyOrRequired,
  validData,
  MESSAGES_VALID_DATA,
  requireTypes,
  Base64,
  sortByType,
  orderFormat,
  round,
  getWithoutTaxes,
};
