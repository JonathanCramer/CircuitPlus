let username;
let buttonHtml;

$("head").append(`<style>
#CircuitPlusPopup button {
	background-color: #008CBA;
	border: none;
	color: white;
	padding: 12px 22px;
	outline: none;
	text-align: center;
	text-decoration: none;
	border-radius: 10px;
	font-size: 16px;
	cursor: pointer;
}

#CircuitPlusPopup button:hover {
	background-color: #27a6d0;
}
</style>`)

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
	let target = document.getElementById('beacon-container');
	if (!target) {
		setTimeout(() => {
			removeHelper();
		}, 100);
	} else {
		target.remove();
	}
}

chrome.runtime.onMessage.addListener(message => {
	$("body").append(`<div id="CircuitPlusPopup" style="position: absolute;
	background: #ffffff;
	top: 100px;
	left: 600px;
	z-index: 999;
	padding: 10px;
	border-radius: 15px;
	direction: rtl;
	border: 1px solid black;
	box-shadow: 4px 2px 8px 0px;
}">
	<h3 style="margin-bottom: 5px">בחר נתונים למילוי אוטומטי</h3>
	<input type="checkbox" id="customer_name" data="${message.customer_name}" checked>
	<label style="color: black; margin-left: 17px; margin-right: -4px;">שם ספק/לקוח</label>
	<input type="checkbox" id="receiver_name" data="${message.receiver_name}" checked>
	<label style="color: black; margin-left: 17px; margin-right: -4px;">שם מקבל</label>
	<input type="checkbox" id="phone" data="${message.phone}" checked>
	<label style="color: black; margin-left: 17px; margin-right: -4px;">טלפון</label>
	<input type="checkbox" id="notes" data="${message.notes}" checked>
	<label style="color: black; margin-left: 17px; margin-right: -4px;">הערה קבועה</label>
		<div>
		<input style="margin-top: 15px" type="radio" id="fillAsDelivery" name="deliveryType" value="delivery" checked>
		<label style="color: black;" for="fillAsDelivery">משלוח</label><br>
		<input type="radio" id="fillAsPickup" name="deliveryType" value="pickup">
		<label style="color: black;" for="fillAsPickup">איסוף</label><br>
			<button style="margin-top: 15px" id="fillData">הזן נתונים</button>
		</div>
	</div>`);
	// $(".flex.ct-input__input.ember-text-field.ember-view").val(message.address);
})

// $("body").on("click", "#copyAddress", function (event) {
// 	copyTextToClipboard($(this).attr('data-address'))
// });

$("body").on("click", "#fillData", function (event) {
	console.log('bruh');
	let notesArea = $(".flex-grow.ct-input__input.ct-input__input--textarea.ember-text-area.ember-view").eq(0)
	let customer_name;
	let receiver_name;
	let phone;
	let notes;
	$("#customer_name").is(':checked') ? customer_name = $("#customer_name").attr('data') : customer_name = ''
	$("#receiver_name").is(':checked') ? receiver_name = $("#receiver_name").attr('data') : receiver_name = ''
	$("#phone").is(':checked') ? phone = $("#phone").attr('data') : phone = ''
	$("#notes").is(':checked') ? notes = $("#notes").attr('data') : notes = ''

	if ($("#fillAsDelivery").is(':checked')) {
		notesArea.val(`שם לקוח: ${customer_name}
שם המקבל: ${receiver_name}
טלפון: ${phone}
מס' ההזמנה: 
קרטונים / שקיות: 
תיאור הזמנה: 
הערות: ${notes}
סוכן מכירות: ${username}

-משלוח-`);
	} else if ($("#fillAsPickup").is(':checked')) {
		notesArea.val(`ספק: ${customer_name}
לאסוף מ: ${receiver_name}
טלפון: ${phone}
הזמנת טובין מס׳: 
קרטונים / שקיות: 
תיאור הזמנה: 
הערות: ${notes}
השולח: ${username}

-איסוף-`);
	}
	notesArea.height('168px');
	$("#CircuitPlusPopup").remove();
});

setInterval(() => {
	let notesArea = $(".flex-grow.ct-input__input.ct-input__input--textarea.ember-text-area.ember-view").eq(0)
	notesArea.css('direction', 'rtl');

	try {
		pickupdeliveryswitch = document.getElementsByClassName('ct-form-textarea ember-view')[0];
		if (!$("#myDeliveryPickupSwitch").length) {
			pickupdeliveryswitch.insertAdjacentHTML('afterend', buttonHtml)
		}
		let activeBtn;
		let inActiveBtn;
		if (notesArea.val().includes('-משלוח-')) {
			activeBtn = document.getElementById('deliveryBtn');
			inActiveBtn = document.getElementById('pickupBtn');

		} else if (notesArea.val().includes('-איסוף-')) {
			activeBtn = document.getElementById('pickupBtn');
			inActiveBtn = document.getElementById('deliveryBtn');
		}
		activeBtn.classList.add('md-checked');
		inActiveBtn.classList.remove('md-checked');
	} catch (error) {

	}

}, 100);

$("body").on("click", ".flex.ct-input__input.ember-text-field.ember-view:eq(3)", () => {
	if ($(".flex.ct-input__input.ember-text-field.ember-view:eq(3)").val() === '') {
		$(".flex.ct-input__input.ember-text-field.ember-view:eq(3)").val('+972')
	}
})

function setButtonHtml() {
	buttonHtml = `<div id="myDeliveryPickupSwitch" class="ct-input-group layout-row layout-align-center-center ember-view">  <span id="ember108" class="ct-icon ct-input-group__icon flex-none ember-view">
<!---->  		<svg height="24" width="24px" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
<path d="M 12 0 L 0 3.2 L 0 17.6 L 12 20.8 L 24 17.6 L 24 3.2 L 12 0 Z M 1.596 16.424 L 1.588 5.6 L 11.2 8.163 L 11.2 18.984 L 1.596 16.424 Z M 1.588 4 L 5.594 2.932 L 16 5.706 L 16 5.71 L 12 6.777 L 1.588 4 Z M 22.404 16.424 L 12.8 18.984 L 12.8 8.163 L 16 7.31 L 16 11.21 L 19.2 10.356 L 19.2 6.457 L 22.412 5.6 L 22.404 16.424 Z M 19.2 4.857 L 19.2 4.854 L 8.794 2.078 L 12 1.223 L 22.412 4 L 19.2 4.857 Z" bx:origin="0 -3.076923" fill="#1874ff"/>
</svg>



<!---->

</span>
<div class="ct-input-group__fields flex-grow layout-align-center layout-row">
						<div class="ct-radio flex-grow ember-view"><md-radio-button onclick="let target= document.getElementsByClassName('flex-grow ct-input__input ct-input__input--textarea ember-text-area ember-view')[0]; target.value=\`שם לקוח: 
שם המקבל: 
טלפון: 
מס' ההזמנה: 
קרטונים / שקיות: 
תיאור הזמנה: 
הערות: 
סוכן מכירות: ${username}

-משלוח-\`;
target.style.height='168px';
this.classList.add('md-checked');

let pickupBtn = document.getElementById('pickupBtn');
pickupBtn.classList.remove('md-checked');
" aria-checked="true" role="radio" id="deliveryBtn" class="my-md-default-theme ember-view"><div class="md-container md-ink-ripple">
	<div class="md-off"></div>
	<div class="md-on"></div>
<div class="md-ripple-container"></div></div>
	<div class="md-label">
		<span>
				משלוח

		</span>
	</div>
</md-radio-button></div>
<div class="ct-radio flex-grow ember-view"><md-radio-button onclick="let target= document.getElementsByClassName('flex-grow ct-input__input ct-input__input--textarea ember-text-area ember-view')[0];
target.value=\`ספק:
לאסוף מ:
טלפון:
הזמנת טובין מס׳:
קרטונים / שקיות:
תיאור הזמנה:
הערות:
השולח: ${username}

-איסוף-\`;
this.classList.add('md-checked');

target.style.height='168px';

let deliveryBtn = document.getElementById('deliveryBtn');
deliveryBtn.classList.remove('md-checked');
" aria-checked="false" role="radio" id="pickupBtn" class="my-md-default-theme ember-view"><div class="md-container md-ink-ripple">
	<div class="md-off"></div>
	<div class="md-on"></div>
<div class="md-ripple-container"></div></div>
	<div class="md-label">
		<span>
				איסוף

		</span>
	</div>
</md-radio-button></div>

</div>
</div>`;
}