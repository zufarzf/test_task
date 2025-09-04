// #####   #####   KEYDOWN   #####   #####


// Здесь хранятся временные объекты активных элементов
// для управления клавиатурой
let activeElements = []
// let activeElements = [
// 	{
// 		'element': element,
// 		'Enter': 'selector',
// 		'Shift+Enter': 'selector',
// 		'Ctrl+Enter': 'selector',
// 		'Escape': 'selector',
// 	},
// 	...
// ]


// =====   =====   =====   =====   =====


// Добавляет активный элемент в списка
function add_active_element(obj) {
	activeElements.push(obj)
};


// Удаляет активный элемент из списка
function remove_active_element() {
	if (activeElements.length > 0) {
		activeElements.splice(-1, 1);
	};
};


// Выдаёт последний активный элемент из списка
function get_active_element() {
	let elem_len = activeElements.length

	if (elem_len > 0) {
		return activeElements[elem_len - 1];
	} return null;
};



// Навигация по элементам списка(Меню, выпадающие списки)
function navigation_in_the_items(obj, navigation) {
	let old_element = obj.selected_item;
	let item_index = 0;

	if (navigation === null) {
		for (let key in obj) {
			obj[key] = null;
		}
	}

	if (old_element || navigation === null) {
		$(old_element).toggleClass('navigation-selected_item');
		if (navigation === null) return
	};

	if (obj.active_item) {
		item_index = obj.items.index(old_element ? old_element : obj.active_item);
	} else {
		item_index = obj.items.index(
			old_element ? old_element : 0
		);
	}

	if (!obj.old_val && !old_element) {
		item_index = navigation ? obj.items.length - 1 : 0;
	} else {
		item_index = navigation ? item_index - 1 : item_index + 1;
	}

	item_index = item_index === -1 ? obj.items.length - 1 : item_index;
	item_index = (obj.items.length - 1) < item_index ? 0 : item_index;

	if (obj.active_item && obj.items.index(obj.active_item) === item_index) {
		item_index = navigation ? item_index - 1 : item_index + 1;

		item_index = item_index === -1 ? obj.items.length - 1 : item_index;
		item_index = (obj.items.length - 1) < item_index ? 0 : item_index;
	}

	// делаю перескок от скрытых строк в выпад. списке
	for (let i = 0; true; i++) {
		if ($(obj.items[item_index]).css('display') === 'none') {
			item_index = navigation ? item_index - 1 : item_index + 1;

			item_index = item_index === -1 ? obj.items.length - 1 : item_index;
			item_index = (obj.items.length - 1) < item_index ? 0 : item_index;
		}
		else {
			break
		}
	}

	let newSelectItem = obj.items[item_index];

	obj.selected_item = newSelectItem;
	$(obj.selected_item).toggleClass('navigation-selected_item');

	return obj.selected_item
}







// Данные для работы функционала навигации по выпадающему списку
const dropdown_navigation = {
	addl_tag_func: null,
	old_val: null,
	old_addl_attr: null,
	items: null,
	selected_item: null,
};


// Данные активного выпадающего списка
const dropdownFieldData = {
	status: false,
	activeElement: null,
}


// Ловим нажатия клавиш
$(document).keydown(function (event) {
	// Обрабатывает нажатие клавиш для выпадающего списка
	// =====   =====   =====   =====   =====
	if (activeElements.length > 0 && dropdownFieldData.status) {
		let active_attr = get_active_element()
		let dropdown = $(active_attr['element'])
		let container = dropdown.closest('.dropdown-field-container');

		let input = container.find('input[type=text]');
		let hidden_input = container.find('input[type=hidden]');

		let this_option = null;


		if (!dropdown_navigation.items) {
			dropdown_navigation.items = dropdown.find('.dropdown-field-list-item');
			dropdown_navigation.old_val = $(input).val();
			dropdown_navigation.old_addl_attr = $(hidden_input).val();
		}

		// Подтверждение
		if (event.key === 'Enter') {
			event.preventDefault();

			let dropdown = container.find('.dropdown-field-list');
			let fieldAutofillHandler = dropdown.attr('autofill-other-fields-handler');
			
			if (fieldAutofillHandler) {
				let query_data = { option_text: $(input).val() };
				
				if (hidden_input.length) {
					query_data['option_attr'] = $(hidden_input).val();
				}
				
				socket.emit(fieldAutofillHandler, query_data);
			}


			if (!hasClass(container, 'tag_field-dropdown')) {
				display_none = true;
				closeDropdownField(true);
			}
			else {
				this_option = $(dropdown_navigation.selected_item);
				let this_option_text = $.trim(this_option.find('.dropdown-field-list-item-main-text').text());
				
				if (this_option_text !== '') {
					let this_option_attr = this_option.attr('data-additional');
					let tag_field_container = container.closest('.tag_field-container');
					
					add_options_in_select(tag_field_container, this_option_attr, this_option_text);
					$(this_option).remove();
				}
			}
		}

		// Перемещение вверх
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			this_option = navigation_in_the_items(dropdown_navigation, false);
			
			if (hasClass(this_option, 'dropdown-field-list-item-disabled')) {
				this_option = navigation_in_the_items(dropdown_navigation, false);
			}
		}

		// Перемещение вниз
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			this_option = navigation_in_the_items(dropdown_navigation, true);
		}

		// Фиксация перемещения
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			let autocomplete_item = dropdown.find('.dropdown-field-list-item');

			if (autocomplete_item.length) {

				dropdown.animate({
					scrollTop: $(this_option).offset().top - dropdown.offset().top + dropdown.scrollTop() - 8
				}, 50)

				let this_option_text = $.trim($(this_option).find('.dropdown-field-list-item-main-text').text());

				if (!hasClass($(container), 'tag_field-dropdown')) {
					let this_option_attr = $(this_option).attr('data-value');

					if (hasClass(this_option, 'dropdown-field-list-item-disabled')) {
						this_option = navigation_in_the_items(dropdown_navigation, true);
						
						if (this_option_attr || hidden_input.length) {
							put_value_in_hidden_tag(hidden_input, '');
						}
						$(input).val('');
					} else {
						if (this_option_attr || hidden_input.length) {
							put_value_in_hidden_tag(hidden_input, this_option_attr)
						};
						$(input).val(this_option_text);
					}
				}
			}
		}

		if (event.key === 'Escape') {
			event.preventDefault();

			if (!hasClass($(container), 'tag_field-dropdown')) {
				$(input).val(dropdown_navigation.old_val);

				if (dropdown_navigation.old_addl_attr) {
					put_value_in_hidden_tag(hidden_input, dropdown_navigation.old_addl_attr);
				}
			}
			closeDropdownField();
		}
	}
	// =====   =====   =====   =====   =====
	// Обрабатывает нажатие клавиш для выпадающего списка




	// Проверяем комбинацию клавиш Shift + Enter
	// =====   =====   =====   =====   =====
	else if (activeElements.length > 0) {
		if (
			event.key === 'Enter' || event.key === 'Escape' ||
			(event.shiftKey && event.key === 'Enter') ||
			(event.ctrlKey && event.key === 'Enter') ||
			(event.key === 'Escape' || event.keyCode === 27)
		) {

			let active_attr = get_active_element()
			let active_el = $(active_attr['element'])
			// -----   -----   -----

			if (event.key === 'Enter') {
				if (active_attr.Enter) {
					event.preventDefault();
					active_el.find(active_attr['Enter']).click();
				}
			}
			// -----   -----   -----

			if (event.shiftKey && event.key === 'Enter') {
				event.preventDefault();
				active_el.find(active_attr['Shift+Enter']).click();
			}
			// -----   -----   -----

			if (event.ctrlKey && event.key === 'Enter') {
				event.preventDefault();
				active_el.find(active_attr['Ctrl+Enter']).click();
			}
			// -----   -----   -----

			if (event.key === 'Escape' || event.keyCode === 27) {
				event.preventDefault();
				active_el.find(active_attr['Escape']).click();
			}
			// -----   -----   -----
		};
	}
	// =====   =====   =====   =====   =====
});


// #####   #####   KEYDOWN   #####   #####