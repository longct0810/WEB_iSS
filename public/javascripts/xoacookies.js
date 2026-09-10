const APP_VERSION = "1.0.25";
(function () {

    const currentVersion = localStorage.getItem("APP_VERSION");

    // version thay đổi => clear cache
    if (currentVersion !== APP_VERSION) {

        // clear localStorage
        localStorage.clear();

        // clear sessionStorage
        sessionStorage.clear();

        // clear cookie
        document.cookie.split(";").forEach(function (c) {

            document.cookie = c
                .replace(/^ +/, "")
                .replace(
                    /=.*/,
                    "=;expires=" + new Date().toUTCString() + ";path=/"
                );
        });

        // lưu version mới
        localStorage.setItem("APP_VERSION", APP_VERSION);

        // reload lại
        window.location.reload(true);
    }

})();