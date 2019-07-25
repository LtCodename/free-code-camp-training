function checkCashRegister(price, cash, cid) {
  var change;
  let copyCID = cid.map(elem => [...elem]);//Новый массив моей кассы
  let answer = [];

  const MONEY_LIB = [
    {
      name: "ONE HUNDRED",
      value: 100
    },{
      name: "TWENTY",
      value: 20
    },{
      name: "TEN",
      value: 10
    },{
      name: "FIVE",
      value: 5
    },{
      name: "ONE",
      value: 1
    },{
      name: "QUARTER",
      value: 0.25
    },{
      name: "DIME",
      value:  0.1
    },{
      name: "NICKEL",
      value: 0.05
    },{
      name: "PENNY",
      value: 0.01
    }
  ];

  let difference = cash - price;//Сдача

  let IN_MY_CID;//Сколько в кассе денег вообще

  function calculateCid() {
    IN_MY_CID = 0;
    copyCID.forEach(elem => {
      IN_MY_CID = Math.round((IN_MY_CID + elem[1]) * 1e12) / 1e12;
    })
    return IN_MY_CID;
  }

  calculateCid();
  if (difference > IN_MY_CID) {//Сумма денег в кассе меньше чем величина сдачи
    return  {status: "INSUFFICIENT_FUNDS", change: []};
  }

  console.log("change: " + difference);
  console.log("$ in cash register: " + calculateCid());

  let availableMoney = {};
  let availableInCid = [];

  try {
    availableMoney = magic();
  }catch(e) {
    return e;
  }

  function magic() {
    //return;
    let maxAvailableCurrency = MONEY_LIB.find(elem => {//Найдем какой купюрой я могу начать выдавать сдачу
      if (elem.value <= difference) {
        availableInCid = copyCID.find(elem2 => {
          if (elem2[0] == elem.name && elem2[1] > 0) {
            return elem2;
          }
        });
        if (availableInCid) {
          return elem;
        }
      }
    });

    if (maxAvailableCurrency) {//Если мы МОЖЕМ выдать какой-то купюрой и их есть больше нуля
      let weNeed = Math.floor(difference / maxAvailableCurrency.value);
      let weHave = availableInCid[1] / maxAvailableCurrency.value;
      console.log("we need banknotes of " + maxAvailableCurrency.name + ": " + weNeed);//Нам нужно вот столько купюр
      console.log("we have banknotes of " + maxAvailableCurrency.name + ": " + weHave);//У нас в кассе есть только вот столько

      if (weNeed > weHave) {
        //Забираем деньги из нашей кассы
        weNeed = weHave;
      }

      copyCID.forEach(elem => {
        if (elem[0] == availableInCid[0]) {
          elem[1] = elem[1] - availableInCid[1];
        }
      })

      console.log("changed CID: ")
      console.log(copyCID);

      //Пушим данные в ответ
      answer.push([maxAvailableCurrency.name, maxAvailableCurrency.value * weNeed]);
      console.log("answer is ");
      console.log(answer);

      //Отнимает от сдачи
      difference =  Math.round((difference - maxAvailableCurrency.value * weNeed) * 1e12) / 1e12;
      console.log("change now is " + difference);

      //Пересчитать кассу
      IN_MY_CID = calculateCid();
      console.log("in my CID now: ");
      console.log(IN_MY_CID);

      if (difference != 0 && IN_MY_CID != 0) {
        console.log("doMagicAgain!")
        magic();
      }
    }else {
      //У нас нет купюр для сдачи
      console.log('INSUFFICIENT_FUNDS');
      throw  {status: "INSUFFICIENT_FUNDS", change: []};
    }

    return maxAvailableCurrency;
  }

  if (IN_MY_CID == 0) {
    //console.log([...cid])
    return {status: "CLOSED", change: cid};
  }

  return  {status: "OPEN", change: answer};
}

checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
