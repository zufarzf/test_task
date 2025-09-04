// FORM - Autocomplete Off
document.querySelectorAll('form').forEach(function (form) {
	form.setAttribute('autocomplete', 'off')
})




let END_ACTIVE_FIELD = null;
$(document).on('focus', 'input', function () {
	END_ACTIVE_FIELD = $(this);
});




// ---> Start FORM - Refresh CSRF
function refresh_csrf(mode=true) {
	if (mode) socket.emit('refresh_csrf');
}


$(document).on('click', '.refresh_csrf', function () {
	refresh_csrf()
});


socket.on('client__refresh_csrf', function (response) {
	$('form').each(function () {
		$(this).find('input[name=csrf_token]').val(response)
	})
	
	// Проверяем есть ли CKEditor на странице, если да то обновляем его CSRF-Token.
	if ($('.editor').length) {
		CKEDITOR_DATA.CSRF_TOKEN = response;
	};
});
// ---> End FORM - Refresh CSRF




function check_input_type(input, type) {
	return input.attr('type') === type;
};




function formatNumber(input_) {
    let input = $(input_).get(0);
    let value = input.value;

    // Разрешаем только цифры, запятую, минус и точку
	value = value.replace(/[^0-9,.-]/g, '');

    // Оставляем только один минус в начале
    value = value.replace(/(?!^)-/g, '');

    // Если есть запятая — заменяем на точку (унифицируем)
    value = value.replace(',', '.');

    // Удаляем все точки после первой
    let firstDotIndex = value.indexOf('.');
    if (firstDotIndex !== -1) {
		value = value.substring(0, firstDotIndex + 1) + value.substring(firstDotIndex + 1).replace(/\./g, '');
    }

    // Разделяем на целую и дробную части
    let parts = value.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';

    // Если целая часть начинается с 0 и нет точки — убираем ведущий 0
    if (integerPart.length > 1 && integerPart.startsWith('0') && firstDotIndex === -1) {
        repValue = integerPart !== '00' ? '' : '0'
		integerPart = integerPart.replace(/^0+/, repValue);
    }

    // Если целая часть начинается с - и после идёт 0 — убираем ведущий -0
    if (integerPart.startsWith('-0')) {
        repValue = integerPart !== '-0' ? '' : '0'
		integerPart = integerPart.replace(/^-0+/, repValue);
    }
	
    // Форматируем целую часть с пробелами
    const sign = integerPart.startsWith('-') ? '-' : '';
    integerPart = integerPart.replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    integerPart = sign + integerPart;

    // Собираем обратно
    input.value = integerPart + (firstDotIndex > 0 ? '.' + decimalPart : '');
}


$(document).on('input click focus', '.numeric-field', function() {
	formatNumber(this);
});


function stepFormattedNumber(btn, step, min = null, max = null) {
    let container = $(btn).closest('.count-input-with-btns-container');
    let input_ = $(container).find('.count-input-with-btns');
    let input = $(input_).get(0);
    let raw = input.value;

    // Заменяем запятую на точку, убираем пробелы
    raw = raw.replace(',', '.').replace(/\s/g, '');

    // Преобразуем в число
    let value = parseFloat(raw);
    if (isNaN(value)) value = 0;

    // Прибавляем шаг
    value += step;

    // Ограничения
    if (min !== null && value < min) value = min;
    if (max !== null && value > max) value = max;

    // Форматируем целую часть с пробелами
    let parts = value.toString().split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] ? '.' + parts[1] : '';

    const sign = integerPart.startsWith('-') ? '-' : '';
    integerPart = integerPart.replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    input.value = sign + integerPart + decimalPart;
}


$(document).on('click', '.plus-btn', function () {
	stepFormattedNumber(this, 1, 0);
});
$(document).on('click', '.minus-btn', function () {
	stepFormattedNumber(this, -1, 0);
});




// ---> Start INPUTS  FORM
const put_value_in_hidden_tag = (hidden_input, value) => {
	let form = $(hidden_input.closest('form'));
	let hidden_input_name = hidden_input.attr('name');
	
	hidden_input = form.find(`input[name="${hidden_input_name}"]`);
	hidden_input.val(value);
}
// ---> End INPUTS  FORM