import { useState, useRef } from "react";
import "./styles/LeasingCalculator.css";
import "./styles/media_adaptation_1024.css";
import "./styles/media_adaptation_768.css";
import "./styles/media_adaptation_320.css";

export default function LeasingCalculator() {
  const carCost = useRef();
  const initialFee = useRef();
  const leaseTerm = useRef();

  const [downPayment, setDownPayment] = useState("");
  const [dealAmount, setDealAmount] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");

  const [isDataSend, setIsDataSend] = useState(true);

  //СТОИМОСТЬ АВТОМОБИЛЯ
  const hadleInputCarCost = (e) => {
    let val = e.target.value.replace(/\s/g, "");
    if (val > 6000000) {
      e.target.value = 6000000;
    }
    carCost.current.value = val;
    document.querySelectorAll(".input-range")[0].value = val;
    calculateDownPayment();
    calcDealAmount();
    calcMonthlyPayment();
  };

  const hadleRangeCarCost = (e) => {
    carCost.current.value = e.target.value;
    document.querySelector(".input-to-calc").value = carCost.current.value;
    document.querySelector(".input-to-calc").value = document
      .querySelector(".input-to-calc")
      .value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    calculateDownPayment();
    calcDealAmount();
    calcMonthlyPayment();
  };

  //ПЕРВОНАЧАЛЬНЫЙ ВЗНОС
  const handleInputInitalFee = (e) => {
    if (e.target.value > 60) {
      e.target.value = 60;
    }
    initialFee.current.value = e.target.value;
    document.querySelectorAll(".input-range")[1].value =
      initialFee.current.value;
    calculateDownPayment();
    calcDealAmount();
    calcMonthlyPayment();
  };
  const handleRangeInitalFee = (e) => {
    initialFee.current.value = e.target.value;
    document.querySelector(".persentage-input").value =
      initialFee.current.value;
    calculateDownPayment();
    calcDealAmount();
    calcMonthlyPayment();
  };

  //СРОК ЛИЗИНГА
  const handleInputLeaseTerm = (e) => {
    if (e.target.value > 60) {
      e.target.value = 60;
    }
    leaseTerm.current.value = e.target.value;
    document.querySelectorAll(".input-range")[2].value =
      leaseTerm.current.value;
    calcDealAmount();
    calcMonthlyPayment();
  };
  const handleRangeLeaseTerm = (e) => {
    leaseTerm.current.value = e.target.value;
    document.querySelectorAll(".input-to-calc")[2].value =
      leaseTerm.current.value;
    calcDealAmount();
    calcMonthlyPayment();
  };

  //РАСЧЕТ ПЕРВОНОЧАЛЬНОГО ВЗНОСА
  const calculateDownPayment = () => {
    let payment = carCost.current.value * (initialFee.current.value / 100);
    setDownPayment(Math.round(payment));
  };

  //СУММА ДОГОВОРА ЛИЗИНГА
  const calcDealAmount = () => {
    let amount = downPayment + leaseTerm.current.value * monthlyPayment;
    setDealAmount(Math.round(amount));
  };

  //ЕЖЕМЕСЯЧНЫЙ ПЛАТЕЖ
  const calcMonthlyPayment = () => {
    const monthPay =
      (carCost.current.value.replace(/\s/g, "") - downPayment) *
      ((0.035 * Math.pow(1 + 0.035, leaseTerm.current.value)) /
        (Math.pow(1 + 0.035, leaseTerm.current.value) - 1));
    setMonthlyPayment(Math.round(monthPay));
  };

  //УЛУЧШИТЬ ОТОБРАЖЕНИЕ ЧИСЕЛ
  const prettifyNumber = (num) => {
    var n = num.toString();
    var separator = " ";
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + separator);
  };

  //УЛУЧШИТЬ ОТОБРАЖЕНИЕ ЧИСЕЛ В ИНПУТАХ
  const prettifyInputNumber = (e) => {
    e.target.value = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  //СТИЛИ ПРИ НАВЕДЕНИИ И БЛЮРЕ
  const changeInputStyle = (e) => {
    const box = e.target.parentNode;
    e.target.style.backgroundColor = "white";
    box.style.backgroundColor = "white";
    box.style.border = "2px solid #F3F3F4";
  };

  const deleteInputStyle = (e) => {
    const box = e.target.parentNode;
    box.style.backgroundColor = "#F3F3F4";
    box.style.border = "none";
    e.target.style.backgroundColor = "#F3F3F4";

    checkInputVal(e);
  };

  //ПРОВЕРИТЬ ЗНАЧЕНИЯ ИНПУТОВ
  const checkInputVal = (e) => {
    //ПРОВЕРКА ЗНАЧЕНИЯ ПЕРВОГО ИНПУТА
    if (
      e.target.value == document.querySelectorAll(".input-to-calc")[0].value
    ) {
      let val = document
        .querySelectorAll(".input-to-calc")[0]
        .value.replace(/\s/g, "");
      if (val < 1000000) {
        e.target.value = "1 000 000";
      }
    }

    //ПРОВЕРКА ЗНАЧЕНИЯ ВТОРОГО ИНПУТА
    if (
      e.target.value == document.querySelectorAll(".input-to-calc")[2].value
    ) {
      let val = document.querySelectorAll(".input-to-calc")[2].value;
      if (val < 1) {
        e.target.value = "1";
      }
    }
  };

  //ПРОВЕРКА ПРОЦЕНТНОГО ИНПУТА
  const checkPersVal = (e) => {
    if (e.target.value < 10) {
      e.target.value = "10";
    }
  };

  //ПОМЕНЯТЬ СТИЛЬ КНОПКИ LOADING
  const loadingButtonStyle = () => {
    const button = document.querySelector(".submit-button");
    button.innerHTML = `<img className='loading-icon' style='width: 30px; filter: invert(100%); margin-top: 10px;' src="https://cdn-icons-png.flaticon.com/512/7021/7021250.png" alt='loading-image' />`;
  };

  const removeLoadingButtonStyle = () => {
    const button = document.querySelector(".submit-button");
    button.innerHTML = `Оставить заявку`;
  };

  //ПОМЕНЯТЬ СТИЛЬ КНОПКИ DISABLED
  const disabledButtonStyle = () => {
    const button = document.querySelector(".submit-button");
    button.disabled = false;
    button.style.cssText =
      "background-color: rgba(255, 149, 20, 0.4); cursor: not-allowed";

    setIsDataSend(false);
  };

  //ОТПРАВКА ДАННЫХ С КАЛЬКУЛЯТОРА
  const sendData = () => {
    if (isDataSend) {
      const data = {
        price: carCost.current.value,
        initial: initialFee.current.value,
        months: leaseTerm.current.value,
        deal: dealAmount,
        monthPay: monthlyPayment,
      };

      fetch("https://server", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      });
    }

    disabledButtonStyle();
  };

  return (
    <div className="container">
      <h1 className="title">Рассчитайте стоимость автомобиля в лизинг</h1>
      <div className="calculations">
        <div className="calc-box">
          <p className="calc-title">Стоимость автомобиля</p>
          <div className="input-box">
            <input
              className="input-to-calc"
              ref={carCost}
              onChange={hadleInputCarCost}
              onKeyUp={prettifyInputNumber}
              onFocus={changeInputStyle}
              onBlur={deleteInputStyle}
            />
            <span className="input-sign">₽</span>
          </div>
          <input
            className="input-range"
            type="range"
            min="1000000"
            max="6000000"
            step="1"
            ref={carCost}
            onChange={hadleRangeCarCost}
            onMouseDown={loadingButtonStyle}
            onMouseOut={removeLoadingButtonStyle}
          />
        </div>
        <div className="calc-box">
          <p className="calc-title">Первоначальный взнос</p>
          <div className="input-box">
            <span className="input-to-calc anti-input">
              {prettifyNumber(downPayment)} ₽
            </span>
            <span className="input-sign persentage">
              <input
                className="persentage-input"
                type="number"
                ref={initialFee}
                onChange={handleInputInitalFee}
                onBlur={checkPersVal}
              />
              <span className="percent-sign">%</span>
            </span>
          </div>
          <input
            className="input-range"
            type="range"
            step="1"
            min="10"
            max="60"
            ref={initialFee}
            onChange={handleRangeInitalFee}
            onMouseDown={loadingButtonStyle}
            onMouseOut={removeLoadingButtonStyle}
          />
        </div>
        <div className="calc-box">
          <p className="calc-title">Срок лизинга</p>
          <div className="input-box">
            <input
              className="input-to-calc"
              type="number"
              ref={leaseTerm}
              onChange={handleInputLeaseTerm}
              onFocus={changeInputStyle}
              onBlur={deleteInputStyle}
            />
            <span className="input-sign">мес.</span>
          </div>
          <input
            className="input-range"
            type="range"
            min="1"
            max="60"
            step="1"
            ref={leaseTerm}
            onChange={handleRangeLeaseTerm}
            onMouseDown={loadingButtonStyle}
            onMouseOut={removeLoadingButtonStyle}
          />
        </div>
      </div>
      <div className="result-box">
        <div className="result">
          <p>Сумма договора лизинга</p>
          <p className="result-number">{prettifyNumber(dealAmount)} ₽</p>
        </div>
        <div className="result">
          <p>Ежемесячный платеж от</p>
          <p className="result-number">{prettifyNumber(monthlyPayment)} ₽</p>
        </div>
        <button className="submit-button" onClick={sendData}>
          Оставить заявку
        </button>
      </div>
    </div>
  );
}
