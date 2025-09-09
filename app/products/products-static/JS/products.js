// Принимает адрес и redirect'тит по ней
socket.on('update_product', function(data) {
    // data — это массив объектов [{id:..., name:...}, ...]
    $.each(data, function(index, product) {
        let existing = $("#products-list").find(`.list-item[ data-id="${product.id}"]`);

        let template = `
        <div class="col list-item" data-id="${ product.id }">
            <div class="card">
                <div class="card-body">
                    
                    <div class="card-title-wrapper">
                        <h5 class="card-title"> ${ product.name } </h5>
                        
                        <div class="dots-btn-wrapper">
                            <a href="#" class="dots-btn">
                                <svg width="5" height="19" viewBox="0 0 5 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="5" height="5" rx="2.5" fill="#4A5A6B"/>
                                    <rect y="7" width="5" height="5" rx="2.5" fill="#4A5A6B"/>
                                    <rect y="14" width="5" height="5" rx="2.5" fill="#4A5A6B"/>
                                </svg>
                            </a>

                            <div class="dropdown-menu dropdown-menu-end dots-btn-dropdown" data-popper-placement="bottom-end" style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate(-15px, 0px);">

                                <!-- item-->
                                <a href="${ product.edit_url }" class="dropdown-item notify-item">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.33334 2.66675H2.66667C2.31305 2.66675 1.97391 2.80722 1.72386 3.05727C1.47381 3.30732 1.33334 3.64646 1.33334 4.00008V13.3334C1.33334 13.687 1.47381 14.0262 1.72386 14.2762C1.97391 14.5263 2.31305 14.6667 2.66667 14.6667H12C12.3536 14.6667 12.6928 14.5263 12.9428 14.2762C13.1929 14.0262 13.3333 13.687 13.3333 13.3334V8.66675" stroke="#4A5A6B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12.3333 1.66665C12.5986 1.40144 12.9583 1.25244 13.3333 1.25244C13.7084 1.25244 14.0681 1.40144 14.3333 1.66665C14.5986 1.93187 14.7475 2.29158 14.7475 2.66665C14.7475 3.04173 14.5986 3.40144 14.3333 3.66665L8 9.99999L5.33334 10.6667L6 7.99999L12.3333 1.66665Z" stroke="#4A5A6B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span>Редактировать</span>
                                </a>

                                <!-- item-->
                                <a href="#" class="remove-product-btn dropdown-item notify-item"
									data-bs-toggle="modal"
									data-bs-target="#staticBackdrop"
									data-id="${ product.id }"    
									data-socket-name="remove-product"    
								>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M2 4H3.33333H14" stroke="#4A5A6B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M12.6667 3.99992V13.3333C12.6667 13.6869 12.5262 14.026 12.2761 14.2761C12.0261 14.5261 11.687 14.6666 11.3333 14.6666H4.66667C4.31304 14.6666 3.9739 14.5261 3.72386 14.2761C3.47381 14.026 3.33333 13.6869 3.33333 13.3333V3.99992M5.33333 3.99992V2.66659C5.33333 2.31296 5.47381 1.97382 5.72386 1.72378C5.97391 1.47373 6.31304 1.33325 6.66667 1.33325H9.33333C9.68695 1.33325 10.0261 1.47373 10.2761 1.72378C10.5262 1.97382 10.6667 2.31296 10.6667 2.66659V3.99992" stroke="#4A5A6B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M6.66667 7.33325V11.3333" stroke="#4A5A6B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M9.33333 7.33325V11.3333" stroke="#4A5A6B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
									<span>Удалить</span>
								</a>

                            </div>
                        </div>
                    </div>

                    <div class="product-text-wrapper">
                                            
                        <div class="product-text">
                            <span class="product-text-name">Категория:</span>
                            
                            <div class="product-text-value-wrapper">
                                <span class="product-text-value product-count"> ${ product.category } </span>
                            </div>
                        </div>

                    </div>

                    <div class="product-counts">

                        <div class="product-text">
                            <span class="product-text-name">Цена:</span>
                            
                            <div class="product-text-value-wrapper">
                                <span class="product-text-value product-count"> ${ product.price } сум</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
        `

		if (product.remove) {
			existing.remove();
		} else {
			// создаём новый элемент
			let newItem = $(template);
	
			if (existing.length > 0) {
				// если уже есть — заменяем
				existing.replaceWith(newItem);
			} else {
				// если нет — добавляем в конец
				$("#products-list").prepend(newItem);
			}
		}
    });
});




let item_data_for_remove = {
	cat_id: null,
	socket_name: null,
}

$(document).on('click', '.remove-product-btn', function () {
	item_data_for_remove.cat_id = $(this).attr('data-id');
	item_data_for_remove.socket_name = $(this).attr('data-socket-name');
});

$(document).on('click', '.cancel-remove-product-btn', function () {
	item_data_for_remove.cat_id = null;
	item_data_for_remove.socket_name = null;
});

$(document).on('click', '.confirm-remove-product-btn', function () {
	socket.emit(item_data_for_remove.socket_name, item_data_for_remove.cat_id);
});




$(document).on('change', '.product-status-input', function () {
    let item = $(this).closest('.list-item');
    let product_id = item.attr('data-id');
	socket.emit('server-update-product-status', product_id);
});


socket.on('client-update-product-status', function(data) {
    console.log(data);
    
    let status = data.status;
    let product_id = data.id;
    
    let item = $('#products-list').find(`.list-item[ data-id="${product_id}"]`);
    let input = $(item).find('.product-status-input');
    
    
    console.log('input', input);
    
    let label = $(input).next('.product-status-label');
    
    input.prop("checked", status);
    label.text(status ? 'Доступен' : 'Недоступен')
});