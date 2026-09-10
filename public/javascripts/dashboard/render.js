function renderKhoangHaThe(id_thietbi) {

    const phases = [
        {
            name: 'A',
            className: 'phaseA',
            scale: 1,
            ioa: [0, 7, 23, 1008]
        },
        {
            name: 'B',
            className: 'phaseB',
            scale: 1,
            ioa: [1, 8, 24, 1009]
        },
        {
            name: 'C',
            className: 'phaseC',
            scale: 1,
            ioa: [2, 9, 25, 1010]
        }
    ];

    let html = `
        <tr class="low-voltage-table-head">
            <th scope="col">Pha</th>
            <th scope="col">U <small>(V)</small></th>
            <th scope="col">I <small>(A)</small></th>
            <th scope="col">COSφ</th>
            <th scope="col">T° <small>(°C)</small></th>
        </tr>
    `;

    phases.forEach(p => {

        html += `
            <tr id="line_${p.name}_${id_thietbi}">
                <th scope="row">
                    <span class="phase_header ${p.className}">
                        ${p.name}
                    </span>
                </th>

                ${p.ioa.map(ioa => `
                    <td>
                        <span
                            id="tbl_value_ioa_${id_thietbi}_${ioa}"
                            data-id-thietbi="${id_thietbi}"
                            data-ioa="${ioa}"
                            data-scale="${p.scale}"
                            class="phase ${p.className}">
                        </span>
                    </td>
                `).join('')}

            </tr>
        `;
    });

    html += `
        <tr class="low-voltage-warning-row">
            <td colspan="5">
                <span id="warning_I0" class="warning"></span>
            </td>
        </tr>
    `;

    document.getElementById('tblHaThe').innerHTML = html;
}

function renderCongToTongRows(id_thietbi) {

    const rows = {
        dienap_ctotong: [
            { id: 'CONGTOTONG_UA', cls: 'phaseA', ioa: 5000, scale: 1 },
            { id: 'CONGTOTONG_UB', cls: 'phaseB', ioa: 5001, scale: 1 },
            { id: 'CONGTOTONG_UC', cls: 'phaseC', ioa: 5002, scale: 1 }
        ],

        dongdien_ctotong: [
            { id: 'CONGTOTONG_IA', cls: 'phaseA', ioa: 5006, scale: 1 },
            { id: 'CONGTOTONG_IB', cls: 'phaseB', ioa: 5007, scale: 1 },
            { id: 'CONGTOTONG_IC', cls: 'phaseC', ioa: 5008, scale: 1 }
        ],

        p_congtotong: [
            { id: 'CONGTOTONG_PA_GIAO', cls: 'phaseA', ioa: 5073, scale: 1 },
            { id: 'CONGTOTONG_PB_GIAO', cls: 'phaseB', ioa: 5074, scale: 1 },
            { id: 'CONGTOTONG_PC_GIAO', cls: 'phaseC', ioa: 5075, scale: 1 }
        ],

        q_congtotong: [
            { id: 'CONGTOTONG_QA_GIAO', cls: 'phaseA', ioa: 5076, scale: 1 },
            { id: 'CONGTOTONG_QB_GIAO', cls: 'phaseB', ioa: 5077, scale: 1 },
            { id: 'CONGTOTONG_QC_GIAO', cls: 'phaseC', ioa: 5078, scale: 1 }
        ],

        cos_congtotong: [
            { id: 'CONGTOTONG_COSA', cls: 'phaseA', ioa: 5040, scale: 1 },
            { id: 'CONGTOTONG_COSB', cls: 'phaseB', ioa: 5041, scale: 1 },
            { id: 'CONGTOTONG_COSC', cls: 'phaseC', ioa: 5042, scale: 1 }
        ]
    };

    Object.entries(rows).forEach(([rowId, cells]) => {

        const row = document.getElementById(rowId);
        if (!row) return;

        row.innerHTML = cells.map(cell => `
            <td>
            <span
                id="tbl_value_ioa_${id_thietbi}_${cell.ioa}"
                data-id-thietbi="${id_thietbi}"
                data-ioa="${cell.ioa}"
                data-scale="${cell.scale}"
                class="phase ${cell.cls}">
            </span>
            </td>
        `).join('');
    });
}

function renderHaTheRows(id_thietbi) {

    const line4 = document.getElementById('line4_hathe');

    if (line4) {
        line4.innerHTML = `
            <th scope="row">
                <span class="status-label"><i class="fas fa-temperature-low" aria-hidden="true"></i>MÔI TRƯỜNG</span>
            </th>
            <td class="status-value status-temperature">
                <span class="status-icon temperature" aria-hidden="true"><i class="fas fa-thermometer-half"></i></span>
                <strong>
                    <span
                        id="tbl_value_ioa_${id_thietbi}_1011"
                        data-id-thietbi="${id_thietbi}"
                        data-ioa="1011"
                        data-scale="1"
                        class="phase phaseA">
                    </span><small>°C</small>
                </strong>
            </td>
        `;
    }

    const line5 = document.getElementById('line5_hathe');

    if (line5) {
        line5.innerHTML = `
            <th scope="row">
                <span class="status-label"><i class="fas fa-shield-alt" aria-hidden="true"></i>RÒ ĐIỆN</span>
            </th>
            <td class="status-value">
                <span
                    id="tbl_value_ioa_${id_thietbi}_3000"
                    data-id-thietbi="${id_thietbi}"
                    data-ioa="3000"
                    data-scale="1"
                    class="hinh-tron status-indicator"
                    role="status"
                    aria-label="Đang chờ trạng thái rò điện">
                </span>
            </td>
        `;
    }

    const cuaKhoang = document.querySelector('#line6_hathe');

    if (cuaKhoang) {
        cuaKhoang.innerHTML = `
            <th scope="row">
                <span class="status-label"><i class="fas fa-door-closed" aria-hidden="true"></i>CỬA KHOANG</span>
            </th>
            <td class="status-value">
                <span
                    id="tbl_value_ioa_${id_thietbi}_3001"
                    data-id-thietbi="${id_thietbi}"
                    data-ioa="3001"
                    data-scale="1"
                    class="door-status pending"
                    role="status"
                    aria-label="Đang chờ trạng thái cửa">
                    <i class="fas fa-door-closed" aria-hidden="true"></i>
                </span>
            </td>
        `;
    }
}
function warning_I0() {
  // =========================
  // Dòng điện
  // =========================
  const IA = Number($("#tbl_value_ioa_366621_7").text()) || 0;
  const IB = Number($("#tbl_value_ioa_366621_8").text()) || 0;
  const IC = Number($("#tbl_value_ioa_366621_9").text()) || 0;

  // =========================
  // cos phi
  // =========================
  const cosA = Number($("#tbl_value_ioa_366621_23").text()) || 0;
  const cosB = Number($("#tbl_value_ioa_366621_24").text()) || 0;
  const cosC = Number($("#tbl_value_ioa_366621_25").text()) || 0;

  // =========================
  // Góc pha (radian)
  // acos(cosφ)
  // =========================
  const phiA = Math.acos(cosA);
  const phiB = Math.acos(cosB);
  const phiC = Math.acos(cosC);

  // 120°
  const deg120 = (120 * Math.PI) / 180;

  // =========================
  // Thành phần X
  // =========================
  const x =
    IA * Math.cos(phiA) +
    IB * Math.cos(phiB - deg120) +
    IC * Math.cos(phiC + deg120);

  // =========================
  // Thành phần Y
  // =========================
  const y =
    IA * Math.sin(phiA) +
    IB * Math.sin(phiB - deg120) +
    IC * Math.sin(phiC + deg120);

  // =========================
  // I0
  // =========================
  const I0 = Math.sqrt(x * x + y * y);

  // =========================
  // % lệch pha
  // =========================
  const totalI = IA + IB + IC;

  let imbalance = 0;

  if (totalI > 0) {
    imbalance = ((3 * I0) / totalI) * 100;
  }

  // =========================
  // Đánh giá
  // =========================
  let text = "";
  let color = "";

  if (imbalance < 1.5) {
    text = "🟢 Bình thường";
    color = "#00c853";
  } else if (imbalance >= 1.5 && imbalance < 3) {
    text = "🟡 Lệch pha nhẹ";
    color = "#ffab00";
  } else {
    text = "🔴 Lệch pha nghiêm trọng";
    color = "#ff1744";
  }

  // =========================
  // Hiển thị
  // =========================
  $("#warning_I0")
    .html(
      `
      ${text} &nbsp;|&nbsp;
      I0: ${I0.toFixed(2)} A<br>
      Lệch pha: ${imbalance.toFixed(2)} %
    `,
    )
    .css({
      color: color,
      fontWeight: "bold",
    });

  // console.log({
  //   IA,
  //   IB,
  //   IC,
  //   cosA,
  //   cosB,
  //   cosC,
  //   I0,
  //   imbalance,
  // });
}
