#!/usr/bin/env node

// Generated by CoffeeScript 1.8.0
var Q, buildBatchRequests, dumpProperties, fs, language, limit, offset, parseWikidataResponses, qreq, total, wikidataGetEntities, writeMissingLangProp, writeOutputs, writeProps, _, _ref,
  __slice = [].slice;

_ref = process.argv.slice(2), language = _ref[0], total = _ref[1], offset = _ref[2];

total || (total = 1700);

limit = 50;

offset || (offset = 0);

Q = require('q');

qreq = require('qreq');

fs = require('fs');

_ = require('./utils');

dumpProperties = function() {
  var requests;
  requests = buildBatchRequests();
  _.log(requests, 'requests');
  return Q.all(requests).fail(function(err) {
    return _.logRed(err, 'err buildBatchRequests');
  }).spread(parseWikidataResponses).fail(function(err) {
    return _.logRed(err, 'err parseWikidataResponses');
  }).then(writeOutputs).fail(function(err) {
    return _.logRed(err, 'err parseWikidataResponses');
  });
};

parseWikidataResponses = function() {
  var args, missing, missingLang, result;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  result = {};
  missing = [];
  missingLang = [];
  args.forEach(function(resp) {
    var enProp, entity, id, _ref1, _ref2, _ref3, _results;
    if (resp.body.warning != null) {
      _.logRed(resp.body.warning);
    }
    if (resp.body.entities != null) {
      _ref1 = resp.body.entities;
      _results = [];
      for (id in _ref1) {
        entity = _ref1[id];
        if (id[0] === '-') {
          _results.push(missing.push(entity.id));
        } else {
          if ((entity.labels != null) && (((_ref2 = entity.labels) != null ? _ref2[language] : void 0) != null)) {
            _results.push(result[id] = entity.labels[language].value);
          } else {
            enProp = (_ref3 = entity.labels) != null ? _ref3.en.value : void 0;
            if (enProp != null) {
              missingLang.push([entity.id, enProp]);
              _results.push(result[id] = enProp);
            } else {
              _results.push(missing.push(entity.id));
            }
          }
        }
      }
      return _results;
    }
  });
  return [result, missing, missingLang];
};

buildBatchRequests = function() {
  var from, requests, to, _i, _results;
  requests = [];
  from = 1 + offset;
  to = Math.ceil(total / limit);
  (function() {
    _results = [];
    for (var _i = from; from <= to ? _i <= to : _i >= to; from <= to ? _i++ : _i--){ _results.push(_i); }
    return _results;
  }).apply(this).forEach(function(n) {
    var ids, _i, _ref1, _ref2, _results;
    ids = (function() {
      _results = [];
      for (var _i = _ref1 = n * limit - (limit - 1), _ref2 = n * limit; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; _ref1 <= _ref2 ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).map(function(el) {
      return 'P' + el;
    });
    return requests.push(wikidataGetEntities(ids));
  });
  return requests;
};

wikidataGetEntities = function(ids, props, format) {
  var languages, pipedIds, pipedLanguages, pipedProps, query;
  if (props == null) {
    props = ['labels'];
  }
  if (format == null) {
    format = 'json';
  }
  languages = ['en'];
  if (language !== 'en') {
    languages.push(language);
  }
  pipedIds = ids.join('|');
  pipedLanguages = languages.join('|');
  pipedProps = props.join('|');
  _.logBlue(query = "https://www.wikidata.org/w/api.php?action=wbgetentities&languages=" + pipedLanguages + "&format=" + format + "&props=" + pipedProps + "&ids=" + pipedIds, 'query');
  return qreq.get(query);
};

writeOutputs = function(outputs) {
  var missing, missingLang, result;
  result = outputs[0], missing = outputs[1], missingLang = outputs[2];
  writeProps(result, missing);
  return writeMissingLangProp(missingLang);
};

writeProps = function(result, missing) {
  var json;
  _.log(result, 'result');
  _.log(missing, 'missing');
  json = JSON.stringify({
    properties: result,
    missing: missing
  }, null, 4);
  if (offset > 0) {
    return fs.writeFileSync("./properties-" + language + "-" + from + "-" + to + ".json", json);
  } else {
    return fs.writeFileSync("./outputs/properties-" + language + ".json", json);
  }
};

writeMissingLangProp = function(missingLang) {
  var jsonLang;
  _.log(missingLang, 'missingLang');
  jsonLang = JSON.stringify({
    language: language,
    missing: missingLang
  }, null, 4);
  fs.writeFileSync("./outputs/missingLangProp-" + language + ".json", jsonLang);
  return _.logGreen('done!');
};

dumpProperties();