// Проверяет имеет ли элемент проверяемый класс
function hasClass(element, className) {
	let dom_elem = $(element).get(0);
	return dom_elem.classList.contains(className);
}


// Возвращает данный URL адрес
function currentURL() {
	return window.location.pathname;
};


// Сопоставляет URL адрес данной страницы с переданным адресом
function checkThisURL(url) {
	if (currentURL() === url) return true;
	return false;
};


// Принимает адрес и redirect'тит по ней
socket.on('redirect', function(destination) {
	if (!checkThisURL(destination)) redirect(destination);
});


// Перенаправляет на указанный адрес
function redirect(url) {
	if (url) window.location.href = url;
};


function groupingNumbers(number) {
    const strNumber = String(number).replace(',', '.').trim();

    const isNegative = strNumber.startsWith('-');
    const normalizedNumber = isNegative ? strNumber.slice(1) : strNumber;

    const [integerPart, fractionalPart] = normalizedNumber.split('.');

    // Группировка целой части
    let intResult = '';
    let counter = 0;
    for (let i = integerPart.length - 1; i >= 0; i--) {
        intResult = integerPart[i] + intResult;
        counter++;
        if (counter === 3 && i !== 0) {
            intResult = ' ' + intResult;
            counter = 0;
        }
    }

    // Собираем итог
    const formatted = fractionalPart !== undefined
        ? `${intResult}.${fractionalPart}`
        : intResult;

    return isNegative ? `-${formatted}` : formatted;
}




$('.content').on('click', 'a.dots-btn', function (e) {
    e.preventDefault(); // отменяем переход

	let dropdown = $(this).siblings('.dots-btn-dropdown');
	
	if (hasClass(dropdown, 'show')) {
		$('.dots-btn-dropdown').removeClass('show');
	} else {
		$('.dots-btn-dropdown').removeClass('show');
		dropdown.addClass('show');
	}
});


$('.content').on('click', 'a.dropdown-item', function (e) {
    e.preventDefault(); // отменяем переход
    
    let dropdown = $(this).closest('.dots-btn-dropdown');
    
    if (hasClass(dropdown, 'show')) {
        $('.dots-btn-dropdown').removeClass('show');
    } else {
        $('.dots-btn-dropdown').removeClass('show');
        dropdown.addClass('show');
    }
    redirect($(this).attr('href'))
});


$(document).on('click', function(e) {
    // Если клик не по кнопке и не внутри dropdown
    if (!$(e.target).closest('.dots-btn, .dots-btn-dropdown').length) {
		$('.dots-btn-dropdown').removeClass('show');
    }
});




$('a.filter-btn').on('click', function(e) {
    $(this).find('svg').toggleClass('filter-active');
});




$('.content').on('click', 'a.open-arrow-btn', function(e) {
    $(this).toggleClass('active');
    $(this).closest('.cards-group').toggleClass('active');
});




$(document).on("input", 'input[capitalize="on"], textarea[capitalize="on"]', function () {
    let val = $(this).val();
    if (val.length > 0) {
        $(this).val(val.charAt(0).toUpperCase() + val.slice(1));
    }
});



$(document).ready(function(){
    // Применяем маску ввода к полю
    $(".phone-number-input").inputmask({
        mask: "(99) 999-99-99",
        clearMaskOnLostFocus: false,
        // placeholder: "+998 (__) ___-__-__",
        showMaskOnHover: false, // Не показывать маску при наведении
        showMaskOnFocus: true, // Показывать маску при фокусе
    });
});






$("#geo-location-link").on("input focus click", function() {
    let url = $("#geo-location-link").val().trim();
    let params = new URL(url).searchParams;

    // Координаты точки (всегда есть в ссылке)
    let point = params.get("whatshere[point]"); // "72.361218,40.747977"

    // Центр карты (может отсутствовать на iPhone)
    let ll = params.get("ll");

    // Zoom (на iPhone хранится в whatshere[zoom])
    let zoom = params.get("z") || params.get("whatshere[zoom]") || 16;

    // Округляем zoom, чтобы не было дроби
    zoom = Math.round(zoom);

    // Если ll отсутствует (iPhone), то берём его из точки
    if (!ll && point) {
        ll = point;
    }

    // Составляем embed-ссылку с зелёным маркером
    let embedUrl = `https://yandex.ru/map-widget/v1/?ll=${ll}&z=${16}&pt=${point},pm2grm`;

    // Выводим результат
    // $("#result").val(embedUrl);
    $("#yandex-map-iframe").attr("src", embedUrl);
});




function clearSpace (str) {
	return str.replace(/\s+/g, '');
}




$(document).on("click", "a.copy-map-link-btn", function(e) {
    e.preventDefault(); // отменяем переход
    let link = $(this).attr("href");

    navigator.clipboard.writeText(link).then(() => {
        console.log("Скопировано:", link);
    }).catch(err => {
        console.error("Ошибка копирования:", err);
    });
});








