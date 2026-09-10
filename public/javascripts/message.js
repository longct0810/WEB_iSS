function showThongBao(msg, id) {
    const $alert = id.startsWith("#") ? $(id) : $("#" + id);

    $alert.find(".msg-text").text(msg);

    $alert.show();            // hiện
    $alert.addClass("show");  // bootstrap animation
}
function hideThongBao(id) {
    const $alert = id.startsWith("#") ? $(id) : $("#" + id);
    $alert.removeClass("show");
    $alert.hide();
}