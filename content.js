let username;

chrome.storage.sync.get(["username"], function (items) {
	if (items.username == undefined) { // first time user
		let name = prompt('שלום! מה השם שלך? (אני אזכור אותו לעתיד)');
		chrome.storage.sync.set({ "username": name }, function () {
			username = name;
			setButtonHtml()
		});
	} else {
		username = items.username
		setButtonHtml()
	}
});

removeHelper();
function removeHelper() {
	let target = document.getElementsByClassName('intercom-lightweight-app')[0];
	if (!target) {
		setTimeout(() => {
			removeHelper();
		}, 100);
	} else {
		target.remove();
	}
}


// listen for button click with <span>Pickup</span> in it
document.addEventListener('click', function (event) {
	let textarea = document.getElementsByTagName('textarea')[0];
	textarea ? textarea.style.direction = 'rtl' : null;
	textarea ? textarea.style.height = '180px' : null;

	if (event.target.innerText == 'Pickup') {
		textarea.value = `ספק / לקוח: 
לאסוף מ: 
טלפון: 
הזמנת טובין מס׳: 
קרטונים / שקיות: 
תיאור הזמנה: 
הערות: 
השולח: ${username}`
	} else if (event.target.innerText == 'Delivery') {
		textarea.value = `לקוח / ספק: 
שם המקבל: 
טלפון: 
מס' ההזמנה: 
קרטונים / שקיות: 
תיאור הזמנה: 
הערות: 
סוכן מכירות: ${username}`
	}
});

