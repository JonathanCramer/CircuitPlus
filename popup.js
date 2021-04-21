$(function () {

    var firebaseConfig = {
        apiKey: "AIzaSyAWQELYiexgeiAqjS0hG9EMqsLK2jSGFW8",
        authDomain: "circuit-plus-fa6c2.firebaseapp.com",
        projectId: "circuit-plus-fa6c2",
        storageBucket: "circuit-plus-fa6c2.appspot.com",
        messagingSenderId: "554470527479",
        appId: "1:554470527479:web:2a9b2e9d8867cb79e19ef2"
    };
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();

    $('#linkToCircuit').click(() => {
        console.log('click');
        var newURL = "https://team.getcircuit.com/";
        chrome.tabs.create({ url: newURL });
    })
    let table = []

    $('#searchBtn').click(() => {
        let i = 0;
        table = [];
        $('#results').html(`
        <tr>
            <th>שם לקוח/ספק</th>
            <th>מס׳ טלפון</th>
            <th>כתובת</th>
            <th>בחר</th>
            <th>מחק</th>
        </tr>`)

        searchTerm = $('#searchBox').val()
        db.collection("contacts").where("customer_name", "==", searchTerm).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    table.push(doc.data())
                    $('#results').append(`<tr data-index="${i}"><td>${doc.data().customer_name}</td><td>${doc.data().phone}</td><td>${doc.data().address}</td><td><button class="insertDataBtn"><i class="fa fa-check-circle"></i></button></td><td><button class="deleteContact"><i class="fa fa-trash"></i></button></td></tr>`)
                    i++;
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    });

    $('#loadAll').click(() => {
        let i = 0;
        table = []
        $('#results').html(`
        <tr>
            <th>שם לקוח/ספק</th>
            <th>מס׳ טלפון</th>
            <th>כתובת</th>
            <th>בחר</th>
            <th>מחק</th>
        </tr>`)
        db.collection("contacts").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                table.push(doc.data())
                $('#results').append(`<tr data-ref="${doc.id}" data-index="${i}"><td>${doc.data().customer_name}</td><td>${doc.data().phone}</td><td>${doc.data().address}</td><td><button class="insertDataBtn"><i class="fa fa-check-circle"></i></button></td><td><button class="deleteContact"><i class="fa fa-trash"></i></button></td></tr>`)
                i++;
            });
            $('#loadAll').remove();
        });
    });

    $("#create_new_contact").click(() => {
        if ($("#new_customer_name").val() != "") {
            // Add a new document with a generated id.
            db.collection("contacts").add({
                address: $("#new_address").val(),
                customer_name: $("#new_customer_name").val(),
                notes: $("#new_note").val(),
                phone: $("#new_phone").val(),
                receiver_name: $("#new_receiver_name").val()
            }).then((docRef) => {
                $("#new_address").val('')
                $("#new_customer_name").val('')
                $("#new_note").val('')
                $("#new_phone").val('')
                $("#new_receiver_name").val('')
                $('#errorMsg').hide()
                $('#successMsg').fadeIn();
            }).catch((error) => {
                $('#successMsg').hide()
                $('#errorMsg').fadeIn().text('קרתה תקלה, אנא נסה בשנית');
            });
        } else {
            $('#successMsg').hide()
            $('#errorMsg').fadeIn().text('אנא הכנס שם לקוח/עוסק');
        }
    });

    $(document).on('click', '.insertDataBtn', function () {
        let index = $(this).closest('tr').attr('data-index');

        let params = {
            active: true,
            currentWindow: true
        }
        chrome.tabs.query(params, tab => {
            chrome.tabs.sendMessage(tab[0].id, table[index]);
            copyTextToClipboard(table[index].address)
            window.close();
        });
    });

    $(document).on('click', '.deleteContact', function () {
        let ref = $(this).closest('tr').attr('data-ref');
        db.collection("contacts").doc(ref).delete().then(() => {
            $(this).closest('tr').remove();
        }).catch((error) => {
            alert('תקלה במחיקת איש קשר, אנא נסה שוב')
        });
    });
});

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    textArea.style.width = '2em';
    textArea.style.height = '2em';

    textArea.style.padding = 0;

    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}