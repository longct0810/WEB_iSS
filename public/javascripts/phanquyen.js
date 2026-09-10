
$(document).ready(function () {
    applyPermissionMenu();
});

function apDungQuyenNut(container, quyen, machucnang) {
    const q = quyen.find(x => Number(x.machucnang) === Number(machucnang));
    const $container = $(container);

    if (!q) {
        $container.find(".btn-them, .btn-sua, .btn-xoa").remove();
        return;
    }

    if (Number(q.them) !== 1) $container.find(".btn-them").remove();
    if (Number(q.sua) !== 1) $container.find(".btn-sua").remove();
    if (Number(q.xoa) !== 1) $container.find(".btn-xoa").remove();
}

//hàm mã hóa
function btoaUnicode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}
//hàm giải mã
function atobUnicode(str) {
    return decodeURIComponent(escape(atob(str)));
}
function normalizeRoles(raw) {
    return raw
        .flat() // bỏ lớp []
        .map(item => {
            try {
                return JSON.parse(item);
            } catch (e) {
                console.error("Parse lỗi:", item);
                return null;
            }
        })
        .filter(Boolean); // bỏ null
}
function applyPermissionMenu() {
    try {
        const phanquyen = localStorage.getItem("pmsion");
        if (!phanquyen) return;

        let roles = atobUnicode(phanquyen);

        if (typeof roles === "string") {
            roles = JSON.parse(roles);
        }


        const roleMap = new Map(
            roles.map(item => [Number(item.machucnang), item])
        );
       // console.log("roleMap:", roleMap);

        // Xóa cả <li> chứa menu con, không chỉ xóa <a>
        $("[data-machucnang]").each(function () {
            const $a = $(this);
            const machucnang = Number($a.attr("data-machucnang"));
            const role = roleMap.get(machucnang);

            if (!role || Number(role.xem) !== 1) {
                $a.closest("li").remove();
            }
        });

        // Xóa menu cha nếu không còn item con nào
        $("li.pmsion-menu").each(function () {
            const $li = $(this);
            const $hasArrow = $li.children("a.has-arrow");
            const $subMenu = $li.children("ul.submenu");

            // Chỉ xử lý menu cha dạng có submenu
            if ($hasArrow.length === 0) return;

            // Không có submenu thì xóa
            if ($subMenu.length === 0) {
                $li.remove();
                return;
            }

            // Chỉ đếm li con trực tiếp còn lại
            const childCount = $subMenu.children("li").length;

            if (childCount === 0) {
                $li.remove();
            }
        });

    } catch (error) {
        console.error("Lỗi xử lý phân quyền:", error);
    }
}