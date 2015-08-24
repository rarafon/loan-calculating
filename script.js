function init() {
	}

	function onSubmit(e) {
		var bal = document.getElementById("balanceInput").value;
		var rate = document.getElementById("rateInput").value;
		var months = document.getElementById("monthsInput").value;

		p.dataIn(bal, rate, months);
		p.calculatePayment();
		waitForWorker();

		function waitForWorker() {
			if (p.payment > 0) {
				p.paymentObj = p.makePaymentObj();
				p.displayInfo();
				p.stor.storeP();

				makeTable(p.paymentObj);
			} else {
				window.setTimeout(waitForWorker, 50);
			}
		}

	}

	var submit = document.getElementById("submit");
	submit.addEventListener("click", onSubmit);
	submit = null;

}

window.onload = init;
init = null;

Storage.prototype.setObject = function(key, value) {
	this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
	var value = this.getItem(key);
	return JSON.parse(value);
};

Storage.prototype.deleteObject = function(key) {
	this.removeItem(key);
}