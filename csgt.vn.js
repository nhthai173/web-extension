const vehicleList = [
    {
        "name": "Ranger 2015",
        "BienKiemSoat": '79C18564',
        "LoaiXe": '1'
    },
    {
        "name": "Vios 2011",
        "BienKiemSoat": '79A01495',
        "LoaiXe": '1'
    },
    {
        "name": "Future đỏ",
        "BienKiemSoat": '79N85057',
        "LoaiXe": '2'
    }
];

function isInList (bks) {
    return vehicleList.find(function (vehicle){
        return vehicle.BienKiemSoat === bks;
    });
};

function createVehicleSelect() {
    const $input = document.querySelector('input[name="BienKiemSoat"]');
    if (!$input) return setTimeout(createVehicleSelect, 1000);
    
    renderSelect();
    document.getElementById('custom-bks').outerHTML += '<button id="vListToggle" data-current="select" style="margin-top: 5px">Nhập biển số</button>';
    document.getElementById('vListToggle')?.addEventListener('click', toggleMode);
};

function renderSelect() {
    const $input = document.querySelector('input[name="BienKiemSoat"]');
    const currentBKS = $input.value;
    const options = vehicleList.map(function (vehicle) {
        return '<option value="' + vehicle.BienKiemSoat + '">' + vehicle.name + ' (' + vehicle.BienKiemSoat + ')</option>';
    }).join('');
    const selectHtml = '<select id="custom-bks" name="BienKiemSoat" class="input">' + options + '</select>';
    $input.outerHTML = selectHtml;
    console.log("created vehicle select")
    if (currentBKS && isInList(currentBKS)) {
        document.getElementById('custom-bks').value = currentBKS;
    }
    autoFillLoaiXe();
    document.getElementById('custom-bks')?.addEventListener('change', autoFillLoaiXe);
}

function autoFillLoaiXe() {
    const $bks = document.getElementById('custom-bks');
    if (!$bks) return;
    const LoaiXe = isInList($bks.value)?.LoaiXe;
    if (!LoaiXe) return;
    document.querySelector('select[name="LoaiXe"]').value = LoaiXe;
}

function toggleMode(e) {
    e.preventDefault();
    const $i = document.getElementById('custom-bks');
    const $t = document.getElementById('vListToggle');
    if ($t.dataset.current === 'select') {
        $i.outerHTML = '<input name="BienKiemSoat" class="input">';
        $t.dataset.current = 'input';
        $t.innerText = 'Chọn xe';
        document.querySelector('input[name="BienKiemSoat"]').focus();
    } else if ($t.dataset.current === 'input') {
        renderSelect();
        $t.dataset.current = 'select';
        $t.innerText = 'Nhập biển số';
    }
}

createVehicleSelect();