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
	let target = document.getElementsByClassName('intercom-lightweight-app')[0];
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
	let notesArea = $("#note-0");
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
	let notesArea = $(".Textareastyled__StyledTextarea-sc-1qpgt10-1.dzIBUT").eq(0);
	notesArea.css('direction', 'rtl');

	try {
		pickupdeliveryswitch = document.getElementsByClassName('Textareastyled__StyledTextarea-sc-1qpgt10-1 dzIBUT')[0];
		if (!$("#myDeliveryPickupSwitch").length) {
			pickupdeliveryswitch.parentElement.insertAdjacentHTML('afterend', buttonHtml)
		}
		let activeBtn;
		let inActiveBtn;
		if (notesArea.val().includes('-משלוח-')) {
			activeBtn = $('#deliveryBtn');
			inActiveBtn = $('#pickupBtn');

		} else if (notesArea.val().includes('-איסוף-')) {
			activeBtn = $('#pickupBtn');
			inActiveBtn = $('#deliveryBtn');
		}
		// console.log(activeBtn)
		activeBtn.attr("data-state", "checked");
		inActiveBtn.attr("data-state", "unchecked");
	} catch (error) {

	}

}, 100);

$("body").on("click", ".flex.ct-input__input.ember-text-field.ember-view:eq(3)", () => {
	if ($(".flex.ct-input__input.ember-text-field.ember-view:eq(3)").val() === '') {
		$(".flex.ct-input__input.ember-text-field.ember-view:eq(3)").val('+972')
	}
})

function setButtonHtml() {
	buttonHtml = `<div id="myDeliveryPickupSwitch" class="DetailInput___StyledDiv-sc-1jxvvs4-1 fTIGPO">
	<label for="priority-0"><span class="DetailInput___StyledSpan-sc-1jxvvs4-2 dcCjVF">סוג</span></label>
	<div role="radiogroup" dir="ltr" aria-label="Priority" id="priority-0" class="PriorityField__Group-sc-13okc2a-0 jaWRPG" tabindex="0" style="outline: none;">
	<button type="button" role="radio" aria-checked="false" data-state="unchecked" class="PriorityField__Item-sc-13okc2a-1 dPLYUY" tabindex="-1" data-radix-collection-item=""
	id="deliveryBtn"
	onclick="let target= document.getElementsByClassName('Textareastyled__StyledTextarea-sc-1qpgt10-1 dzIBUT')[0];
	target.value=\`לקוח / ספק:
שם המקבל:
טלפון:
מס' ההזמנה:
קרטונים / שקיות:
תיאור הזמנה:
הערות:
סוכן מכירות: ${username}

-משלוח-\`;
target.style.height='208px';
"
>משלוח</button>
	<button type="button" role="radio" aria-checked="false" data-state="unchecked" class="PriorityField__Item-sc-13okc2a-1 dPLYUY" tabindex="-1" data-radix-collection-item=""
	id="pickupBtn"
	onclick="let target= document.getElementsByClassName('Textareastyled__StyledTextarea-sc-1qpgt10-1 dzIBUT')[0];
target.value=\`ספק / לקוח:
לאסוף מ:
טלפון:
הזמנת טובין מס׳:
קרטונים / שקיות:
תיאור הזמנה:
הערות:
השולח: ${username}

-איסוף-\`;
target.style.height='208px';
"
	>איסוף</button>
	</div></div>`;

}