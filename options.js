$(function () {

    chrome.storage.sync.get('username', function (name) {
        $('#username').val(name.username);
    });

    $('#saveUsername').click(function () {
        var username = $('#username').val();
        if (username) {
            chrome.storage.sync.set({ 'username': username }, function () {
                close();
            });
        }
    });
});