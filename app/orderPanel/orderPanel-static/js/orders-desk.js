// Принимает адрес и redirect'тит по ней
socket.on('update_order', function(data) {
    // data — это массив объектов [{id:..., name:...}, ...]
    $.each(data, function(index, order) {
        let existing = $("#orders-list").find(`.list-item[ data-id="${order.id}"]`);

        let dots_btn = `
			<div class="dots-btn-wrapper">
				<a href="#" class="dots-btn">
					<svg width="5" height="19" viewBox="0 0 5 19" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect width="5" height="5" rx="2.5" fill="#ffffff"/>
						<rect y="7" width="5" height="5" rx="2.5" fill="#ffffff"/>
						<rect y="14" width="5" height="5" rx="2.5" fill="#ffffff"/>
					</svg>
				</a>

				<div class="dropdown-menu dropdown-menu-end dots-btn-dropdown" data-popper-placement="bottom-end" style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate(-15px, 0px);">

					<!-- item-->
					<a href="#" data-status="NEW" class="order-status-btn dropdown-item notify-item">
						<span> Новый </span>
					</a>

					<!-- item-->
					<a href="#" data-status="CONFIRMED" class="order-status-btn dropdown-item notify-item">
						<span> Подтвержден </span>
					</a>

					<!-- item-->
					<a href="#" data-status="PREPARING" class="order-status-btn dropdown-item notify-item">
						<span> Готовится </span>
					</a>

					<!-- item-->
					<a href="#" data-status="READY" class="order-status-btn dropdown-item notify-item">
						<span> Готов </span>
					</a>

					<!-- item-->
					<a href="#" data-status="COMPLETED" class="order-status-btn dropdown-item notify-item">
						<span> Выполнен </span>
					</a>

					<!-- item-->
					<a href="#" data-status="CANCELED" class="order-status-btn dropdown-item notify-item">
						<span> Отменен </span>
					</a>

				</div>
			</div>
			`
		
		
        let template = `
        <!-- order -->
		<div class="col-sm-6 col-lg-4 list-item" data-id="${ order.id }">
			<div class="order-card order-card-yellow card d-block">
				<div class="order-card-header card-header title-and-dotBtn-card-header">
					<h5 class=""> ${ order.uniq_number } </h5>
					
					${ CLIENT ? '' : dots_btn }
				</div>

				<div class="card-body">
					<div class="card-title-wrapper">
						<h5 class="card-title">Заказчик: ${ order.client_name }</h5>
					</div>
					
					<div class="product-text-wrapper">
						
						<div class="product-text">
							<span class="product-text-name">Телефон:</span>
							
							<div class="product-text-value-wrapper">
								<div class="product-text-value product-type-text">
									<a href="tel:+998${ order.client_phone }">+998 ${ order.client_phone }</a>
								</div>
							</div>
						</div>

						<div class="product-text">
							<span class="product-text-name">Статус:</span>
							
							<div class="product-text-value-wrapper">
								<div class="product-text-value order-status">
									${ order.status }
								</div>
							</div>
						</div>

						<div class="product-text">
							<span class="product-text-name">Время создания:</span>
							
							<div class="product-text-value-wrapper">
								<div class="product-text-value product-type-text">
									${ order.create_datetime }
								</div>
							</div>
						</div>

						<div class="product-text">
							<span class="product-text-name">Время изменения:</span>
							
							<div class="product-text-value-wrapper">
								<div class="product-text-value order-update-datetime">
									${ order.update_datetime }
								</div>
							</div>
						</div>

					</div>

					<div class="product-counts">
						<div class="product-text">
							<span class="product-text-name">Общая сумма:</span>
							
							<div class="product-text-value-wrapper">
								<span class="product-text-value product-count"> ${ order.total_price } сум</span>
							</div>
						</div>
					</div>

					<div class="btns-wrapper-row-end" style="margin-top: 20px;">
						<a href="${ order.order_url }" class="btn btn-primary">
							Подробнее
						</a>
					</div>
				</div><!-- end card-body-->
			</div> <!-- end card-->
		</div><!-- end col -->
		<!-- order -->
        `

		if (order.remove) {
			existing.remove();
		} else {
			// создаём новый элемент
			let newItem = $(template);
	
			if (existing.length > 0) {
				// если уже есть — заменяем
				existing.replaceWith(newItem);
			} else {
				// если нет — добавляем в конец
				$("#orders-list").prepend(newItem);
			}
		}
    });
});




$(document).on('click', '.order-status-btn', function (e) {
	e.preventDefault()

	let order_id = $(this).closest('.list-item').attr('data-id');
	let status = $(this).attr('data-status');
	let data = {
		'id': order_id,
		'status': status,
	}
	socket.emit('server-update-order-status', data);
});



socket.on('client-update-order-status', function (data) {
	let order = $("#orders-list").find(`.list-item[data-id="${data.id}"]`);
	order.find('.order-status').text(data.status);
	order.find('.order-update-datetime').text(data.update_datetime);
});


$(document).ready(function () {
	socket.emit('server-update-order-status-count');
});


socket.on('update-order-status-count', function (data) {
	$("#total-count-status-new").text(data.new);
	$("#total-count-status-confirmed").text(data.confirmed);
	$("#total-count-status-preparing").text(data.preparing);
	$("#total-count-status-ready").text(data.ready);
	$("#total-count-status-completed").text(data.completed);
	$("#total-count-status-canceled").text(data.canceled);
});