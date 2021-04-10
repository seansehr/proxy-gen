/* GET build page. */
// exports.build = {
//   post: function(req, res) {
//     console.log(req.files);
//     res.render('index', { title: 'build' });
//   },
//   get: function(req, res) {
//     res.render('index', { title: 'build' });
//   }
// };
var request = require('request');
exports.get = function(req, res) {
  res.render('index', { title: 'build' });
};

exports.post = function(req, res) {
  // console.log(req.body.decklist);
  // console.log(res);
  var list = req.body.decklist.split("\n"),
      cardList = [];
  list.forEach(function(element, index, array) {
    var placeholder = element.split("|"),
        count = placeholder[0],
        name = placeholder[1],
        manacost = "Mana Cost",
        text = "text";

    if (name) {
      cardList.push({
        'count' : count,
        'name': name,
        'manacost': manacost,
        'text': text,
        'fetched': false
      });
    }
  });
  // console.log(cardList);
  cardList.forEach(function(element, index, array) {
    console.log(element);
    request({url: 'http://api.mtgdb.info/cards/' + element.name, json: true}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var card = body[0];
        if (typeof card !== 'undefined') {
          var type = card.type;
          cardList[index].manacost = card.manaCost;
          cardList[index].text = card.description.replace(/[\n]+/g, '<br><br>');
          cardList[index].type = type;

          if (type == 'Planeswalker') {
            cardList[index].pt = card.loyalty;
            cardList[index].type = type + ' - ' + card.subType;
          }
          else if (type.indexOf("Creature") > -1) {
            cardList[index].pt = card.power + ' / ' + card.toughness;
            cardList[index].type = type + ' - ' + card.subType;
          }
        }
      }
      else {
        console.log(error);
      }
      cardList[index].fetched = true;
      var push = true;
      cardList.forEach(function(element2, index2, array2) {
        if (!element2.fetched) {
          push = false;
        }
      });
      if (push) {
        res.render('list', { cards: cardList });
      }
    });
  });
};

// function buildList (cardList) {
//   cardList.forEach(function(element, index, array) {
//     request({url: 'http://api.mtgdb.info/cards/' + element.name, json: true}, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         // console.log(index);
//         // console.log(cardList.length);
//         console.log(body);
//         cardList[index].manacost = body.manaCost;
//         cardList[index].text = body.description;
//       }
//       else {
//         console.log(error);
//       }
//     });
//     if ((index + 1) == cardList.length) {
//       console.log('last');
//       callback();
//     }
//   });
// }
