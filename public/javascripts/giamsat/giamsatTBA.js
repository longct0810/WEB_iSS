$(document).ready(function () {
    // if (!localStorage.getItem("us")) {
    //     window.location.href = "../login";
    // }
     
    GetMap();
});
function handleSidebarNode() {
    // GetTBA();
}
function GetTBA() {
    try {
        var node = JSON.parse(localStorage.getItem("node"));
        let loaithumuc = node.type; // loaithumuc = 9 -> chọn điểm đo.  loaithumuc = 3 -> chọn lộ
        var idthietbi = node.id;
        if (loaithumuc == "9") {
            var url = "/api/thietbi_get_thietbi_by_idthietbi";
            var para = {
                v_idthietbi: idthietbi
            }
            var lst = ExecuteServiceSyns(JSON.stringify(para), url);
            var data = JSON.parse(lst[0][0]);
            var vido = data.vido;
            var kinhdo = data.kinhdo;
            // 
            draw_map_tba(vido, kinhdo);
        } else {
            // vẽ danh mục lộ gồm nhiều TBA
            GetMap();
        }
    } catch (e) {
        console.log(e);
    }
}
// function draw_map_tba(vido, kinhdo) {

//     var map = new Microsoft.Maps.Map('#myMap', {
//         credentials: 'YOUR_BING_MAPS_KEY'
//     });
//     map.setView({ center: new Microsoft.Maps.Location(vido, kinhdo), zoom: 15 });
//     var location = new Microsoft.Maps.Location(vido, kinhdo);
//     var pushpin = new Microsoft.Maps.Pushpin(location, { text: 'TBA', color: 'red' });
//     map.entities.push(pushpin);
//     Microsoft.Maps.Events.addHandler(pushpin, 'click', function () {
//         $('#modal-chitiet_tba').modal('show');
//     });
// }





//----------------
function GetMap__() {

    // map.setView({ center: new Microsoft.Maps.Location(20.984746, 105.760790), zoom: 16 });
    // var location = new Microsoft.Maps.Location(20.984746, 105.760790);
    // var pushpin = new Microsoft.Maps.Pushpin(location, { text: 'Lộ 01', color: 'red' });
    // map.entities.push(pushpin);
    //  var node = JSON.parse(localStorage.getItem("node"));
    //  let loaithumuc = node.type;  var tree = node.tree;

    var node = JSON.parse(localStorage.getItem("node"));
    let loaithumuc = node.type; // loaithumuc = 9 -> chọn điểm đo.  loaithumuc = 3 -> chọn lộ
    let danhmucid = node.id;
    var tree = node.tree;
    // -------------
    if (danhmucid == null || danhmucid == undefined) {
        toastr.error("Vui lòng chọn danh mục", "Thông báo", {
            positionClass: "toast-bottom-right",
            timeOut: 5e3,
            closeButton: !0,
            debug: !1,
            newestOnTop: !0,
            progressBar: !0,
            preventDuplicates: !0,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
            tapToDismiss: !1
        });
        return;
    }
    // if (tree != 2) {
    //     toastr.error("Vui lòng chọn thiết bị ở cây thư mục lộ đường dây", "Thông báo", {
    //         positionClass: "toast-bottom-right",
    //         timeOut: 5e3,
    //         closeButton: !0,
    //         debug: !1,
    //         newestOnTop: !0,
    //         progressBar: !0,
    //         preventDuplicates: !0,
    //         onclick: null,
    //         showDuration: "300",
    //         hideDuration: "1000",
    //         extendedTimeOut: "1000",
    //         showEasing: "swing",
    //         hideEasing: "linear",
    //         showMethod: "fadeIn",
    //         hideMethod: "fadeOut",
    //         tapToDismiss: !1
    //     });
    //     return;
    // }

    // var map = new Microsoft.Maps.Map('#myMap', {
    //     credentials: 'YOUR_BING_MAPS_KEY'
    // });





    function draw_map_tba(vido, kinhdo) {

        var map = L.map('myMap').setView([vido, kinhdo], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.marker([vido, kinhdo])
            .addTo(map)
            .bindPopup('TBA')
            .on('click', function () {
                //  $('#modal-chitiet_tba').modal('show');
            });
    }



    var map = L.map('myMap').setView([21.028511, 105.804817], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var location = new Microsoft.Maps.Location(vido, kinhdo);
    var pushpin = new Microsoft.Maps.Pushpin(location);
    map.entities.push(pushpin);


    var iszoom = 10;
    if (danhmucid == "002") {
        // 1 hà nội 

        map.setView({ center: new Microsoft.Maps.Location(21.276807, 105.635963), zoom: 8 });
        var location = new Microsoft.Maps.Location(21.276807, 105.635963);
        var pushpin = new Microsoft.Maps.Pushpin(location, { text: 'TBA', color: 'red' });
        map.entities.push(pushpin);

        // hưng yên
        map.setView({ center: new Microsoft.Maps.Location(20.836923, 105.987712), zoom: 8 });
        var location3 = new Microsoft.Maps.Location(20.836923, 105.987712);
        var pushpin3 = new Microsoft.Maps.Pushpin(location3, { text: 'TBA', color: 'red' });
        map.entities.push(pushpin3);
        // sơn la
        map.setView({ center: new Microsoft.Maps.Location(21.327030, 103.914100), zoom: 8 });
        var location4 = new Microsoft.Maps.Location(21.327030, 103.914100);
        var pushpin4 = new Microsoft.Maps.Pushpin(location4, { text: 'TBA', color: 'red' });
        map.entities.push(pushpin4);

        //  thạch thất psmart
        map.setView({ center: new Microsoft.Maps.Location(21.028239, 105.617233), zoom: 8 });
        var location2 = new Microsoft.Maps.Location(21.028239, 105.617233);
        var pushpin2 = new Microsoft.Maps.Pushpin(location2, { text: 'TBA', color: 'red' });
        map.entities.push(pushpin2);


    }
    // cty psmart
    else if (danhmucid == "002001") {
        map.setView({ center: new Microsoft.Maps.Location(21.008648, 105.548192), zoom: 12 });
        var location = new Microsoft.Maps.Location(21.008648, 105.548192);
        var pushpin = new Microsoft.Maps.Pushpin(location, { text: 'TBA', color: 'red' });
        map.entities.push(pushpin);

        map.setView({ center: new Microsoft.Maps.Location(21.050093, 105.611704), zoom: 12 });
        var location2 = new Microsoft.Maps.Location(21.050093, 105.611704);
        var pushpin2 = new Microsoft.Maps.Pushpin(location2, { text: 'TBA', color: 'red' });
        map.entities.push(pushpin2);
    }
    // cty psmart  lộ 01
    else if (danhmucid == "002001001") {
        map.setView({ center: new Microsoft.Maps.Location(21.031499, 105.592126), zoom: 14 });
        var location = new Microsoft.Maps.Location(21.031499, 105.592126);
        var pushpin = new Microsoft.Maps.Pushpin(location, { text: 'TBA', color: 'red' });
        map.entities.push(pushpin);

        map.setView({ center: new Microsoft.Maps.Location(21.031400, 105.605226), zoom: 14 });
        var location2 = new Microsoft.Maps.Location(21.031400, 105.605226);
        var pushpin2 = new Microsoft.Maps.Pushpin(location2, { text: 'TBA', color: 'red' });
        map.entities.push(pushpin2);

        map.setView({ center: new Microsoft.Maps.Location(21.025749, 105.603987), zoom: 14 });
        var location3 = new Microsoft.Maps.Location(21.025749, 105.603987);
        var pushpin3 = new Microsoft.Maps.Pushpin(location3, { text: 'TBA', color: 'red' });
        map.entities.push(pushpin3);
    }
    // tbs Sơn La
    else if (danhmucid == "002002") {
        map.setView({ center: new Microsoft.Maps.Location(21.055122, 104.796881), zoom: 12 });
        var location = new Microsoft.Maps.Location(21.055122, 104.796881);
        var pushpin = new Microsoft.Maps.Pushpin(location, { text: 'TBA', color: 'red' });
        map.entities.push(pushpin);
    }
    // ROUTER 1
    else if (danhmucid == "002002001") {
        map.setView({ center: new Microsoft.Maps.Location(20.961582, 104.754245), zoom: 14 });
        var location = new Microsoft.Maps.Location(20.961582, 104.754245);
        var pushpin = new Microsoft.Maps.Pushpin(location, { text: 'TBA', color: 'red' });
        map.entities.push(pushpin);
    }
    else {
        // map.setView({ center: new Microsoft.Maps.Location(20.984746, 105.760790), zoom: 16 });
        // var location = new Microsoft.Maps.Location(20.984746, 105.760790);
        // var pushpin = new Microsoft.Maps.Pushpin(location, { text: 'Lộ 01', color: 'red' });
        // map.entities.push(pushpin);
    }
    Microsoft.Maps.Events.addHandler(pushpin, 'click', function () {

        // $('#modal-chitiet_tba').modal('show');
    });
    Microsoft.Maps.Events.addHandler(pushpin2, 'click', function () {
        //  $('#modal-chitiet_tba').modal('show');
    });
    Microsoft.Maps.Events.addHandler(pushpin3, 'click', function () {
        // $('#modal-chitiet_tba').modal('show');
    });
}

// function GetMap() {

//     var map = L.map('myMap').setView([21.028511, 105.804817], 14);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; OpenStreetMap contributors'
//     }).addTo(map);

//     // ICON XANH LÁ TO
//     var greenIcon = L.icon({

//         iconUrl:
//         'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',

//         shadowUrl:
//         'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

//         iconSize: [45, 70],
//         iconAnchor: [22, 70],
//         popupAnchor: [0, -60],
//         shadowSize: [70, 70]
//     });

//     // MARKER
//     var marker = L.marker([21.028511, 105.804817], {
//         icon: greenIcon
//     }).addTo(map);

//     // POPUP HIỂN THỊ LUÔN
//     marker.bindPopup(`
//         <div style="
//             font-size:18px;
//             font-weight:bold;
//             color:#00cc00;
//         ">
//             TBA Hà Nội
//         </div>
//     `).openPopup();

//     // CLICK MARKER -> OPEN MODAL
//     marker.on('click', function () {

//         $('#modal-chitiet_tba').modal('show');

//     });

// }


function GetMap() {

    var map = L.map('myMap').setView([21.028511, 105.804817], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // ICON XANH
    var greenIcon = L.icon({

        iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',

        shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

        iconSize: [45, 70],
        iconAnchor: [22, 70],
        popupAnchor: [0, -60],
        shadowSize: [70, 70]
    });

    // DANH SÁCH TBA
    var stations = [

        {
            name: 'TBA Hà Nội',
            lat: 21.028511,
            lng: 105.804817
        },

        {
            name: 'TBA Cầu Giấy',
            lat: 21.036805,
            lng: 105.790583
        },

        {
            name: 'TBA Đống Đa',
            lat: 21.018072,
            lng: 105.829949
        },

        {
            name: 'TBA Thanh Xuân',
            lat: 20.996670,
            lng: 105.809920
        }

    ];

    // LOOP TẠO MARKER
    stations.forEach(function (item) {

        var marker = L.marker([item.lat, item.lng], {
            icon: greenIcon
        }).addTo(map);

        marker.bindPopup(`
            <div style="
                font-size:18px;
                font-weight:bold;
                color:#00cc00;
            ">
                ${item.name}
            </div>
        `);

        // HIỆN POPUP LUÔN
        marker.openPopup();

        // CLICK MARKER
        marker.on('click', function () {

            //  $('#modal-chitiet_tba').modal('show');

            // console.log(item.name);

        });

    });

}