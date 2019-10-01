function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  expr = expr.replace(/ /g, "");

  if (expr.split("(").length != expr.split(")").length) {
    throw new Error("ExpressionError: Brackets must be paired");
  }

  if (expr.indexOf("(") != -1) {
    openBrackets(expr);
  } else {
    return parse(expr);
  }

  function openBrackets(str) {
    let open, close;

    str.split("").forEach((el, i) => {
      if (el == "(" && !close) {
        open = i;
      }

      if (el == ")" && !close) {
        close = i;
      }
    });

    let substring = str.slice(open + 1, close);
    let res = parse(substring);
    let newStr = "";

    newStr = str.slice(0, open) + res + str.slice(close + 1);

    if (newStr.indexOf("(") != -1) {
      openBrackets(newStr);
    } else {
      return parse(newStr);
    }
  }

  function parse(str) {
    let arrNumber = [];
    let arrOperators = [];
    let buffer = "";
    let prevOp = false;

    let arr = str.split("");
    arr.forEach((el, i) => {
      if (i == 0 && el == "-") {
        buffer += el;
      } else if (isNumeric(el) || el == ".") {
        buffer += el;
        prevOp = false;
      } else {
        if (prevOp == true && el == "-" && isNumeric(arr[i + 1])) {
          buffer += el;
          prevOp = false;
        } else {
          if (buffer.length > 0) {
            arrNumber.push(Number(buffer));
          }
          buffer = "";
          arrOperators.push(el);
          prevOp = true;
        }
      }
    });

    if (buffer.length > 0) {
      arrNumber.push(Number(buffer));
    }

    let prior = {
      "+": 1,
      "-": 1,
      "*": 2,
      "/": 2
    };
    let cnt = 0;
    let result = 0;

    while (arrNumber.length > 0 && arrOperators.length > 0) {
      if (arrOperators[cnt + 1] == undefined) {
        result = calculate(
          arrNumber[cnt],
          arrNumber[cnt + 1],
          arrOperators[cnt]
        );
        arrOperators.pop();
        arrNumber.splice(cnt, 2, result);
        cnt = 0;
        continue;
      }

      if (prior[arrOperators[cnt]] >= prior[arrOperators[cnt + 1]]) {
        result = calculate(
          arrNumber[cnt],
          arrNumber[cnt + 1],
          arrOperators[cnt]
        );
        arrOperators.splice(cnt, 1);
        arrNumber.splice(cnt, 2, result);
        cnt = 0;
      } else {
        cnt++;
      }
    }

    return Number(result.toFixed(4));
  }

  function calculate(x, y, op) {
    if (op == "/" && y == "0") {
      throw new Error("TypeError: Devision by zero.");
    }

    switch (op) {
      case "*":
        return x * y;
      case "/":
        return x / y;
      case "+":
        return x + y;
      case "-":
        return x - y;
    }
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}

module.exports = {
  expressionCalculator
};
