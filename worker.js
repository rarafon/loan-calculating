onmessage = function(e) {
	if (e.data) {
		var data = e.data;
		console.log("received a message: ",data);

		var balance = data.balance,
			rate = data.rate,
			months = data.months;
			payment = data.payment

		//console.log(balance, rate, months, payment);
		if (payment == 0) {
			var guess = calculatePayment(balance, rate, months);
			postMessage(guess);
		} else if (months == 0) {
			var guess = calculateMonths(balance, rate, payment);
		}

		postMessage(guess);
	} else {
		postMessage("I didn't get an object.");
	}

};

function calculatePayment(balance, rate, months) {
  /** 
   * uses bisect method to figure out min payment to pay off credit 
   * in that amount of time.
   *
   * Returns the min payment amount
  */
  	balance = parseFloat(balance);
  	rate = parseFloat(rate) / 12;
  	months = parseFloat(months);

	var counter = 0,
		newBal = balance,
		upLimit = Math.pow(1 + rate, months) * balance / months,
		lowLimit = balance / months,
		guess,
		limit = -0.1; // accepting limit of the bisect method (in $ amount)

	while ( newBal > 0 || newBal < limit  ) {
		if (counter++ > 100) {
			console.log("Something was wrong");
			break;
		}
		newBal = balance;
		guess = (upLimit + lowLimit) / 2;
		for (var i = 0; i < months; i++) {
			newBal = newBal * (1 + rate) - guess;
		}

		if (newBal > 0) { // newBal is amount left over after X months
			lowLimit = guess;
		} else {
			upLimit = guess;
		}

		// console.log("guess " + guess + " newBal: " + newBal + " lowLimit: " + lowLimit + " upLimit: "+ upLimit)

	}

	return Math.ceil(guess * 100) / 100;
}

function calculateMonths(balance, rate, payment) {
	var newBalance = balance,
		months = 0,
		rate = rate / 12;

	while (newBalance > 0) {
		months++;
		newBalance = newBalance * (1 + rate) - payment;
		if (months >= 1000) {
			console.log("Error: too many calculations in months from worker");
			break;
		}
	}

	return months
}