// Закрывает и очищает активный выпадающей список
function closeDropdownField(emptyStatus = false, displayNone = true) {
	if (dropdownFieldData.status) {
		if (displayNone) {
			$(dropdownFieldData.activeElement).closest('.dropdown-field-list-wrapper').css('display', 'none');
		}
		if (emptyStatus) {
			$(dropdownFieldData.activeElement).empty();
		}

		let container = $(dropdownFieldData.activeElement).closest('.dropdown-field-container');
		let hiddenInput = container.find('input[type=hidden]');

		if (hiddenInput.length) {
			let input = container.find('input:not([type=hidden])');
			let inputVal = $.trim(input.val());

			if (inputVal === '') {
				hiddenInput = container.find(`input[name=${hiddenInput.attr('name')}]`);
				hiddenInput.val('');
			}
		}

		dropdownFieldData.status = false;
		dropdownFieldData.activeElement = null;

		remove_active_element();

		if (dropdown_navigation.items !== null) {
			navigation_in_the_items(dropdown_navigation, null);
		}
	}
}




function visibility_of_search_groups(input) {
	let table_block = $(input).closest('.table_block');
	let searchValue = $.trim(input.val().toLowerCase());
	
	if (table_block.length) {
		let group_items = $(table_block).find('.group-item');
		
		if (table_block.length) {
			group_items.each(function () {
				let group_item = $(this);

				// Если значение поля пустая строка показываем все группы
				if (searchValue === '') {
					if (!has_a_class(group_item, 'dn')) {
						group_item.show();
					}
				} else {
					let list_elements = group_item.find('.list-element');
					let have_elements = false;
	
					list_elements.each(function () {
						let list_element = $(this);
						
						if (list_element.css('display') !== 'none') {
							have_elements = true;
						}
					});
	
					
					if (have_elements) {
						if (group_item.css('display') === 'none' && !has_a_class(group_item, 'dn')) {
							group_item.show();
						}
					} else {
						if (!has_a_class(group_item, 'dn')) {
							group_item.hide()
						}
					}
				}
			});
		}
	}
};




// При клике на страницу кроме самого выпад. списка закрывает его
function search_value_in_input(input, items_list, hidden_selector=false) {
	// Получаем значение из поля и приводим к нижнему регистру
	var searchValue = $.trim(input.val().toLowerCase());
	let result = false;

	items_list.each(function () {
		var itemText = $.trim($(this).text().toLowerCase());

		if (searchValue === '') {
			if (hidden_selector) {
				// let hide_element = $(this).closest(hidden_selector).show();
				let hide_element = $(this).closest(hidden_selector);
				
				if (hide_element.css('display') === 'none' && !hasClass(hide_element, 'dn')) {
					hide_element.show();
				}
			} else {
				if (!hasClass($(this), 'dn')) {
					$(this).show();
				}
			}
		} else {
			// Показываем элемент, если найдено совпадение
			if (itemText.indexOf(searchValue) !== -1) {
				if (hidden_selector && !hasClass($(this).closest(hidden_selector), 'dn')) {
					$(this).closest(hidden_selector).show();
				} else {
					if (!hasClass($(this), 'dn')) {
						$(this).show();
					}
				}
				result = true;
			} else { // Скрываем элемент, если нет совпадения
				if (hidden_selector) {
					let hidden_parent = $(this).closest(hidden_selector);
					if (!hasClass(hidden_parent, 'tag_field-dropdown-new_item') && !hasClass(hidden_parent, 'dn')) {
						$(hidden_parent).hide();
					}
				} else {
					if (!hasClass($(this), 'dn')) {
						$(this).hide();
					}
				}
			};
		}
	});

	visibility_of_search_groups(input);
	return result;
}




function get_key_input_data (form, key_input_selectors_obj) {
	let result = {};

	for (let _obj in key_input_selectors_obj) {
		let item = key_input_selectors_obj[_obj];
		let key = item[0];
		let selector = item[1];
		let key_input = form.find(selector);

		if (key_input.length) {
			let key_input__container = key_input.closest('.dropdown-field-container')
			
			if (key_input__container.length) {
				let key_hidden_input = key_input__container.find('input[type=hidden]')
				if (key_hidden_input.length) {
					key_input = key_hidden_input;
				}
			}
		}

		let key_input_val = $.trim(key_input.val());

		if (key_input_val !== '') {
			result[key] = key_input_val;
		} else {
			result[key] = '';
		}
	}
	return result;
}




// При клике на страницу кроме самого выпад. списка закрывает его
$(document).on('click focus input', function (event) {
	let container = $(event.target).closest('.dropdown-field-container');
	// console.log('event.target ->', event.target)
	// console.log('container ->', container)
	if (!container.length) closeDropdownField();
});




// При фокусе, вводе или клике на поле с выпадающим списком активирует выпадающий список
$(document).on('focus input click', '.dropdown-field-container input:not([type=hidden])', function (event) {
	if (dropdownFieldData.status) closeDropdownField();

	let input = $(this);
	let val_trim = $.trim(input.val());

	let form = input.closest('form');
	let container = input.closest('.dropdown-field-container');
	let dropdown = container.find('.dropdown-field-list');
	let dropdown_items = dropdown.find('.dropdown-field-list-item');

	dropdownFieldData.status = true;
	dropdownFieldData.activeElement = dropdown;

	const dropdown_obj = {
		'element': $(dropdown),
		'Enter': '.dropdown-field-list-item',
	};
	add_active_element(dropdown_obj);

	let handler_name = dropdown.attr('autofill-handler');
	let search_value_result = null

	if (event.type === 'input') {
		search_value_result = search_value_in_input(
			input,
			dropdown.find('.dropdown-field-list-item-main-text'),
			'.dropdown-field-list-item'
		);
    }

	if ($(this).attr('data-add_new_item') === 'on' && !search_value_result) {
		let new_tag_item = $(dropdown).find('.tag_field-dropdown-new_item')

		if (!new_tag_item.length && $.trim(input.val()) !== '') {
			$(dropdown).append(
				`<div class="tag_field-dropdown-item dropdown-field-list-item tag_field-dropdown-new_item">
					<p>${$.trim(input.val())}</p>
				</div>`
			);
		}
	}

	let addlData = dropdown.attr('addl-data');
	let key_input_selectors = dropdown.attr('key-inputs');
	let key_input_selectors_obj = eval(key_input_selectors);

	if (handler_name) {
		// Пример заполнения
		// <div
		// 		class = "dropdown-field-list"
		// 		autofill-handler = "get_profession_names_for_dropdown"
		// 		search-ilike = "true"
		// 		addl-data = data
		// 		key-inputs = "[ ['test', '.ru_name'], ['test1', '.uz_name'] ]"
		//      autofill-other-fields-handler="get_data_for_fill_fields__lab_warehouse_item_type_for_journal"
		// >
		// </div>
		// -----   -----   -----

		let ilike_status = dropdown.attr('search-ilike');
		let new_parent_input__value = null
		let new_parent = false

		if (key_input_selectors) {
			new_parent_input__value = get_key_input_data(form, key_input_selectors_obj);
			
			if (input.attr('name') in parent_input__value) {
				if (!deepEqual(parent_input__value[input.attr('name')], new_parent_input__value)) {
					new_parent = true
					dropdown.empty();
				}
			}
			parent_input__value[input.attr('name')] = new_parent_input__value;
		}
		
		let query_data = {};
		if (addlData) {
			query_data.addl_data = addlData;
		}
		if (key_input_selectors) {
			query_data.key_values = new_parent_input__value;
		}

		if ($('#page_key').length) {
			query_data.page_key = $('#page_key').attr('data-key')
		}
		
		if (ilike_status === 'true' && event.type !== 'click' && event.type !== 'focus') {
			if (val_trim !== '') {
				query_data.value = val_trim;
				socket.emit(handler_name, query_data);
			}
		} else {
			if (!dropdown_items.length || dropdown_items.css('display') === 'none') {
				if (!search_value_result && ilike_status !== 'true') {
					
					if (new_parent || key_input_selectors) {
						socket.emit(handler_name, query_data);
					} else {
						if (query_data.page_key) {
							socket.emit(handler_name, query_data);
						}
						
						if (query_data.addl_data) {
							socket.emit(handler_name, query_data);
						} else {
							socket.emit(handler_name);
						}
					}
				}
			}
		}
	}
	container.find('.dropdown-field-list-wrapper').css('display', 'block');
});





let activeExpensesItem = null;


// При клике на элемент выпадающего списка присваивает текст item'а input'у как значение
// и отключает активный выпадающий список
$(document).on('click', '.dropdown-field-container .dropdown-field-list-item', function () {
	let empty_status = false;
	let display_none = false;

	if (!hasClass($(this), 'dropdown-field-list-item-disabled')) {
		if (!hasClass($(this), 'tag_field-dropdown-item')) {
		
			let container = $(this).closest('.dropdown-field-container');

			let input = container.find('input:not([type=hidden])');
			let hidden_input = $(container).find('input[type=hidden]');

			let this_option_text = $.trim($(this).find('.dropdown-field-list-item-main-text').text());
			let this_option_attr = $(this).attr('data-value');

			if (this_option_attr && hidden_input.length) {
				put_value_in_hidden_tag(hidden_input, this_option_attr);
			}
			input.val(this_option_text);
			
			empty_status = true;
			display_none = true;
			
			let dropdown = container.find('.dropdown-field-list');
			let fieldAutofillHandler = dropdown.attr('autofill-other-fields-handler');

			activeExpensesItem = dropdown;
			
			if (fieldAutofillHandler) {
				this_field_form = dropdown.closest('form');
				
				let query_data = {option_text: this_option_text};
				if (this_option_attr) query_data['option_attr'] = this_option_attr
				
				socket.emit(fieldAutofillHandler, query_data);
			}
		
		}
		closeDropdownField(empty_status, display_none);
	}
});





// Принимает ответ от сервера и заполняет активный выпадающий список элементами
socket.on('fill_in_the_dropdown', function (response) {
	// response = [ {
	// 	 	'disabled': true,
	// 	 	'text': 'val',
	// 	 	'addl_data': val,
	// 	 	'addl_tag': '<div>val</div>'
	// } ]

	if (dropdownFieldData.status) {
		let dropdown = dropdownFieldData.activeElement;
		
		let select_class_name = '';
		if (hasClass(dropdown, 'tag_field-dropdown-items_list')) {
			select_class_name = 'tag_field-dropdown-item ';
		}
		let new_item = dropdown.find('.tag_field-dropdown-new_item');
		let new_item_text = null;

		if (new_item.length) {
			let dropdown__items = dropdown.find('.dropdown-field-list-item');
			dropdown__items.each(function () {
				if (!hasClass($(this), 'tag_field-dropdown-new_item')) {
					$(this).remove();
				} else {
					new_item_text = $.trim(new_item.find('.dropdown-field-list-item-text').text())
				}
			});
		} else {
			dropdown.empty();
		}

		response.forEach(function (tag_value) {
			let addl_tag = `<span class="dropdown-field-list-item-text dropdown-field-list-item-additional-text">${tag_value.addl_tag}</span>
				` ? tag_value.addl_tag : '';
			let addl_data = tag_value.addl_data ? `data-value=${tag_value.addl_data}` : '';

			if (tag_value.text.indexOf(new_item_text) !== -1) {
				$(new_item).remove();
			}
			
			let disabled = tag_value.disabled ? 'autocomplete_item-disabled' : ''
			$(dropdown).append(
				`<div class="${select_class_name}dropdown-field-list-item ${disabled}" ${addl_data}>
					<span class="dropdown-field-list-item-text dropdown-field-list-item-main-text">${tag_value.text}</span>
					${addl_tag}
				</div>
				`
			);
		});
	};
});




$("#search-input").on("keyup", function() {
    let value = $(this).val().toLowerCase(); // текст из поиска
    $(".items-block .list-item").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});
