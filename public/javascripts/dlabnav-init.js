"use strict";

var dezSettingsOptions = {};
var key;
var lastValue = "";
var nodeList = [];

function getUrlParams(dParam) {
  var dPageURL = window.location.search.substring(1);
  var dURLVariables = dPageURL.split("&");

  for (var i = 0; i < dURLVariables.length; i++) {
    var dParameterName = dURLVariables[i].split("=");

    if (dParameterName[0] === dParam) {
      return dParameterName[1] === undefined
        ? true
        : decodeURIComponent(dParameterName[1]);
    }
  }
}

(function ($) {
  "use strict";

  dezSettingsOptions = {
    typography: "cairo",
    version: "dark",
    layout: "vertical",
    primary: "color_14",
    navheaderBg: "color_14",
    sidebarBg: "color_14",
    sidebarStyle: "full",
    sidebarPosition: "fixed",
    headerPosition: "fixed",
    containerLayout: "full",
  };

  new dezSettings(dezSettingsOptions);

  jQuery(window).on("resize", function () {
    dezSettingsOptions.containerLayout = $("#container_layout").val();
    new dezSettings(dezSettingsOptions);
  });
})(jQuery);

$(document).ready(function () {
  const userinfo = localStorage.getItem("us");

  if (userinfo) {
    const user = JSON.parse(atob(userinfo));
    loadDataTree(user.danhmucid);
  }

  $("#btnsearchLeftSideBar")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      searchNode();
    });
});

function saveTreeState() {
  var treeObj = $.fn.zTree.getZTreeObj("tree");
  if (!treeObj) return;

  var nodes = treeObj.transformToArray(treeObj.getNodes());
  var state = nodes.map(function (node) {
    return {
      id: node.id,
      pId: node.pId,
      open: node.open,
    };
  });

  localStorage.setItem("treeState", JSON.stringify(state));
}

function restoreTreeState() {
  var treeState = localStorage.getItem("treeState");
  if (!treeState) return;

  var treeObj = $.fn.zTree.getZTreeObj("tree");
  if (!treeObj) return;

  var state = JSON.parse(treeState);

  state.forEach(function (nodeState) {
    var node = treeObj.getNodeByParam("id", String(nodeState.id));
    if (node) {
      treeObj.expandNode(node, !!nodeState.open, false, false, false);
    }
  });
}

function getFontCss(treeId, treeNode) {
  return !!treeNode.highlight
    ? { color: "#ffde59", "font-weight": "bold" }
    : { color: "#fff", "font-weight": "normal" };
}

function onClick(event, treeId, treeNode, clickFlag) {
  var pathArray = window.location.pathname.split("/");
  var module = pathArray[1];

  switch (module) {
    case "giamsat":
      if (treeNode.name) {
        getDataSVG();
      } else {
        alert("Chọn lại danh mục");
      }
      break;

    default:
      if (treeNode.name) {
        handleSidebarNode();
      } else {
        alert("Chọn lại danh mục");
      }
      break;
  }

  saveTreeState();
}

function loadDataTree(id) {
  var para = {
    v_danhmucid: id,
    v_typenode: "1",
    v_mataikhoan: 50,
  };

  var url = "/api/ds_danhmuc";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url) || [];

  var rawNodes = [];
  var levelMap = {};

  $.each(lst, function (k, v) {
    var node =v;
	
    var nodeId = String(node.code || "").trim();
    var parentId = String(node.danhmuccha || "0").trim();

    rawNodes.push(node);

    levelMap[nodeId] = {
      id: nodeId,
      pId: parentId,
      level: null,
    };
  });

  function getLevel(nodeId) {
    if (!levelMap[nodeId]) return 0;
    if (levelMap[nodeId].level !== null) return levelMap[nodeId].level;

    var parentId = String(levelMap[nodeId].pId || "0");

    if (parentId === "0" || !levelMap[parentId] || parentId === nodeId) {
      levelMap[nodeId].level = 0;
      return 0;
    }

    levelMap[nodeId].level = getLevel(parentId) + 1;
    return levelMap[nodeId].level;
  }

  Object.keys(levelMap).forEach(function (nodeId) {
    getLevel(nodeId);
  });

  var childMap = {};

  $.each(rawNodes, function (k, node) {
    var parentId = String(node.danhmuccha || "0").trim();
    childMap[parentId] = true;
  });

  var nodes = [];

  $.each(rawNodes, function (k, node) {
    var nodeId = String(node.code || "").trim();
    var parentId = String(node.danhmuccha || "0").trim();
    var level = levelMap[nodeId] ? levelMap[nodeId].level : 0;

    nodes.push({
      id: nodeId,
      pId: parentId,
      name: (node.tendanhmuc || "-").toUpperCase(),
      open: level <= 3,
      isParent: !!childMap[nodeId],
      iconSkin: node.ketnoi,
      data: {
        id: node.code,
        type: node.loaidanhmuc,
        socongto: node.socongto,
        tendanhmuc: node.tendanhmuc,
        tree: 1,
        loaithietbi: node.loaithietbi,
        loaipha: node.loaipha,
        isCambien: node.type,
        id_thietbi: node.id_thietbi,
        imei: encode(node.imei || ""),
        ip: encode(node.ip || ""),
        port: encode(String(node.port || "")),
      },
    });
  });

  drawData_tree(nodes);
}

function drawData_tree(lst) {
  var setting = {
    view: {
      dblClickExpand: false,
      showLine: false,
      selectedMulti: false,
      fontCss: getFontCss,
    },
    data: {
      simpleData: {
        enable: true,
        idKey: "id",
        pIdKey: "pId",
        rootPId: "",
      },
    },
    callback: {
      onClick: onClick,
      beforeClick: function (treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("tree");

        if (treeNode.isParent) {
          zTree.expandNode(treeNode, !treeNode.open, false, false, false);
        }

        $("#firstFrame").attr("src", treeNode.file);
        localStorage.setItem("node", JSON.stringify(treeNode.data));

        return true;
      },
    },
  };

  key = $("#key");

  key.off("keydown").on("keydown", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      searchNode();
    }
  });

  var t = $("#tree");
  $.fn.zTree.init(t, setting, lst);

  $(window)
    .off("beforeunload", saveTreeState)
    .on("beforeunload", saveTreeState);

  var zTree = $.fn.zTree.getZTreeObj("tree");

  if (localStorage.getItem("node")) {
    var cur_id = String(JSON.parse(localStorage.getItem("node")).id || "").trim();
    var currentNode = zTree.getNodeByParam("id", cur_id);

    if (currentNode) {
      zTree.selectNode(currentNode);
    }
  }
}

function searchNode() {
  var zTree = $.fn.zTree.getZTreeObj("tree");
  if (!zTree) return;

  if (!key || !key.length) {
    key = $("#key");
  }

  var value = $.trim(key.val() || "");

  clearSearchHighlight(zTree);
  nodeList = [];

  if (value === "") {
    lastValue = "";
    toastr.warning("Vui lòng nhập từ khóa tìm kiếm");
    return;
  }

  var allNodes = zTree.transformToArray(zTree.getNodes());

  nodeList = allNodes.filter(function (node) {
    return matchNode(node, value);
  });

  lastValue = value;

  if (nodeList.length === 0) {
    toastr.warning("Không tìm thấy dữ liệu");
    return;
  }

  highlightNodes(zTree, nodeList);
  focusFirstMatchedNode(zTree, nodeList[0]);

  //toastr.success("Tìm thấy " + nodeList.length + " kết quả");
}

function normalizeSearchText(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]/g, "");
}

function matchNode(node, keyword) {
  var data = node.data || {};

  var fields = [
    node.name,
    node.id,
    node.pId,
    data.id,
    data.type,
    data.socongto,
    data.tendanhmuc,
    data.loaithietbi,
    data.loaipha,
    data.isCambien,
    data.id_thietbi,
    data.imei ? decode(data.imei) : "",
    data.ip ? decode(data.ip) : "",
    data.port ? decode(data.port) : "",
  ];

  var searchKey = normalizeSearchText(keyword);

  return fields.some(function (v) {
    var text = normalizeSearchText(v);
    return text.includes(searchKey);
  });
}

function clearSearchHighlight(zTree) {
  var allNodes = zTree.transformToArray(zTree.getNodes());

  allNodes.forEach(function (node) {
    if (node.highlight) {
      node.highlight = false;
      zTree.updateNode(node);
    }
  });
}

function highlightNodes(zTree, nodes) {
  nodes.forEach(function (node) {
    node.highlight = true;
    zTree.updateNode(node);
  });
}

function focusFirstMatchedNode(zTree, node) {
  var parent = node.getParentNode();

  while (parent) {
    zTree.expandNode(parent, true, false, false);
    parent = parent.getParentNode();
  }

  zTree.selectNode(node);

  // Scroll xuống đúng node tìm được
  setTimeout(function () {
    var $treeContainer = $("#tree").closest(".deznav-scroll, .sidebar, .dlabnav-scroll");

    if (!$treeContainer.length) {
      $treeContainer = $("#tree").parent();
    }

    var $nodeA = $("#" + node.tId + "_a");

    if ($nodeA.length && $treeContainer.length) {
      var containerTop = $treeContainer.offset().top;
      var nodeTop = $nodeA.offset().top;
      var currentScroll = $treeContainer.scrollTop();

      $treeContainer.animate(
        {
          scrollTop: currentScroll + nodeTop - containerTop - 80,
        },
        300
      );
    }
  }, 100);
}

function ExecuteServiceSyns(para, url) {
  try {
    var lst = null;

    $.ajax({
      url: url,
      type: "POST",
      data: para,
      async: false,
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function (data) {
        lst = data == null || data === "" ? [] : data;
      },
      complete: function () { },
      error: function () { },
    });

    return lst;
  } catch (e) {
    return null;
  }
}

function encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function decode(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    return "";
  }
}