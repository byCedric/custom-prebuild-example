const XML = require('@expo/config-plugins/build/utils/XML');

module.exports = {
  parseXml: XML.parseXMLAsync,
  stringifyXml: XML.format,
};
